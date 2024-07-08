import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import axios from "axios";
import Card from "./Card";
import useAuthentication from "../hooks/useAuthentication";
import useNgrokUrl from '../hooks/useNgrokUrl';
import PropertySearch from "./PropertySearch";
import LoadingSpinner from "./LoadingSpinner";

const HomeScreen = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading status
  const [isFetchingMore, setIsFetchingMore] = useState(false); // State to track whether more data is being fetched
  const userId = useAuthentication();
  const { ngrokUrl, setUrl } = useNgrokUrl();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`http://${ngrokUrl}/properties`);
        setProperties(response.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false); // Update loading status once properties are fetched (success or error)
      }
    };
    fetchProperties();
  }, []);

  const handleEndReached = async () => {
    if (!isFetchingMore) {
      setIsFetchingMore(true); // Set flag to indicate that more data is being fetched
      try {
        // Fetch more data (e.g., additional properties)
        const nextPage = properties.length / 10 + 1; // Calculate the page number based on current properties length
        const response = await axios.get(`http://${ngrokUrl}/properties?page=${nextPage}`);
        setProperties([...properties, ...response.data]); // Append the new data to the existing properties
      } catch (error) {
        console.error("Error fetching more properties:", error);
      } finally {
        setIsFetchingMore(false); // Reset the flag after fetching is completed (success or error)
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const renderProperty = ({ item }) => <Card propertie={item} />;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={properties}
        renderItem={renderProperty}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isFetchingMore && <ActivityIndicator style={styles.loadingIndicator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingIndicator: {
    marginVertical: 20,
  },
});

export default HomeScreen;
