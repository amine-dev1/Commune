<?php

namespace App\Http\Controllers;

use App\Enums\PriorityEnum;
use App\Enums\StatusEnum;
use App\Models\Complaint;
use App\Models\ComplaintAttachment;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ComplaintsController extends Controller
{
    public function get_Complaint(){
    }
    public function store(Request $request){
    // validation de reclamation
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
        $complaint = Complaint::create([
            'user_id' =>auth()->id(),
            'title' => $validated['title'],
            'description' => $validated['description'],
            'location' => $validated['location'],
            'category_id' => $validated['category_id'],
            'status' => StatusEnum::Pending,
            'priority' => PriorityEnum::from($validated['priority'])
        ]);
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
        return response()->json($complaint->load('attachments'), 201);

    }
    catch(\Exception $e){}
}
    public function show(Request $id){
        $complaint = Complaint::with(['attachments', 'category'])->find($id);
        if (!$complaint) {
            return response()->json(['message' => 'Complaint not found'], 404);
        }
        return response()->json($complaint);
    }

}