import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Card from "./Card";

const FavoriteProperties = ({ favorites }) => {
  return (
    <View style={styles.container}>
      {favorites.length > 0 ? (
        <View style={styles.cardContainer}>
          {favorites.map((favorite) => (
            <View key={favorite.id} style={styles.cardWrapper}>
              <Card propertie={favorite} />
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.noFavoritesText}>No favorite properties found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Align items from the top
    alignItems: 'center',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Add space between cards
    paddingHorizontal: 10, // Add horizontal padding
    paddingTop: 10, // Add top padding
  },
  cardWrapper: {
    width: '48%', // Adjust the width of each card container
    marginBottom: 10, // Add bottom margin to create space between cards
  },
  noFavoritesText: {
    fontSize: 16,
    color: 'gray',
  },
});

export default FavoriteProperties;
