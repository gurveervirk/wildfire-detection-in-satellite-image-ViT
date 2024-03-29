import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import UploadImageScreen from './screens/UploadImageScreen';
import CaptureImageScreen from './screens/CaptureImageScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createStackNavigator();

export default function App() {
 return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="UploadImage" component={UploadImageScreen} />
        <Stack.Screen name="CaptureImage" component={CaptureImageScreen} />
      </Stack.Navigator>
    </NavigationContainer>
 );
}

function HomeScreen({ navigation }) {
 return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate('UploadImage')}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Upload Image</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('CaptureImage')}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Capture Image</Text>
      </TouchableOpacity>
    </View>
 );
}

const styles = StyleSheet.create({
 container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
 },
 button: {
    backgroundColor: "#841584",
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    width: "80%", // Ensure the button takes up 80% of the screen width
    alignItems: "center", // Center the text within the button
 },
 buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
 },
});
