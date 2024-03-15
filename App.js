import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet,Image,TouchableOpacity,StatusBar  } from "react-native";
import { Entypo  ,AntDesign,Feather ,Ionicons   } from '@expo/vector-icons';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen';
import MessagesScreen from './Screens/MessagesScreen';
import MenuScreen from './Screens/MenuScreen';
import CustomModal from './components/CustomModal';
import Details from './components/Details';
import SignInScreen from './components/SignInScreen';
import WhishListScreen from './Screens/WhishListScreen';
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
import CustomStatusBar from './components/CustomStatusBar';
import Profile from './Screens/Profile';
import Propertie from './Screens/Propertie';
import MyBooking from './Screens/MyBooking';
const MainStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Details" component={Details}  options={{ presentation: 'modal' }}/>
    
    <Stack.Screen name="Profile" component={Profile}  />
    <Stack.Screen name="Propertie" component={Propertie}  />
    <Stack.Screen name="MyBooking" component={MyBooking}  />


  </Stack.Navigator>
);

export default function App() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userId, setUserId] = useState(null);

  const handleSignInSuccess = (userId) => {
    setUserId(userId);
  };
0
  return (
    <NavigationContainer>
      <CustomStatusBar>
      {userId != null ? (
        <Tab.Navigator
          screenOptions={{
            tabBarShowLabel: false,
            tabBarStyle: [{ display: 'flex' }, null],
            headerShown: false,
            tabBarStyle: {
              position:'absolute',
              height:70,
              left:20,
              right:20,
              elevation:0,
              borderRadius:15,
              ...style.shadow
            }
            
          }}>
     <Tab.Screen 
  name="Home" 
  component={MainStack} 
  options={{
    tabBarIcon: ({ focused }) => (
      <View style={{ alignItems: "center", justifyContent: "center", top: 0 }}>
        <AntDesign  
          name="home" 
          size={30} 
          color={focused ? '#e32f45' : '#748c94'} 
        />
      </View>
    )
  }} 
/>
<Tab.Screen 
  name="Wish List" 
  component={WhishListScreen} 
  options={{
    tabBarIcon: ({ focused }) => (
      <View style={{ alignItems: "center", justifyContent: "center", top: 0 }}>
        <Ionicons   
          name="heart" 
          size={30} 
          color={focused ? '#e32f45' : '#748c94'} 
        />
      </View>
    )
  }} 
/>
          <Tab.Screen
            name="Messages"
            component={MessagesScreen}
            listeners={({ navigation }) => ({
              tabPress: (event) => {
                event.preventDefault();
                setIsModalVisible(true);
              },
            })}
            options={{
              tabBarIcon: ({ focused }) => (
                <View style={{ alignItems: "center", justifyContent: "center", top:-25, backgroundColor:'#e32f45',borderRadius:50 }}>
                  <AntDesign 
                    name="plus" 
                    size={55} 
                    color="white"
                    
                  />
                  
                </View>
              )
            }} 
          />

<Tab.Screen 
  name="Message" 
  component={MessagesScreen} 
  options={{
    tabBarIcon: ({ focused }) => (
      <View style={{ alignItems: "center", justifyContent: "center", top: 0 }}>
        <Feather 
          name="message-square" 
          size={30} 
          color={focused ? '#e32f45' : '#748c94'} 
        />
     
      </View>
    )
  }} 
/>
<Tab.Screen 
  name="MenuScreen" 
  component={MenuScreen} 
  options={{
    tabBarIcon: ({ focused }) => (
      <View style={{ alignItems: "center", justifyContent: "center", top: 0 }}>
        <Entypo 
          name="menu" 
          size={30} 
          color={focused ? '#e32f45' : '#748c94'} 
        />
      </View>
    )
  }}
  initialParams={{ handleSignInSuccess }} // Pass the handleSignInSuccess function as a prop
/>

        </Tab.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SignIn">
            {(props) => <SignInScreen {...props} onSignInSuccess={handleSignInSuccess} />}
          </Stack.Screen>
          
        </Stack.Navigator>
      )}
      </CustomStatusBar>
      <CustomModal visible={isModalVisible} onClose={() => setIsModalVisible(false)} />
    </NavigationContainer>
  );
}

const style = StyleSheet.create({
  shadow: {
    shadowOffset: {
      width:0,
      height:10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation:5
  }
})
