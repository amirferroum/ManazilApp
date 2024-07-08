import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage for storing token
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Import MaterialCommunityIcons for the heart icon
import { decode } from "base-64"; // Import decode function from base-64
import useNgrokUrl from '../hooks/useNgrokUrl';
import { useNavigation } from '@react-navigation/native';

import useAuthentication from "../hooks/useAuthentication";

const Card = ({ propertie }) => {
  const [isLiked, setIsLiked] = useState(false); // Initially not liked
  const userId = useAuthentication();
  const { ngrokUrl, setUrl } = useNgrokUrl();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        // Fetch user's favorites from AsyncStorage
        const favorites = await AsyncStorage.getItem("favorites");
        if (favorites) {
          // Check if the current property is among the user's favorites
          setIsLiked(favorites.includes(propertie.id));
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, [propertie.id]);

  const handleLikeToggle = async () => {
    try {
        if (isLiked) {
            // If property is already liked, remove it from favorites
            await axios.delete(
              `http://${ngrokUrl}/favorites/${propertie.id}/${userId}`
            );
          } else {
            // If property is not liked, add it to favorites
            await axios.post(`http://${ngrokUrl}/favorites`, {
              userId: userId, // Assuming you have the userId available
              propertyId: propertie.id,
            });
          }
    
          // Toggle the liked state
          setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => navigation.navigate('Details', { propertyId: propertie.id })}>
        <View>
          {propertie.images && propertie.images.length > 0 && (
           <>
           <Image
              source={{ uri: propertie.images[0].replace('localhost:5000', ngrokUrl) }}
              style={styles.image}
            />

           </>
          )}
        </View>
        <View style={styles.details}>
          <Text style={styles.location}>
            {propertie.info.state}, {propertie.info.city.split(" ")[0]}
          </Text>
          <Text style={styles.price}>Price: {propertie.price} DZD/night</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.likeButton}
        onPress={handleLikeToggle}
      >
        <MaterialCommunityIcons
          name={isLiked ? "heart" : "heart-outline"}
          size={24}
          color={isLiked ? "red" : "gray"}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 10,
    elevation: 5,
    marginHorizontal:10
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,

  },
  details: {
    padding: 10,
  },
  location: {
    fontSize: 16,
    color: "gray",
  },
  price: {
    fontSize: 16,
    color: "gray",
  },
  likeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});

export default Card;
