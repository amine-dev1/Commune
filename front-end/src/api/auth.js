import api from './axiosConfig';

const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/api/register', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/api/login', credentials);
    
    // If login is successful, get the token and set it
    if (response.data && response.data.token) {
      setAuthToken(response.data.token);
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fonction pour la déconnexion
export const logout = async()=>{
  try {
    const response = await axios.post('api/logout');
    localStorage.clear();
    return response.data;
  }
  catch(error) {
    throw error.response.data ; 
  }
}