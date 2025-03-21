<?php

namespace App\Http\Controllers;

use App\Enums\PriorityEnum;
use App\Enums\StatusEnum;
use App\Models\Complaint;
use App\Models\ComplaintAttachment;
use App\Models\ComplaintStatusHistory;
use App\Models\ComplaintComment;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ComplaintsController extends Controller
{
    /**
     * Display a listing of all complaints.
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        // Different queries based on user role
        $user = Auth::user();
        $query = Complaint::with(['category', 'user']);
        
        // Filter by user role
        if ($user->role === 'citizen') {
            // Citizens can only see their own complaints
            $query->where('user_id', $user->id);
        } elseif ($request->has('user_id') && ($user->role === 'admin' || $user->role === 'moderator')) {
            // Admins/moderators can filter by user
            $query->where('user_id', $request->user_id);
        }
        
        // Filter by category
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        
        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        // Filter by priority
        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }
        
        // Sort by created date (default: newest first)
        $sortDirection = $request->has('sort_direction') ? $request->sort_direction : 'desc';
        $query->orderBy('created_at', $sortDirection);
        
        // Paginate results
        $perPage = $request->has('per_page') ? $request->per_page : 15;
        $complaints = $query->paginate($perPage);
        
        return response()->json($complaints);
    }

    /**
     * Get a specific complaint with details.
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $user = Auth::user();
        $complaint = Complaint::with(['attachments', 'category', 'user', 'statusHistory.user', 'comments' => function($query) use ($user) {
            // Only show internal comments to admin/moderator
            if ($user->role === 'citizen') {
                $query->where('is_internal', false);
            }
        }])->find($id);
        
        if (!$complaint) {
            return response()->json(['message' => 'Complaint not found'], 404);
        }
        
        // Check if the user is authorized to view this complaint
        if ($user->role === 'citizen' && $complaint->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized to access this complaint'], 403);
        }
        
        return response()->json($complaint);
    }

    /**
     * Store a newly created complaint.
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Validate complaint data
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'category_id' => 'required|exists:complaint_categories,id',
            'priority' => ['required', Rule::enum(PriorityEnum::class)],
            'attachments' => 'sometimes|array',
            'attachments.*' => 'file|max:5120|mimes:jpg,jpeg,png,pdf,doc,docx'
        ]);
        
        try {
            // Use database transaction for consistency
            return DB::transaction(function() use ($request, $validated) {
                // Create complaint
                $complaint = Complaint::create([
                    'user_id' => Auth::id(),
                    'title' => $validated['title'],
                    'description' => $validated['description'],
                    'location' => $validated['location'],
                    'category_id' => $validated['category_id'],
                    'status' => StatusEnum::Pending,
                    'priority' => PriorityEnum::from($validated['priority'])
                ]);
                
                // Store complaint status history
                ComplaintStatusHistory::create([
                    'complaint_id' => $complaint->id,
                    'status' => StatusEnum::Pending,
                    'user_id' => Auth::id(),
                    'note' => 'Complaint submitted'
                ]);
                
                // Handle file uploads
                if ($request->hasFile('attachments')) {
                    foreach ($request->file('attachments') as $file) {
                        $path = $file->store('complaints/attachments');
                        
                        ComplaintAttachment::create([
                            'complaint_id' => $complaint->id,
                            'file_path' => $path,
                            'file_type' => $file->getClientMimeType()
                        ]);
                    }
                }
                
                return response()->json($complaint->load('attachments', 'category'), 201);
            });
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to create complaint',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update an existing complaint.
     * 
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $complaint = Complaint::find($id);
        
        if (!$complaint) {
            return response()->json(['message' => 'Complaint not found'], 404);
        }
        
        $user = Auth::user();
        
        // Only the owner or admin/moderator can update
        if ($user->role === 'citizen' && $complaint->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized to update this complaint'], 403);
        }
        
        // Citizens can only update their complaints if they're still pending
        if ($user->role === 'citizen' && $complaint->status !== StatusEnum::Pending) {
            return response()->json(['message' => 'Cannot update complaint that is already being processed'], 403);
        }
        
        // Validate request data
        $validationRules = [
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'location' => 'sometimes|string|max:255',
            'category_id' => 'sometimes|exists:complaint_categories,id',
            'attachments' => 'sometimes|array',
            'attachments.*' => 'file|max:5120|mimes:jpg,jpeg,png,pdf,doc,docx'
        ];
        
        // Only admin/moderator can update status and priority
        if ($user->role === 'admin' || $user->role === 'moderator') {
            $validationRules['status'] = ['sometimes', Rule::enum(StatusEnum::class)];
            $validationRules['priority'] = ['sometimes', Rule::enum(PriorityEnum::class)];
            $validationRules['status_note'] = 'sometimes|string|nullable';
        }
        
        $validated = $request->validate($validationRules);
        
        try {
            return DB::transaction(function() use ($request, $validated, $complaint, $user) {
                // Update complaint fields
                $statusChanged = false;
                $oldStatus = $complaint->status;
                
                if (isset($validated['title'])) {
                    $complaint->title = $validated['title'];
                }
                
                if (isset($validated['description'])) {
                    $complaint->description = $validated['description'];
                }
                
                if (isset($validated['location'])) {
                    $complaint->location = $validated['location'];
                }
                
                if (isset($validated['category_id'])) {
                    $complaint->category_id = $validated['category_id'];
                }
                
                if (isset($validated['priority'])) {
                    $complaint->priority = PriorityEnum::from($validated['priority']);
                }
                
                if (isset($validated['status'])) {
                    $complaint->status = StatusEnum::from($validated['status']);
                    $statusChanged = $complaint->status !== $oldStatus;
                }
                
                $complaint->save();
                
                // Create status history record if status was changed
                if ($statusChanged) {
                    ComplaintStatusHistory::create([
                        'complaint_id' => $complaint->id,
                        'status' => $complaint->status,
                        'user_id' => $user->id,
                        'note' => $validated['status_note'] ?? null
                    ]);
                }
                
                // Handle file uploads
                if ($request->hasFile('attachments')) {
                    foreach ($request->file('attachments') as $file) {
                        $path = $file->store('complaints/attachments');
                        
                        ComplaintAttachment::create([
                            'complaint_id' => $complaint->id,
                            'file_path' => $path,
                            'file_type' => $file->getClientMimeType()
                        ]);
                    }
                }
                
                // Reload complaint with related data
                $complaint->load('attachments', 'category', 'statusHistory');
                
                return response()->json($complaint);
            });
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to update complaint',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a complaint.
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $complaint = Complaint::find($id);
        
        if (!$complaint) {
            return response()->json(['message' => 'Complaint not found'], 404);
        }
        
        $user = Auth::user();
        
        // Only the owner or admin can delete
        if ($user->role === 'citizen' && $complaint->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized to delete this complaint'], 403);
        }
        
        // Citizens can only delete their complaints if they're still pending
        if ($user->role === 'citizen' && $complaint->status !== StatusEnum::Pending) {
            return response()->json(['message' => 'Cannot delete complaint that is already being processed'], 403);
        }
        
        try {
            return DB::transaction(function() use ($complaint) {
                // Delete attachments from storage
                foreach ($complaint->attachments as $attachment) {
                    Storage::delete($attachment->file_path);
                }
                
                // Delete the complaint (this will cascade delete related records if set in the model)
                $complaint->delete();
                
                return response()->json(['message' => 'Complaint deleted successfully']);
            });
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to delete complaint',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Add a comment to a complaint.
     * 
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function addComment(Request $request, $id)
    {
        $complaint = Complaint::find($id);
        
        if (!$complaint) {
            return response()->json(['message' => 'Complaint not found'], 404);
        }
        
        $user = Auth::user();
        
        // Check if user can comment on this complaint
        if ($user->role === 'citizen' && $complaint->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized to comment on this complaint'], 403);
        }
        
        $validated = $request->validate([
            'comment' => 'required|string',
            'is_internal' => 'sometimes|boolean'
        ]);
        
        // Only admin/moderator can create internal comments
        $isInternal = false;
        if ($user->role !== 'citizen' && isset($validated['is_internal'])) {
            $isInternal = $validated['is_internal'];
        }
        
        try {
            $comment = ComplaintComment::create([
                'complaint_id' => $complaint->id,
                'user_id' => $user->id,
                'comment' => $validated['comment'],
                'is_internal' => $isInternal
            ]);
            
            return response()->json($comment->load('user'), 201);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to add comment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a comment.
     * 
     * @param int $complaintId
     * @param int $commentId
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteComment($complaintId, $commentId)
    {
        $comment = ComplaintComment::where('complaint_id', $complaintId)
            ->where('id', $commentId)
            ->first();
        
        if (!$comment) {
            return response()->json(['message' => 'Comment not found'], 404);
        }
        
        $user = Auth::user();
        
        // Only comment owner or admin/moderator can delete
        if ($user->role === 'citizen' && $comment->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized to delete this comment'], 403);
        }
        
        try {
            $comment->delete();
            return response()->json(['message' => 'Comment deleted successfully']);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to delete comment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all attachments for a complaint.
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAttachments($id)
    {
        $complaint = Complaint::with('attachments')->find($id);
        
        if (!$complaint) {
            return response()->json(['message' => 'Complaint not found'], 404);
        }
        
        $user = Auth::user();
        
        // Check if user can view attachments
        if ($user->role === 'citizen' && $complaint->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized to view these attachments'], 403);
        }
        
        return response()->json($complaint->attachments);
    }

    /**
     * Download an attachment.
     * 
     * @param int $complaintId
     * @param int $attachmentId
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse|\Illuminate\Http\JsonResponse
     */
    public function downloadAttachment($complaintId, $attachmentId)
    {
        $attachment = ComplaintAttachment::where('complaint_id', $complaintId)
            ->where('id', $attachmentId)
            ->first();
        
        if (!$attachment) {
            return response()->json(['message' => 'Attachment not found'], 404);
        }
        
        $complaint = Complaint::find($complaintId);
        $user = Auth::user();
        
        // Check if user can download attachment
        if ($user->role === 'citizen' && $complaint->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized to download this attachment'], 403);
        }
        
        if (!Storage::exists($attachment->file_path)) {
            return response()->json(['message' => 'File not found on server'], 404);
        }
        
        return Storage::download($attachment->file_path);
    }

    /**
     * Delete an attachment.
     * 
     * @param int $complaintId
     * @param int $attachmentId
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteAttachment($complaintId, $attachmentId)
    {
        $attachment = ComplaintAttachment::where('complaint_id', $complaintId)
            ->where('id', $attachmentId)
            ->first();
        
        if (!$attachment) {
            return response()->json(['message' => 'Attachment not found'], 404);
        }
        
        $complaint = Complaint::find($complaintId);
        $user = Auth::user();
        
        // Only the owner or admin/moderator can delete attachments
        if ($user->role === 'citizen' && $complaint->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized to delete this attachment'], 403);
        }
        
        // Citizens can only delete attachments for pending complaints
        if ($user->role === 'citizen' && $complaint->status !== StatusEnum::Pending) {
            return response()->json(['message' => 'Cannot delete attachment from complaint that is already being processed'], 403);
        }
        
        try {
            // Delete file from storage
            if (Storage::exists($attachment->file_path)) {
                Storage::delete($attachment->file_path);
            }
            
            // Delete record
            $attachment->delete();
            
            return response()->json(['message' => 'Attachment deleted successfully']);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to delete attachment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get status history for a complaint.
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getStatusHistory($id)
    {
        $complaint = Complaint::find($id);
        
        if (!$complaint) {
            return response()->json(['message' => 'Complaint not found'], 404);
        }
        
        $user = Auth::user();
        
        // Check if user can view status history
        if ($user->role === 'citizen' && $complaint->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized to view this status history'], 403);
        }
        
        $history = ComplaintStatusHistory::with('user')
            ->where('complaint_id', $id)
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json($history);
    }
    
    /**
     * Get complaints dashboard statistics.
     * Admin/moderator only.
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function getStatistics()
    {
        $user = Auth::user();
        
        if ($user->role === 'citizen') {
            return response()->json(['message' => 'Unauthorized to access statistics'], 403);
        }
        
        // Count complaints by status
        $byStatus = Complaint::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get();
        
        // Count complaints by priority
        $byPriority = Complaint::select('priority', DB::raw('count(*) as count'))
            ->groupBy('priority')
            ->get();
        
        // Count complaints by category
        $byCategory = Complaint::select('category_id', DB::raw('count(*) as count'))
            ->with('category:id,name')
            ->groupBy('category_id')
            ->get();
        
        // Recent activity
        $recentActivity = ComplaintStatusHistory::with(['complaint:id,title', 'user:id,name'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();
        
        // Monthly complaints count (last 6 months)
        $monthlyStats = Complaint::select(
                DB::raw('YEAR(created_at) as year'),
                DB::raw('MONTH(created_at) as month'),
                DB::raw('count(*) as count')
            )
            ->whereRaw('created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)')
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();
        
        return response()->json([
            'by_status' => $byStatus,
            'by_priority' => $byPriority,
            'by_category' => $byCategory,
            'recent_activity' => $recentActivity,
            'monthly_stats' => $monthlyStats,
            'total_complaints' => Complaint::count(),
            'pending_complaints' => Complaint::where('status', StatusEnum::Pending)->count(),
            'resolved_complaints' => Complaint::where('status', StatusEnum::Resolved)->count(),
        ]);
    }
    
    /**
     * Get all user's own complaints.
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserComplaints(Request $request)
    {
        $user = Auth::user();
        
        $query = Complaint::with(['category'])
            ->where('user_id', $user->id);
        
        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        // Sort by created date (default: newest first)
        $sortDirection = $request->has('sort_direction') ? $request->sort_direction : 'desc';
        $query->orderBy('created_at', $sortDirection);
        
        // Paginate results
        $perPage = $request->has('per_page') ? $request->per_page : 15;
        $complaints = $query->paginate($perPage);
        
        return response()->json($complaints);
    }
}