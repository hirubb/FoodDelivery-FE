import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import restaurantService from "../services/restaurant-service";

// Create the context
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    username: "",
    userId: "",
    loggedIn: false,
    profile_image: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ userId: decoded.userId, username: decoded.username, loggedIn: true });
     

        // Fetch username only once after decoding the token if needed
        fetchUsername(decoded.userId);
      } catch (err) {
        console.error("Invalid token:", err);
      }
    } else {
      setUser({ ...user, loggedIn: false });
    }
  }, []);

  const fetchUsername = async (userId) => {
    try {
      const response = await restaurantService.getRestaurantOwner(userId);
  
      // Check if response and response.data exist before accessing username and profile_image
      if (response && response.data) {
        setUser((prevUser) => ({
          ...prevUser,
          username: response.data.owner.username,
          profile_image: response.data.owner.profile_image, // Change logo to profile_image
        }));
      } else {
        console.error("Invalid response format:", response);
      }
    } catch (err) {
      console.error("Failed to fetch username:", err);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
