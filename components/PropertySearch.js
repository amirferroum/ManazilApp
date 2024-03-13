import React, { useState } from "react";
import { View, Text, Button, StyleSheet, TextInput } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker'; // Adjusted import statement
import axios from "axios";
import useNgrokUrl from '../hooks/useNgrokUrl';

const PropertySearch = ({ setData }) => {
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date());
  const [city, setCity] = useState("");
  const [guests, setGuests] = useState("");
  const [showCheckInPicker, setShowCheckInPicker] = useState(false); // State to control the visibility of the Check-in Date picker
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false); // State to control the visibility of the Check-out Date picker
  const { ngrokUrl, setUrl } = useNgrokUrl();

  const handleSubmit = async () => {
    try {
      const response = await axios.get(`http://${ngrokUrl}/prop/search`, {
        params: { checkIn, checkOut, city, guests },
      });
      setData(response.data.properties);
    } catch (error) {
      console.error("Error searching properties:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
    
        <TextInput
          style={styles.input}
          placeholder="Enter City"
          value={city}
          onChangeText={setCity}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Number of Guests"
          value={guests}
          onChangeText={setGuests}
          keyboardType="numeric"
        />
        <Button
          title="Search"
          onPress={handleSubmit}
          color="#007bff"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 5,

    backgroundColor: '#E9E9E9',
    borderRadius:"50%"
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  form: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 16,
    flexBasis: '20%',
  },
});

export default PropertySearch;
