import { AuthHTTP } from "./httpCommon-service";

class AuthService {
  // Regular login method
  login(credentials) {
    const apiCredentials = {...credentials};
    return AuthHTTP.post("/login", apiCredentials);
  }

  // Google login - initiates the OAuth flow
  googleLogin() {
    window.location.href = "http://localhost:4003/api/auth/google";
  }

  // Process Google login response
  processGoogleLogin(response) {
    if (response?.data?.token) {
      this.setAuthData(response.data);
      return response;
    }
    throw new Error('Invalid response from Google authentication');
  }

  // Handle Google OAuth callback
  handleGoogleCallback(code) {
    return AuthHTTP.get(`/auth/google/callback?code=${code}`)
      .then(response => {
        // Check if the role is Customer
        const responseData = response.data;
        const userRole = this.getUserRoleFromResponse(responseData);
        
        // Only process login if it's a customer
        if (userRole === 'Customer') {
          return this.processGoogleLogin(response);
        } else {
          throw new Error('Google authentication is only available for customers');
        }
      })
      .catch(error => {
        console.error("Google callback error:", error);
        if (error.response?.data?.message) {
          throw new Error(error.response.data.message);
        }
        throw error;
      });
  }

  // Helper method to extract role from response
  getUserRoleFromResponse(data) {
    let userRole = null;
    
    // Check all possible locations for role
    if (data.role) {
      userRole = data.role;
    } else if (data.user?.role) {
      userRole = data.user.role;
    } else if (data.customer?.role) {
      userRole = data.customer.role;
    }
    
    return this.normalizeRoleName(userRole);
  }

  // Helper to normalize role names
  normalizeRoleName(role) {
    if (!role) return null;
    
    const roleStr = String(role);
    
    if (roleStr.toLowerCase() === 'customer' || 
        roleStr.toLowerCase() === 'user') {
      return 'Customer';
    }
    
    return roleStr;
  }

  // Logout function to clear stored credentials
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('rememberedEmail');
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  // Get user role
  getUserRole() {
    return localStorage.getItem('role');
  }

  // Store authentication data - enhanced to handle direct token auth
  setAuthData(data) {
    // Handle token
    if (data?.token) {
      localStorage.setItem("token", data.token);
    }
    
    // Handle role - check all possible locations where role might be stored
    let role = null;
    
    // Direct role property
    if (data?.role) {
      role = data.role;
    } 
    // User object
    else if (data?.user?.role) {
      role = data.user.role;
    } 
    // Customer object (specific to customer login)
    else if (data?.customer?.role) {
      role = data.customer.role;
    }

    if (role) {
      localStorage.setItem("role", this.normalizeRoleName(role));
    }
    
    // Handle user ID - check all possible locations
    let userId = null;
    
    if (data?.userId) {
      userId = data.userId;
    } else if (data?.user?._id || data?.user?.id) {
      userId = data.user._id || data.user.id;
    } else if (data?.customer?._id || data?.customer?.id) {
      userId = data.customer._id || data.customer.id;
    }
    
    if (userId) {
      localStorage.setItem("userId", userId);
    }
    
    // Handle username - check all possible locations
    let username = null;
    
    if (data?.username) {
      username = data.username;
    } else if (data?.user?.username || data?.user?.name) {
      username = data.user.username || data.user.name;
    } else if (data?.customer?.username || data?.customer?.first_name) {
      // For customers we might have first_name and last_name instead of username
      if (data.customer.first_name && data.customer.last_name) {
        username = `${data.customer.first_name} ${data.customer.last_name}`;
      } else {
        username = data.customer.username || data.customer.first_name;
      }
    } else if (data?.email) {
      // Use email as fallback for username
      username = data.email.split('@')[0]; // Use part before @ as username
    }
    
    if (username) {
      localStorage.setItem("username", username);
    }
  }

  // For password reset functionality
  requestPasswordReset(email) {
    return AuthHTTP.post("/forgot-password", { email });
  }

  // For resetting password with token
  resetPassword(token, newPassword) {
    return AuthHTTP.post("/reset-password", { token, newPassword });
  }
}

export default new AuthService();