import React, { 
    createContext, 
    useState, 
    useContext, 
    useEffect 
} from 'react';
import { jwtDecode } from 'jwt-decode'; // Install jwt-decode package

// Create the AuthContext
const AuthContext = createContext(null);

// AuthProvider component
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check authentication on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (token) {
            try {
                // Decode the token
                const decodedToken = jwtDecode(token);
                
                // Check if token is expired
       
                    setUser({
                        id: decodedToken.sub,
                        email: decodedToken.email,
                        role: decodedToken.role
                    });
                    setIsAuthenticated(true);
                
            } catch (error) {
                // Invalid token
                // logout();
            }
        }
        
        setIsLoading(false);
    }, []);

    // Login function
    const login = (token) => {
        localStorage.setItem('token', token);
        const decodedToken = jwtDecode(token);
        
        setUser({
            id: decodedToken.sub,
            email: decodedToken.email,
            role: decodedToken.role
        });
        setIsAuthenticated(true);
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
    };

    // Context value
    const value = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout
    };

    // Render children with AuthContext
    return (
        <AuthContext.Provider value={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
}

// Custom hook to use the AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    
    return context;
};