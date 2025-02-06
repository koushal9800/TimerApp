import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import { useTheme } from '../theme/ThemeContext';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const { theme } = useTheme();
  return (
  
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({color, size}) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = 'timer-outline';
            } else if (route.name === 'History') {
              iconName = 'list-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          tabBarHideOnKeyboard:true,
          headerShown:false,
          tabBarStyle:{backgroundColor:theme.background}
        })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="History" component={HistoryScreen} />
      </Tab.Navigator>
    
  );
};

export default AppNavigator;
