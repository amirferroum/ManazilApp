import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from "react-native";
import axios from "axios";
import useAuthentication from "../hooks/useAuthentication";
import useNgrokUrl from '../hooks/useNgrokUrl';

const AddReview = ({ propertyId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const userId = useAuthentication();
  const { ngrokUrl, setUrl } = useNgrokUrl();

  const handleStarPress = (value) => {
    setRating(value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null); // Reset error state

    try {
      const response = await axios.post(`http://${ngrokUrl}/reviews`, {
        userId,
        propertyId,
        rating,
        comment,
      });

      console.log("Review added:", response.data);
      // Optionally, you can handle success here (e.g., show a success message)
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Error adding review:", error);
      setError("Failed to add review. Please try again.");
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Review</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((value) => (
          <TouchableOpacity key={value} onPress={() => handleStarPress(value)}>
            <Text style={value <= rating ? styles.starFilled : styles.star}>★</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.input}
        value={comment}
        onChangeText={(value) => setComment(value)}
        placeholder="Comment"
        multiline
      />
      <Button
        title={loading ? "Adding Review..." : "Add Review"}
        onPress={handleSubmit}
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
  ratingContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  star: {
    fontSize: 30,
    color: "#ccc",
    marginRight: 5,
  },
  starFilled: {
    fontSize: 30,
    color: "gold",
    marginRight: 5,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
});

export default AddReview;
