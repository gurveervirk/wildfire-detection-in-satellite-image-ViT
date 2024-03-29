import React, { useState } from "react";
import { StyleSheet, View, Button, Image, Text,TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from 'expo-file-system';

export default function UploadImageScreen() {
 const [image, setImage] = useState(null);
 const [prediction, setPrediction] = useState(null);
 const [probability, setProbability] = useState(null);

 // Function to pick an image
 const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
 };

 // Function to send the image to the server
 const sendImageToServer = async () => {
    if (image) {
      try {
        // Read the image file as a base64 string
        const base64String = await FileSystem.readAsStringAsync(image, { encoding: FileSystem.EncodingType.Base64 });

        // Send the base64 string to the server
        const response = await fetch("http://192.168.244.109:5000/predict", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: base64String }),
        });

        console.log("Sending image to server...");
        // console.log(response);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        // console.log(data);
        setPrediction(data.prediction);
        setProbability(data.probability);
      } catch (error) {
        console.error("Error sending image to server:", error);
      }
    }
 };

 return (
  <View style={styles.container}>
    <View style={styles.buttonContainer}>
      <TouchableOpacity onPress={pickImage}>
        <Text style={styles.buttonText}>Pick an image</Text>
      </TouchableOpacity>
    </View>
    {image && <Image source={{ uri: image }} style={styles.image} />}
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={{marginTop:10}} onPress={sendImageToServer}>
        <Text style={styles.buttonText}>Predict</Text>
      </TouchableOpacity>
    </View>
    {prediction && (
      <View style={styles.predictionContainer}>
        <Text style={styles.predictionText}>Prediction: {prediction}</Text>
        <Text style={styles.probabilityText}>
          Probability: {probability ? `${probability.toFixed(2)}%` : "N/A"}
        </Text>
      </View>
    )}
  </View>
);
};

const styles = StyleSheet.create({
container: {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#F5FCFF",
},
image: {
  width: 200,
  height: 200,
  resizeMode: "contain",
  marginTop: 20,
  borderWidth: 1,
  borderColor: "#841584",
  borderRadius: 10,
},
predictionContainer: {
  marginTop: 20,
  padding: 10,
  backgroundColor: "#E0E0E0",
  borderRadius: 10,
  width: "80%",
  alignItems: "center",
},
predictionText: {
  fontSize: 18,
  fontWeight: "bold",
  color: "#841584",
},
probabilityText: {
  fontSize: 16,
  color: "#333",
},
buttonContainer: {
  marginTop: 30, // Adjusted margin for the container wrapping the button
  marginBottom: 30, // Adjusted margin for the container wrapping the button
  width: "80%", // Ensure the container matches the button width
  alignItems: "center", // Center the button within the container
  backgroundColor: "#E0E0E0",
  borderRadius: 10,
  textAlign: "center",
},
buttonText: {
  color: "#841584",
  fontSize: 20,
  padding: 10,
  textAlign: "center",
},
});