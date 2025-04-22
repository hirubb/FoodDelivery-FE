import { AuthHTTP } from "./httpCommon-service";

class AuthService {
  // Generic login method that works for all user types
  login(credentials) {
    // Make a clean copy of credentials without modification
    const apiCredentials = {...credentials};
    
    // Send credentials to API
    return AuthHTTP.post("/login", apiCredentials);
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

  // Store authentication data
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
    // Restaurant owner object
    else if (data?.restaurantOwner?.role) {
      role = data.restaurantOwner.role;
    }
    // Admin object
    else if (data?.admin?.role) {
      role = data.admin.role;
    }

    if (role) {
      localStorage.setItem("role", role);
    }
    
    // Handle user ID - check all possible locations
    let userId = null;
    
    if (data?.userId) {
      userId = data.userId;
    } else if (data?.user?._id || data?.user?.id) {
      userId = data.user._id || data.user.id;
    } else if (data?.customer?._id || data?.customer?.id) {
      userId = data.customer._id || data.customer.id;
    } else if (data?.restaurantOwner?._id || data?.restaurantOwner?.id) {
      userId = data.restaurantOwner._id || data.restaurantOwner.id;
    } else if (data?.admin?._id || data?.admin?.id) {
      userId = data.admin._id || data.admin.id;
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