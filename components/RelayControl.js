import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import axios from "axios"; // Import Axios library
import useNgrokUrl from '../hooks/useNgrokUrl';
import useAuthentication from "../hooks/useAuthentication";

const RelayControl = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { ngrokUrl, setUrl } = useNgrokUrl();
  const id = useAuthentication();

  const handleToggleRelay = async (status) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://${ngrokUrl}/relay/${status}/${id}`);
      console.log(response.data); // Log the response from the server
      // Handle success if needed
    } catch (error) {
      console.error("Error toggling relay:", error);
      setError("Failed to toggle relay. Please try again.");
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>ESP32 Relay Control</Text>
      <View style={styles.buttonsContainer}>
        <Button
          title={loading ? "Opening..." : "Open Relay"}
          onPress={() => handleToggleRelay("open")}
          disabled={loading}
        />
        <Button
          title={loading ? "Closing..." : "Close Relay"}
          onPress={() => handleToggleRelay("close")}
          disabled={loading}
        />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    margin: 8,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
});

export default RelayControl;
