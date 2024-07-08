import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Image, StyleSheet } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import axios from "axios";
import useNgrokUrl from '../hooks/useNgrokUrl';
import useAuthentication from "../hooks/useAuthentication";
import LoadingSpinner from "../components/LoadingSpinner";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const { ngrokUrl, setUrl } = useNgrokUrl();
  const id = useAuthentication();
  const [loading, setLoading] = useState(true); // State to track loading status

  useEffect(() => {
    const fetchUserProfile = async () => {
      if(id) {
        try {
          const response = await axios.get(`http://${ngrokUrl}/profile/data/${id}`);
          setUser(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Profile fetch error:", error);
        }
      }
    };

    fetchUserProfile();
  }, [id]);

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }
  
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    // Check if the user cancelled or if the URI is undefined
    if (!pickerResult.cancelled && pickerResult.assets?.[0]?.uri) {
      setProfilePic(pickerResult.assets?.[0]?.uri);
    } else {
      console.log("Image selection cancelled or URI is undefined");
    }

  };
  


  const handleUpload = async () => {
    try {
      if (!profilePic) {
        console.error("Profile picture is undefined");
        return;
      }
  
      const formData = new FormData();
    
      // Read the file from the profilePic URI
      const fileUri = profilePic.replace("file://", "");
  
      // Append the file data to the FormData object
      formData.append("profilePic", {
        uri: fileUri,
        type: 'image/jpeg', // Adjust the type according to the image type
        name: `profile_pic_${Date.now()}.jpg`, // You can customize the file name
      });
  
      // Make the POST request to upload the image
      const response = await axios.post(`http://${ngrokUrl}/profile/${id}/upload`, formData, {
        withCredentials: true, // Send cookies along with the request
        headers: {
          "Content-Type": "multipart/form-data", // Set the content type to multipart/form-data
        },
      });
  
      // If the upload is successful, update the user state with the new profile picture URL
      setUser({ ...user, profilePic: response.data.profilePic });
      alert("Profile picture uploaded successfully!");
    } catch (error) {
      console.error("Profile picture upload error:", error);
    }
  };


  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Profile Page</Text>
        {user && (
          <View style={styles.profileInfo}>
            <View style={styles.userInfo}>
              <Text>Email: {user.email}</Text>
              <Text>Username: {user.username}</Text>
              {user.profilePic && (
                <View style={styles.profilePicContainer}>
                  <Text>Profile Picture:</Text>
                  <Image style={styles.profilePic} source={{ uri: user.profilePic.replace('localhost:5000', ngrokUrl) }} />
                </View>
              )}
            </View>
            <View style={styles.uploadSection}>
              <Button title="Choose File" onPress={handleImagePicker} />
              <Button title="Upload" onPress={handleUpload} />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  profileInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  userInfo: {
    flex: 1,
  },
  profilePicContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
  },
  uploadSection: {
    flex: 1,
    marginLeft: 20,
  },
});

export default Profile;
