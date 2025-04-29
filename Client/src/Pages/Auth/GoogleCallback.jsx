import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthService from '../../services/AuthService';

function GoogleCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const processCallback = async () => {
      try {
        // Get parameters from URL
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const userId = params.get('userId');
        const role = params.get('role');
        const email = params.get('email');
        
        if (!token) {
          throw new Error('No token received from authentication');
        }
        
        // Prepare data in the format expected by setAuthData
        const authData = {
          token,
          userId,
          role,
          email,
          user: {
            id: userId,
            role: role,
            email: email
          }
        };
        
        // Store auth data
        AuthService.setAuthData(authData);
        
        // Redirect to home page
        navigate('/');
      } catch (error) {
        console.error('Failed to process Google authentication:', error);
        navigate('/login?error=failed_to_process_authentication');
      }
    };
    
    processCallback();
  }, [location, navigate]);
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="mb-4 text-2xl font-bold">Processing your login...</h2>
        <p>Please wait while we complete your authentication.</p>
      </div>
    </div>
  );
}

export default GoogleCallback;