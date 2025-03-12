import api from './axiosConfig';

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

export const register = async (userData) => {
  try {
    const response = await api.post('/api/register', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fonction pour la connexion 
export const login = async(credentials) => {
  try{
    const response = await axios.post('/api/login',credentials);
    return response.data;
  }
  catch(error){
    return error.response.data;
  }
}

// Fonction pour la déconnexion
export const logout = async()=>{
  try {
    const response = await axios.post('api/logout');
    return response.data;
  }
  catch(error) {
    throw error.response.data ; 
  }
}