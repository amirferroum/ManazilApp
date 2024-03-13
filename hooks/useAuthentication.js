import { useState, useEffect } from "react";
import { decode } from "base-64"; // Import decode function from base-64
import AsyncStorage from "../hooks/MockAsyncStorage";
import {jwtDecode} from "jwt-decode";

function useAuthentication() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          // Polyfill atob() using decode function from base-64
          global.atob = decode;
          
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.userId;
          setUserId(userId);
        }
      } catch (error) {
        console.error("Error retrieving or decoding token:", error);
        // Handle error, such as logging out the user or displaying an error message
      }
    };

    getToken();
  }, []);

  return userId;
}

export default useAuthentication;
