import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import useAuthentication from "../hooks/useAuthentication";
import useNgrokUrl from '../hooks/useNgrokUrl';
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";

const MyBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = useAuthentication();
  const { ngrokUrl, setUrl } = useNgrokUrl();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        // Make a GET request to fetch bookings for the specified user ID
        const response = await axios.get(
          `http://${ngrokUrl}/bookings/${userId}`
        );
        // Update state with fetched bookings
        setBookings(response.data.bookings);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Error fetching bookings. Please try again.");
        setLoading(false);
      }
    };

    if (userId) {
      fetchBookings();
    }
  }, [userId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <View style={styles.container}><Text>Error: {error}</Text></View>;
  }

  return (
    <View style={styles.container}>

      <Text style={styles.heading}>My Bookings</Text>
      {bookings.length === 0 ? (
        <Text>No bookings found.</Text>
      ) : (
        <View style={styles.bookingList}>
          {bookings.map((booking) => (
            <View key={booking.id} style={styles.bookingItem}>
              <Text>Check-in: {new Date(booking.checkIn).toLocaleDateString()}</Text>
              <Text>Check-out: {new Date(booking.checkOut).toLocaleDateString()}</Text>
              <Text>Guests: {booking.guests}</Text>
              <Text>Total Price: {booking.totalPrice}</Text>
              <Text>Property: {booking.property.title}</Text>
              {/* Add more details as needed */}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bookingList: {
    marginTop: 10,
  },
  bookingItem: {
    marginBottom: 20,
  },
});

export default MyBooking;
