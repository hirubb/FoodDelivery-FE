// Retrieve token from localStorage
export const getAuthToken = () => {
    return localStorage.getItem("token");
  };
  

  export const setAuthToken = (token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  };
  
  export const isAuthenticated = () => {
    return !!getAuthToken();
  };
  
  export const getUserRole = () => {
    try {
      const token = getAuthToken();
      if (!token) return null;
      
      // Decode JWT token (this is a simple decode, not verification)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
  
      const { role } = JSON.parse(jsonPayload);
      return role;
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  };