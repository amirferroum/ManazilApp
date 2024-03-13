import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import useNgrokUrl from '../hooks/useNgrokUrl';
import useAuthentication from "../hooks/useAuthentication";

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const MenuScreen = ({ route }) => {
  const navigation = useNavigation();
  const { handleSignInSuccess } = route.params;
  const [user, setUser] = useState(null);
  const { ngrokUrl, setUrl } = useNgrokUrl();
  const id = useAuthentication();

  // Load the default profile picture immediately
  const defaultProfilePic = require('../assets/default-profile-pic.png');

  useEffect(() => {
    // Fetch user profile data from the backend
    const fetchUserProfile = async () => {
      if(id) {
        try {

          const response = await axios.get(`http://${ngrokUrl}/profile/data/${id}`);
          setUser(response.data);
        } catch (error) {
          console.error("Profile fetch error:", error);
        }
      }
    };

    fetchUserProfile();
  }, [id, ngrokUrl]);

  const handleLogout = () => {
    handleSignInSuccess(null);
  };

  const handleMenuItemPress = (screen) => {
    navigation.navigate(screen);
  };

  const menuItems = [
    { id: 'profile', title: 'Profile', screen: 'Profile' },
    { id: 'MyProperties', title: 'My Properties', screen: 'Propertie' },
    { id: 'MyBookings', title: 'My Bookings', screen: 'MyBooking' },
    { id: 'settings', title: 'Settings', screen: 'SettingsScreen' },
    { id: 'logout', title: 'Logout', onPress: handleLogout }
  ];

  const renderItem = ({ item }) => {
    if (item.id === 'logout') {
      return (
        <TouchableOpacity onPress={item.onPress}>
          <View style={[styles.menuItem, { width: screenWidth - 40 }]}>
            <Text style={styles.menuItemText}>{item.title}</Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity onPress={() => handleMenuItemPress(item.screen)}>
          <View style={[styles.menuItem, { width: screenWidth - 40 }]}>
            <Text style={styles.menuItemText}>{item.title}</Text>
          </View>
        </TouchableOpacity>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={() => handleMenuItemPress('Profile')}>
          {/* Conditionally render the profile picture */}
          {user && user.profilePic ? (
            <Image source={{ uri: user.profilePic.replace('localhost:5000', ngrokUrl) }} style={styles.profilePic} />
          ) : (
            <Image source={defaultProfilePic} style={styles.profilePic} />
          )}
        </TouchableOpacity>
      </View>
      <FlatList
        data={menuItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: screenHeight / 3,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  flatListContent: {
    paddingHorizontal: 20,
  },
  menuItem: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  menuItemText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
});

export default MenuScreen;
