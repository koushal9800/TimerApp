import React, { createContext, useState, useContext, useEffect } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';


const lightTheme = {
  mode: 'light',
  background: '#FFFFFF',
  text: '#000000',
  card: '#F1F1F1',
  button: '#007BFF',
};

const darkTheme = {
  mode: 'dark',
  background: '#2F363F',
  text: '#FFFFFF',
  card: '#333333',
  button: '#BB86FC',
};


const ThemeContext = createContext();


export const useTheme = () => useContext(ThemeContext);


export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(lightTheme);

  
  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('appTheme');
      if (savedTheme) {
        setTheme(savedTheme === 'dark' ? darkTheme : lightTheme);
      }
    };
    loadTheme();
  }, []);

  
  const toggleTheme = async () => {
    const newTheme = theme.mode === 'light' ? darkTheme : lightTheme;
    setTheme(newTheme);
    await AsyncStorage.setItem('appTheme', newTheme.mode);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
