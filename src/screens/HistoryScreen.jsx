import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { useTheme } from '../theme/ThemeContext';

const HistoryScreen = ({ navigation }) => {
  const [history, setHistory] = useState([]);
  const { theme, toggleTheme } = useTheme();

useEffect(()=>{
    loadHistory()
},[])

  const loadHistory = async () => {
    const storedHistory = await AsyncStorage.getItem('history');
    if (storedHistory) setHistory(JSON.parse(storedHistory));
  };

  const clearHistory = async () => {
    await AsyncStorage.removeItem('history');
    setHistory([]);
  };

  const exportHistory = async () => {
    if (history.length === 0) {
      Alert.alert("No Data", "There is no history to export.");
      return;
    }

    try {
      const filePath = `${RNFS.DocumentDirectoryPath}/history.json`;
      const jsonData = JSON.stringify(history, null, 2);

     
      await RNFS.writeFile(filePath, jsonData, 'utf8');

      
      await Share.open({
        url: `file://${filePath}`,
        type: 'application/json',
        title: 'Exported History',
        failOnCancel: false,
      });

    } catch (error) {
      console.error("Error exporting history:", error);
      Alert.alert("Error", "Failed to export history.");
    }
  };

  return (
    <View style={[styles.container,{backgroundColor:theme.background}]}>
        <TouchableOpacity onPress={toggleTheme} style={[styles.button, { backgroundColor: theme.button }]}>
        <Text style={[styles.buttonText, { color: theme.text }]}>Toggle Theme</Text>
      </TouchableOpacity>
      <Text style={[styles.title,{color:theme.text}]}>Completed Timers</Text>
      {history.length > 0 ? (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.historyItem,{borderColor:theme.text}]}>
              <Text style={{color:theme.text}} >{item.name} - Completed at {item.completedAt}</Text>
            </View>
          )}
        />
      ) : (
        <Text>No completed timers yet</Text>
      )}
      <View style={{ flexDirection:'row', justifyContent:'space-around' }} >
      <TouchableOpacity onPress={clearHistory}
      style={[styles.buttons,{backgroundColor:'#AE1438'}]}
      >
        <Text style={{ color:'white' }} >Clear History</Text>
      </TouchableOpacity>
      {history.length > 0 ?
      <TouchableOpacity onPress={exportHistory}
      style={[styles.buttons,{backgroundColor:'#0A79DF'}]}>
        <Text style={{ color:'white' }}>Export as JSON</Text>
      </TouchableOpacity>
     :  <TouchableOpacity onPress={()=>navigation.navigate('Home')}
     style={[styles.buttons,{backgroundColor:'#0A79DF'}]}>
       <Text style={{ color:'white' }}>Go To Home</Text>
     </TouchableOpacity>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  historyItem: { padding: 10, borderWidth: 1, marginVertical: 6, borderRadius:4, flexDirection:'row' },
  buttons:{width:'45%', alignItems:'center',padding:12},
  button: { padding: 10, borderRadius: 5, alignItems: 'center', marginVertical: 10, },
  buttonText: { fontSize: 16 },
});

export default HistoryScreen;
