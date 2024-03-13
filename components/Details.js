import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Text, Button, StyleSheet, Alert, ScrollView, Image, Dimensions } from "react-native";
import axios from "axios";
import useAuthentication from "../hooks/useAuthentication";
import useNgrokUrl from '../hooks/useNgrokUrl';
import LoadingSpinner from "../components/LoadingSpinner";
import ReviewSection from "./ReviewSection";
import AddReview from "./AddReview";
import AddBooking from "./AddBooking";
import IoTDeviceForm from "../components/IoTDeviceForm";
import RelayControl from "../components/RelayControl";

const windowWidth = Dimensions.get('window').width;

const Details = ({ route }) => {
  const { propertyId } = route.params; // Get propertyId from route params
  const { ngrokUrl, setUrl } = useNgrokUrl();
  const [info, setInfo] = useState(null);
  const [iot, setIot] = useState(null);

  const id = propertyId;
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1, // Default value
  });
  const [error, setError] = useState(null);
  const userId = useAuthentication(); // Fetching user ID using custom authentication hook

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`http://${ngrokUrl}/properties/${id}`);
        setProperty(response.data.property);
        setInfo(response.data.property.info);
        setIot(response.data.property.iotDevices);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching property details:", error);
        setError("Error fetching property details");
      }
    };

    fetchPropertyDetails();
  }, [id]);

  const handleBookingSubmit = async () => {
    try {
      // Example code to handle booking submission
      await axios.post(`http://${ngrokUrl}/bookings`, {
        propertyId: id,
        userId: userId,
        ...bookingData,
      });
      // Handle success (e.g., show confirmation message)
      Alert.alert("Booking submitted successfully!");
    } catch (error) {
      // Handle error (e.g., display error message)
      console.error("Error submitting booking:", error);
      setError("Error submitting booking");
      Alert.alert("Property not available for selected dates");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!property) {
    return <Text>Property not found</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SafeAreaView style={styles.details}>
        {property.images && (
          <View style={styles.imageContainer}>
            <ScrollView horizontal>
              {property.images.map((image, index) => (
                <Image key={index} source={{ uri: image.replace('localhost:5000', ngrokUrl) }} style={styles.image} />
              ))}
            </ScrollView>
          </View>
        )}
                {iot.length > 0 && property.ownerId == userId && <RelayControl />}
                {iot.length < 1 && property.ownerId == userId && (
          <IoTDeviceForm propertyId={id} />
        )}
        <Text style={styles.title}>{property.title}</Text>
        <Text style={styles.location}>
          Location: {info.country}, {info.state}, {info.city}
        </Text>
        <Text style={styles.description}>Description: {property.description}</Text>
        <Text style={styles.price}>Price: {property.price} DZD/night</Text>
      </SafeAreaView>
      <AddBooking propertyId={id} />
      <AddReview propertyId={id} />
      <ReviewSection propertyId={id} />
      {error && <Text style={styles.error}>Error: {error}</Text>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom:25
  },
  details: {
    paddingTop: 20,
  },
  imageContainer: {
    height: windowWidth * 0.5,
    marginBottom: 20,
  },
  image: {
    width: windowWidth,
    height: windowWidth * 0.5,
    resizeMode: 'cover',
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  location: {
    marginBottom: 10,
  },
  description: {
    marginBottom: 10,
  },
  price: {
    marginBottom: 20,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
});

export default Details;
