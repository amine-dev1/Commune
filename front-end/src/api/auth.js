import api from './axiosConfig';

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('authToken', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('authToken');
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/api/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const fetchUser = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('No authentication token found');
    
    const response = await api.get('api/user', { // Changed from '/api/user' to '/user'
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.data) throw new Error('Invalid user data format');
    
    return {
      name: response.data.name,
      email: response.data.email,
      role: response.data.role
    };
    
  } catch (error) {
    console.error('Fetch user error:', error.response?.data);
    localStorage.removeItem('authToken');
    throw new Error(error.response?.data?.message || 'Failed to fetch user data');
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/api/login', credentials);
    if (response.data?.token) {
      setAuthToken(response.data.token);
    }
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};