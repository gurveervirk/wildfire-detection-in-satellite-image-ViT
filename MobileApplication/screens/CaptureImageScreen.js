import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Linking, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';

export default function CaptureImageScreen({ navigation }) { // Accept navigation prop
 const [hasCameraPermission, setHasCameraPermission] = useState(null);
 const [hasLocationPermission, setHasLocationPermission] = useState(null);
 const cameraRef = useRef(null);

 useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      const locationStatus = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(locationStatus.status === 'granted');
    })();
 }, []);

 const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
    //   console.log(photo);
      // Convert the image to base64
      const base64String = await FileSystem.readAsStringAsync(photo.uri, { encoding: FileSystem.EncodingType.Base64 });
      // Send the image to the server for fire detection
      const fireDetected = await detectFire(base64String);
    //   console.log(fireDetected);
      if (fireDetected) {
        sendEmail(photo.uri);
      } else {
        // Navigate back if no fire is detected
        Alert.alert('No Fire Detected', 'No fire was detected in the image.', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
      }
    }
 };

 const detectFire = async (base64String) => {
    try {
      const response = await fetch("http://192.168.244.109:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64String }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data);
      if(data.prediction === "fire"){
        return true;
      }
      else{
        return false;
      }
    } catch (error) {
      console.error("Error detecting fire:", error);
      return false;
    }
 };

 const sendEmail = async (photoUri) => {
    let location = await Location.getCurrentPositionAsync({});
    let emailUrl = `mailto:authorities@example.com?subject=Wildfire Alert&body=I have detected a wildfire near me. Please find attached the photo of the burning forest. My location is: ${location.coords.latitude}, ${location.coords.longitude}.`;
    Linking.openURL(emailUrl);
 };

 if (hasCameraPermission === null || hasLocationPermission === null) {
    return <View />;
 }
 if (hasCameraPermission === false || hasLocationPermission === false) {
    return <Text>No access to camera or location</Text>;
 }

 return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={Camera.Constants.Type.back} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Snap</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
 );
}

const styles = StyleSheet.create({
 container: {
    flex: 1,
 },
 camera: {
    flex: 1,
 },
 buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
 },
 button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
 },
 text: {
    fontSize: 18,
    marginBottom: 10,
    color: 'white',
 },
});
