import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import restaurantService from "../services/restaurant-service";
import adminService from "../services/admin-service";
import customerService from "../services/customer-service";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    username: "",
    userId: "",
    loggedIn: false,
    profile_image: "",
    role: "", // Add role here
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser((prevUser) => ({
          ...prevUser,
          userId: decoded.userId,
          username: decoded.username,
          loggedIn: true,
          role: role || "", // Set role here
        }));

        // Fetch full user info including profile image
        fetchUsername(decoded.userId, role);
      } catch (err) {
        console.error("Invalid token:", err);
      }
    } else {
      setUser((prevUser) => ({ ...prevUser, loggedIn: false }));
    }
  }, []);

  const fetchUsername = async (userId, role) => {
    try {
      let response = null;

      if (role === "Restaurant Owner") {
        response = await restaurantService.getRestaurantOwner(userId);
      } else if (role === "Admin") {
        response = await adminService.getAdminProfile(userId);
      } else if (role === "Customer") {
        response = await customerService.getCustomerProfile(userId);
      }

      if (response && response.data) {
        const userData = response.data.owner || response.data.admin || response.data.customer || {};
        setUser((prevUser) => ({
          ...prevUser,
          username: userData.username || prevUser.username,
          profile_image: userData.profile_image || "",
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
