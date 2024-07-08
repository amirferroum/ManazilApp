import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import useNgrokUrl from '../hooks/useNgrokUrl';

const IoTDeviceForm = ({ propertyId, onDeviceAdded }) => {
  const [deviceName, setDeviceName] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [macAddress, setMacAddress] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { ngrokUrl, setUrl } = useNgrokUrl();

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`http://${ngrokUrl}/properties/${propertyId}/devices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deviceName,
          deviceType,
          macAddress,
          status,
        }),
      });

      if (response.status === 201) {
        onDeviceAdded();
        setDeviceName("");
        setDeviceType("");
        setMacAddress("");
        setStatus("");
      }
    } catch (error) {
      console.error("Error adding IoT device:", error);
      setError("Failed to add IoT device. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Device Name"
        value={deviceName}
        onChangeText={setDeviceName}
        style={styles.input}
      />
      <TextInput
        placeholder="Device Type"
        value={deviceType}
        onChangeText={setDeviceType}
        style={styles.input}
      />
      <TextInput
        placeholder="Mac Address"
        value={macAddress}
        onChangeText={setMacAddress}
        style={styles.input}
      />
      <TextInput
        placeholder="Status"
        value={status}
        onChangeText={setStatus}
        style={styles.input}
      />
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
        style={[styles.button, { backgroundColor: loading ? "#888" : "#007bff" }]}
      >
        <Text style={styles.buttonText}>{loading ? "Adding..." : "Add IoT Device"}</Text>
      </TouchableOpacity>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
});

export default IoTDeviceForm;
