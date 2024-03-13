import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import LoadingSpinner from "../components/LoadingSpinner";
import FavoriteProperties from "../components/FavoriteProperties";
import axios from "axios";

import useAuthentication from "../hooks/useAuthentication";
import useNgrokUrl from '../hooks/useNgrokUrl';

const WhishListScreen = () => {
  const [loading, setLoading] = useState(true); // State to track loading status
  const [favorites, setFavorites] = useState([]);
  const userId = useAuthentication();
  const { ngrokUrl, setUrl } = useNgrokUrl();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (userId) { // Check if userId is available
        try {
          const response = await axios.get(
            `http://${ngrokUrl}/favoritesUser/${userId}`
          );

          if (response.data && response.data.length > 0) {
            setFavorites(response.data);
          }
          setLoading(false); // Set loading to false regardless of whether favorites are found or not
        } catch (error) {
          console.error("Error fetching favorites:", error);
          setLoading(false); // Set loading to false in case of error
        }
      }
    };

    fetchFavorites();
  }, [userId, ngrokUrl]); // Add userId and ngrokUrl to dependency array

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <React.Fragment>
          {favorites.length > 0 ? (
            <FavoriteProperties favorites={favorites} />
          ) : (
            <Text style={styles.noFavoritesText}>No favorite properties found.</Text>
          )}
        </React.Fragment>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noFavoritesText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'gray',
  },
});

export default WhishListScreen;
