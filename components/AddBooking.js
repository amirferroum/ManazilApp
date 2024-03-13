import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Platform, TextInput } from "react-native";
import axios from "axios";
import useAuthentication from "../hooks/useAuthentication";
import useNgrokUrl from '../hooks/useNgrokUrl';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddBooking = ({ propertyId }) => {
  const { ngrokUrl, setUrl } = useNgrokUrl();
  const [bookingData, setBookingData] = useState({
    checkIn: new Date(),
    checkOut: new Date(),
    guests: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const userId = useAuthentication();

  const handleBookingSubmit = async () => {
    setLoading(true);
    setError(null); // Reset error state

    try {
      const response = await axios.post(`http://${ngrokUrl}/bookings`, {
        propertyId,
        userId,
        ...bookingData,
      });

      console.log("Booking submitted successfully:", response.data);
      // Optionally, you can handle success here (e.g., show a success message)
      setBookingData({
        checkIn: new Date(),
        checkOut: new Date(),
        guests: 1,
      });
    } catch (error) {
      console.error("Error submitting booking:", error);
      setError("Error submitting booking");
    }

    setLoading(false);
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setBookingData({ ...bookingData, checkIn: selectedDate });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book Property</Text>
      <View style={styles.datePickerContainer}>
        <Text>Check-In Date:</Text>
        <DateTimePicker
          value={bookingData.checkIn}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      </View>
      <View style={styles.datePickerContainer}>
        <Text>Check-Out Date:</Text>
        <DateTimePicker
          value={bookingData.checkOut}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      </View>
      <View style={styles.guestsContainer}>
        <Text>Number of Guests:</Text>
        <TextInput
          style={styles.input}
          value={bookingData.guests.toString()}
          onChangeText={(text) => setBookingData({ ...bookingData, guests: parseInt(text) || 1 })}
          keyboardType="numeric"
        />
      </View>
      <Button
        title={loading ? "Booking..." : "Book"}
        onPress={handleBookingSubmit}
        disabled={loading}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  guestsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    width: 100,
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    marginLeft: 10,
    paddingHorizontal: 10,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
});

export default AddBooking;
