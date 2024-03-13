import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '../hooks/MockAsyncStorage';
import { useNavigation } from '@react-navigation/native';
import useNgrokUrl from '../hooks/useNgrokUrl';

const SignInScreen = ({ onSignInSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const { ngrokUrl, setUrl } = useNgrokUrl();

  const handleSignIn = async () => {
    try {
      const response = await axios.post(`http://${ngrokUrl}/signin`, {
        email,
        password,
      });
      const mockToken = response.data.token;
      await AsyncStorage.setItem('token', mockToken);
      // Call the callback function passed from App component to update authentication state
      onSignInSuccess(mockToken);
     
    } catch (error) {
      console.error("Signin error:", error);
      Alert.alert('Signin error');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <Button title="Sign In" onPress={handleSignIn} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default SignInScreen;
