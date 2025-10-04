// src/services/api.js
const API_BASE_URL = 'http://localhost:5000/api';

// Headers communs
const getHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Fonction utilitaire pour les appels API
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: getHeaders(),
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Services pour les offres d'emploi
export const jobOfferService = {
  // Récupérer toutes les offres
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    
    return fetchAPI(`/job-offers?${params.toString()}`);
  },

  // Récupérer une offre spécifique
  getById: (id) => fetchAPI(`/job-offers/${id}`),

  // Créer une nouvelle offre
  create: (jobData) => fetchAPI('/job-offers', {
    method: 'POST',
    body: JSON.stringify(jobData),
  }),

  // Filtrer les offres
  filter: (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    
    return fetchAPI(`/job-offers/filter?${params.toString()}`);
  },

  // Mettre à jour une offre
  update: (id, jobData) => fetchAPI(`/job-offers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(jobData),
  }),
};

// Services pour les candidatures
export const jobApplicationService = {
  // Récupérer toutes les candidatures
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    
    return fetchAPI(`/applications?${params.toString()}`);
  },

  // Créer une nouvelle candidature
  create: (applicationData) => fetchAPI('/applications', {
    method: 'POST',
    body: JSON.stringify(applicationData),
  }),

  // Filtrer les candidatures
  filter: (filters = {}) => fetchAPI('/applications/filter', {
    method: 'GET',
    headers: getHeaders(),
  }),

  // Mettre à jour une candidature
  update: (id, applicationData) => fetchAPI(`/applications/${id}`, {
    method: 'PUT',
    body: JSON.stringify(applicationData),
  }),
};

// Services d'authentification
export const authService = {
  // Connexion
  login: (userData) => fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  // Récupérer le profil utilisateur
  getProfile: () => fetchAPI('/auth/me'),

  // Mettre à jour le profil
  updateProfile: (userData) => fetchAPI('/auth/update-profile', {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),

  // Déconnexion
  logout: () => fetchAPI('/auth/logout', {
    method: 'POST',
  }),
};

// Services utilisateur
export const userService = {
  getProfile: () => fetchAPI('/users/me'),
  updateProfile: (userData) => fetchAPI('/users/me', {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
};

export default fetchAPI;