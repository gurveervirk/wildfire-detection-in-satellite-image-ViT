import React, { useState } from "react";
import { StyleSheet, View, Button, Image, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function App() {
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
      const formData = new FormData();
      const imageType =
        image.split(".").pop() === "png" ? "image/png" : "image/jpeg";
      formData.append("file", {
        uri: image,
        type: imageType,
        name: `uploadedImage.${imageType.split("/")[1]}`,
      });
      try {
        const response = await fetch("http://192.168.244.109:5000/predict", {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Sending image to server...");
        console.log(response);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data);
        setPrediction(data.prediction);
        setProbability(data.probability);
      } catch (error) {
        console.error("Error sending image to server:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
       <Button title="Pick an image" onPress={pickImage} style={styles.button} />
       {image && <Image source={{ uri: image }} style={styles.image} />}
       <Button title="Predict" onPress={sendImageToServer} style={styles.button} />
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
   
  } 
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
    button: {
       marginTop: 20,
       padding: 10,
       backgroundColor: "#841584",
       borderRadius: 5,
       width: "80%",
       alignItems: "center",
       justifyContent: "center",
    },
    buttonText: {
       color: "#FFF",
       fontSize: 16,
       fontWeight: "bold", // Added font weight for button text
    },
   });
    
  