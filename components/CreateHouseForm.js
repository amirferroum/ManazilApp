import React, { useState, useEffect } from "react";
import axios from "axios";
import * as ImagePicker from 'expo-image-picker';
import { View, Text, TextInput, Button, Image, StyleSheet } from "react-native";
import useNgrokUrl from '../hooks/useNgrokUrl';
import LoadingSpinner from "./LoadingSpinner";
import useAuthentication from "../hooks/useAuthentication";
import { useNavigation } from '@react-navigation/native';

const CreateHouseForm = ( {onClose}) => {
    const { ngrokUrl, setUrl } = useNgrokUrl();
    const [loading, setLoading] = useState(false); // State for loading indicator
    const navigation = useNavigation();

  const Id = useAuthentication();
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    latitude: "",
    longitude: "",
    description: "",
    price: "",
    numRooms: "",
    photos: [], // Add a new field to store selected photos
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (Id) {
      setUserId(Id);
    }
  }, [Id]);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access media library is required!');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.cancelled) {
      setFormData({ ...formData, photos: [...formData.photos, pickerResult.assets?.[0]?.uri] });
    }
  };

  const handleSubmit = async () => {
    try {
        setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append("latitude", formData.latitude);
      formDataToSend.append("longitude", formData.longitude);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("numRooms", formData.numRooms);
      formDataToSend.append("title", formData.title);
      
      formData.photos.map((photo, index) => {
        formDataToSend.append(`photos`, {
          uri: photo,
          type: 'image/jpeg',
          name: `photo_${index + 1}.jpg`,
        });
      });

      const response = await axios.post(
        `http://${ngrokUrl}/houses/add/${userId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        setMessage("House created successfully!");
        onClose();
        navigation.navigate('Propertie');
      }
    } catch (error) {
      setMessage("Failed to create house. Please try again.");
      console.error("Error creating house:", error);
    } finally {
        setLoading(false);
    }
  };
  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Create a New House</Text>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={formData.title}
          onChangeText={(text) => handleChange("title", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Latitude"
          value={formData.latitude}
          onChangeText={(text) => handleChange("latitude", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Longitude"
          value={formData.longitude}
          onChangeText={(text) => handleChange("longitude", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={formData.description}
          onChangeText={(text) => handleChange("description", text)}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="Price"
          value={formData.price}
          onChangeText={(text) => handleChange("price", text)}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Number of Rooms"
          value={formData.numRooms}
          onChangeText={(text) => handleChange("numRooms", text)}
          keyboardType="numeric"
        />
        <Button title="Choose Photos" onPress={handleImagePicker} />
        {formData.photos.map((photo, index) => (
          <Image key={index} source={{ uri: photo }} style={styles.photo} />
        ))}
        <Button title="Create House" onPress={handleSubmit} />
        {message && <Text style={styles.errorMessage}>{message}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    width: "80%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  photo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  errorMessage: {
    color: "red",
    marginTop: 10,
  },
});

export default CreateHouseForm;
