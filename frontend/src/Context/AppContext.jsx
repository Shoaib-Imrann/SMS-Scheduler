import { createContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import React from "react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const currency = "₹";

  const getAuthState = async () => {
    const token = localStorage.getItem("authToken");
    try {
      setGlobalLoading(true);
      
      if (!token) {
        setIsLoggedIn(false);
        return;
      }

      const response = await axios.get(backendUrl + "/api/email/is-auth", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setIsLoggedIn(true);
        await getUserData();
      } else {
        // Token is invalid or expired
        localStorage.removeItem("authToken");
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.log(error.message);
      localStorage.removeItem("authToken");
      setIsLoggedIn(false);
    } finally {
      setGlobalLoading(false);
    }
  };

  const getUserData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("No authentication token found");
        return;
      }

      const response = await axios.get(backendUrl + "/api/user/data", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setUserData(response.data.userData);
      } else {
        toast.error("Failed to load user data");
      }
    } catch (error) {
      toast.error(error.message);
      console.log("User Data Error:", error.message);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
    currency,
    globalLoading,
    setGlobalLoading,
    logoUrl,
    setLogoUrl,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
