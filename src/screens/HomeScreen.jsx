import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import { TextInput,Card } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import { useTheme } from '../theme/ThemeContext';

const HomeScreen = () => {
  const [timers, setTimers] = useState([]);
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('Workout');
  const [modalVisible, setModalVisible] = useState(false);
  const [completedTimer, setCompletedTimer] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const { theme } = useTheme();

  useEffect(() => {
    loadTimers();
  }, []);

  const loadTimers = async () => {
    const storedTimers = await AsyncStorage.getItem('timers');
    if (storedTimers) setTimers(JSON.parse(storedTimers));
  };

  const saveTimers = async newTimers => {
    setTimers(newTimers);
    await AsyncStorage.setItem('timers', JSON.stringify(newTimers));
  };

  const addTimer = () => {
    if (name && duration) {
      const newTimer = {
        id: Date.now().toString(),
        name,
        duration: parseInt(duration),
        remaining: parseInt(duration),
        category,
        status: 'Paused',
      };
      saveTimers([...timers, newTimer]);
      setName('');
      setDuration('');
      setCategory('Workout');
    }
  };

  const toggleCategory = category => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const startTimer = id => {
    const updatedTimers = timers.map(timer => {
      if (timer.id === id && timer.status !== 'Completed') {
        return {...timer, status: 'Running'};
      }
      return timer;
    });
    saveTimers(updatedTimers);
  };

  const pauseTimer = id => {
    const updatedTimers = timers.map(timer => {
      if (timer.id === id) return {...timer, status: 'Paused'};
      return timer;
    });
    saveTimers(updatedTimers);
  };

  const resetTimer = id => {
    const updatedTimers = timers.map(timer => {
      if (timer.id === id)
        return {...timer, remaining: timer.duration, status: 'Paused'};
      return timer;
    });
    saveTimers(updatedTimers);
  };

  const startAllTimersInCategory = category => {
    const updatedTimers = timers.map(timer => {
      if (timer.category === category && timer.status !== 'Completed') {
        return {...timer, status: 'Running'};
      }
      return timer;
    });
    saveTimers(updatedTimers);
  };

  const pauseAllTimersInCategory = category => {
    const updatedTimers = timers.map(timer => {
      if (timer.category === category && timer.status === 'Running') {
        return {...timer, status: 'Paused'};
      }
      return timer;
    });
    saveTimers(updatedTimers);
  };

  const resetAllTimersInCategory = category => {
    const updatedTimers = timers.map(timer => {
      if (timer.category === category) {
        return {...timer, remaining: timer.duration, status: 'Paused'};
      }
      return timer;
    });
    saveTimers(updatedTimers);
  };
  const saveToHistory = async timer => {
    const storedHistory = await AsyncStorage.getItem('history');
    const history = storedHistory ? JSON.parse(storedHistory) : [];
    const newHistory = [...history, {...timer, completedAt: new Date().toLocaleString()}];
    await AsyncStorage.setItem('history', JSON.stringify(newHistory));
  };
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedTimers = timers.map(timer => {
        if (timer.status === 'Running' && timer.remaining > 0) {
          return {...timer, remaining: timer.remaining - 1};
        } else if (timer.status === 'Running' && timer.remaining === 0) {
          setModalVisible(true);
          setCompletedTimer(timer);
          saveToHistory(timer);
          return {...timer, status: 'Completed'};
        }
        return timer;
      });
      saveTimers(updatedTimers);
    }, 1000);
    return () => clearInterval(interval);
  }, [timers]);

  const groupedTimers = timers.reduce((acc, timer) => {
    acc[timer.category] = acc[timer.category] || [];
    acc[timer.category].push(timer);
    return acc;
  }, {});

  return (
    <KeyboardAvoidingView
    behavior={'position'} 
    style={{ flex: 1,backgroundColor:theme.background  }}
    >
    <ScrollView  style={styles.container}>
      <TextInput
        placeholder="Timer Name"
        placeholderTextColor={theme.text}
        value={name}
        onChangeText={setName}
        style={styles.input}
        activeUnderlineColor={theme.text}
      />
      <TextInput
        placeholder="Duration (seconds)"
        placeholderTextColor={theme.text}
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
        style={styles.input}
        activeUnderlineColor={theme.text}
      />
      <Picker
        selectedValue={category}
        
        onValueChange={itemValue => setCategory(itemValue)}
        style={{marginBottom:12, backgroundColor:theme.background,color:theme.text}}>
        <Picker.Item  label="Workout" value="Workout" />
        <Picker.Item  label="Study" value="Study" />
        <Picker.Item  label="Break" value="Break" />
      </Picker>
     
      <TouchableOpacity onPress={addTimer} style={styles.timerButton} >
        <Text style={{ color:'#fff' }} >Add Timer</Text>
      </TouchableOpacity>

      {Object.keys(groupedTimers).map(category => (
        <View key={category} style={styles.categoryContainer}>
          <TouchableOpacity  style={styles.categoryButon} onPress={() => toggleCategory(category)}>
            <Text style={styles.categoryTitle}>
              {category} 
            </Text>
            <Text style={styles.categoryTitle}>
               {expandedCategories[category] ? 
               <MaterialIcons name='keyboard-arrow-down' size={20} color='red'  />
               : <MaterialIcons name='keyboard-arrow-up' size={20} color='red'  />}
            </Text>
          </TouchableOpacity>
          {expandedCategories[category] && (
            <>
              <View style={{flexDirection:'row', justifyContent:'space-around'}}>
                
                <TouchableOpacity 
                onPress={() => startAllTimersInCategory(category)}
                style={styles.combineButton} >
                <MaterialIcons name='start' size={20} color='white'  />
                  <Text style={styles.combineText} >Start All</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                onPress={() => pauseAllTimersInCategory(category)}
                style={styles.combineButton} >
                <MaterialIcons name='not-started' size={20} color='white'  />
                  <Text style={styles.combineText} >Pause All</Text>
                </TouchableOpacity>
               
                <TouchableOpacity 
                onPress={() => resetAllTimersInCategory(category)}
                style={styles.combineButton} >
                <MaterialIcons name='restart-alt' size={20} color='white'  />
                  <Text style={styles.combineText} >Reset All</Text>
                </TouchableOpacity>
              </View>
              {groupedTimers[category].map(item => (
                <Card key={item.id} style={styles.timerContainer}>
                  <View style={{ flexDirection:'row' }} >
                  <Text style={{ textTransform:'capitalize', fontSize:16, fontWeight:'600' }} >
                  {item.name}
                  </Text>
                  <Text style={{ textTransform:'capitalize', fontSize:14, fontWeight:'500', marginLeft:12 }} >
                  - {item.remaining}s ({item.status})
                  </Text>
                  </View>
                  
                  <View style={{ flexDirection:'row', marginTop:12, justifyContent:'space-around' }} >
                  
                  <TouchableOpacity onPress={() => startTimer(item.id)} >
                  <MaterialIcons name='start' size={30} color='#E74292'  />
                  </TouchableOpacity>
                  
                  <TouchableOpacity onPress={() => pauseTimer(item.id)} >
                  <MaterialIcons name='pause-circle-filled' size={30} color='#E74292'  />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => resetTimer(item.id)} >
                  <Entypo name='back-in-time' size={30} color='#BB2CD9'  />
                  </TouchableOpacity>
                  
                  </View>
                </Card>
              ))}
            </>
          )}
        </View>
      ))}

      <Modal visible={modalVisible} transparent>
        <View style={styles.modalContainer}>
          <Text>🎉 {completedTimer?.name} Completed! 🎉</Text>
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {padding: 20},
  input: { marginBottom: 10, backgroundColor:'transparent'},
  timerButton:{ 
    backgroundColor:'#EC4849',
    padding:12,
    borderRadius:8,
    justifyContent:'center',
    alignItems:'center'
   },
  categoryContainer: {marginVertical: 20},
  categoryButon:{
    backgroundColor:'#A4B0BD',
    flexDirection:'row',
    justifyContent:'space-between',
    padding:12,
    marginBottom:12,
    borderRadius:4
  },
  categoryTitle: {fontSize: 18, fontWeight: '600',color:'#2F363F'},
  combineButton:{ flexDirection:'row', alignItems:'center', padding:6, backgroundColor:'#25CCF7', borderRadius:4 },
  combineText:{ marginLeft:4, color:'white' },
  timerContainer: {marginTop: 12, padding: 10,  backgroundColor:'white', borderRadius:4},
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
});

export default HomeScreen;