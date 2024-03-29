import streamlit as st
import numpy as np
import torch
import PIL.Image
import json
from transformers import AutoImageProcessor, AutoModelForImageClassification

# Function to load the model and feature extractor
save_directory = "./local_model_directory"
def load_model_and_feature_extractor():
    # Specify the directory where the model and feature extractor are saved
    
    # Load the feature extractor and model
    feature_extractor = AutoImageProcessor.from_pretrained(save_directory)
    model = AutoModelForImageClassification.from_pretrained(save_directory)
    
    return model, feature_extractor

# Load the model and feature extractor
model, feature_extractor = load_model_and_feature_extractor()

# Load the id2label mapping from the config.json
with open(f'{save_directory}/config.json', 'r') as f:
    config = json.load(f)
id2label = config.get('id2label', {})

st.title('Image Prediction App')

uploaded_file = st.file_uploader("Choose an image...", type=["jpg", "png"])
if uploaded_file is not None:
    image = PIL.Image.open(uploaded_file)
    st.image(image, caption='Uploaded Image.', use_column_width=True)
    st.write("")

    # Ensure the image is in RGB format
    image = image.convert("RGB")

    # Preprocess the image as a batch
    inputs = feature_extractor(images=[image], return_tensors="pt", padding=True)

    # Run the image through the model
    outputs = model(**inputs)
    logits = outputs.logits

    # Use softmax to calculate probabilities
    probs = logits.softmax(dim=-1)

    # Detach the tensor and convert it to a NumPy array
    predictions = np.argmax(probs.detach().numpy(), axis=-1)

    # Convert the prediction ID to its corresponding label name
    prediction_label = id2label[str(predictions[0])]

    # Display the prediction
    st.write(f"Prediction: {prediction_label}")

    # Display probabilities (optional)
    # Get the highest probability
    top_prob, top_catid = torch.max(probs, dim=-1)
    st.write(f"Probability: {top_prob.item() * 100:.2f}%")
