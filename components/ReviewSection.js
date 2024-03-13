import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import axios from "axios";
import useNgrokUrl from '../hooks/useNgrokUrl';

const ReviewSection = ({ propertyId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { ngrokUrl, setUrl } = useNgrokUrl();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `http://${ngrokUrl}/properties/${propertyId}/reviews`             
        );
        setReviews(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setLoading(false);
      }
    };

    fetchReviews();
  }, [propertyId]);

  if (loading) {
    return <Text style={styles.loadingText}>Loading reviews...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reviews</Text>
      {reviews.length === 0 ? (
        <Text style={styles.text}>No reviews yet.</Text>
      ) : (
        <View>
          {reviews.map((review) => (
            <View key={review.id} style={styles.reviewContainer}>
              <Text style={styles.username}>User: {review.user.username}</Text>
              <Text style={styles.rating}>Rating: {review.rating}</Text>
              <Text style={styles.comment}>Comment: {review.comment}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "#666",
  },
  loadingText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  reviewContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  username: {
    fontWeight: "bold",
  },
  rating: {
    color: "#666",
  },
  comment: {
    color: "#666",
  },
});

export default ReviewSection;
