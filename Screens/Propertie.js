import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Dimensions,ScrollView } from 'react-native';
import Card from "../components/Card";
import axios from "axios";
import useAuthentication from "../hooks/useAuthentication";
import useNgrokUrl from '../hooks/useNgrokUrl';
import LoadingSpinner from "../components/LoadingSpinner";


const Propertie = () => {
  const [open, setOpen] = useState(false);
  const [properties, setProperties] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const userId = useAuthentication();
  const { ngrokUrl, setUrl } = useNgrokUrl();

  useEffect(() => {
    if (userId) {
      fetchProperties();
    }
  }, [userId]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://${ngrokUrl}/client/accomdation/${userId}`
      );
      setProperties(response.data);

    } catch (error) {
      setError("Error fetching properties");
      console.error("Error fetching properties:", error);
    }
    setLoading(false);
  };
  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <ScrollView style={styles.container}>
      {error ? (
        <Text style={styles.error}>Error: {error}</Text>
      ) : (
       <View>
          <Text style={styles.modalTitle}>My Property</Text>

         <View style={styles.cardContainer}>

          {properties.map((property) => (
            <View key={property.id} style={styles.cardWrapper}>
              <Card key={property._id} propertie={property}/>
            </View>
          ))}
        </View>
       </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff', // Background color
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Add space between cards
    paddingTop: 10, // Add top padding
  },
  cardWrapper: {
    width: '48%', // Adjust the width of each card container
    marginBottom: 10, // Add bottom margin to create space between cards
  },
  
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
    },
});

export default Propertie;
