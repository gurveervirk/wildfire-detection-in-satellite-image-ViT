from flask import Flask, request, jsonify
from flask_cors import CORS # Import CORS from flask_cors
import numpy as np
import torch
import PIL.Image
import json
from transformers import AutoImageProcessor, AutoModelForImageClassification
import base64
import io
app = Flask(__name__)
CORS(app,origins="*") # Enable CORS for all routes

# Function to load the model and feature extractor
save_directory = "./local_model_directory"
def load_model_and_feature_extractor():
    feature_extractor = AutoImageProcessor.from_pretrained(save_directory)
    model = AutoModelForImageClassification.from_pretrained(save_directory)
    return model, feature_extractor

# Load the model and feature extractor
model, feature_extractor = load_model_and_feature_extractor()

# Load the id2label mapping from the config.json
with open(f'{save_directory}/config.json', 'r') as f:
    config = json.load(f)
id2label = config.get('id2label', {})

@app.route('/', methods=['GET'])
def home():
    return "Welcome to our site!"


@app.route('/predict', methods=['POST'])
def predict():
    # Check if the request contains JSON data
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    # Parse the JSON data
    data = request.get_json()

    # Check if the 'image' field is present
    if 'image' not in data:
        return jsonify({"error": "No image field in request"}), 400

    # Decode the base64 image
    try:
        image_bytes = base64.b64decode(data['image'])
        image = PIL.Image.open(io.BytesIO(image_bytes))
    except Exception as e:
        return jsonify({"error": "Error decoding image"}), 400

    # Ensure the image is in RGB format
    if image.mode != 'RGB':
        image = image.convert('RGB')

    # Process the image with the feature extractor
    inputs = feature_extractor(images=image, return_tensors="pt", padding=True)

    # Run the image through the model
    outputs = model(**inputs)
    logits = outputs.logits

    # Use softmax to calculate probabilities
    probs = logits.softmax(dim=-1)

    # Detach the tensor and convert it to a NumPy array
    predictions = np.argmax(probs.detach().numpy(), axis=-1)

    # Convert the prediction ID to its corresponding label name
    prediction_label = id2label[str(predictions[0])]

    # Get the highest probability
    top_prob, top_catid = torch.max(probs, dim=-1)

    # Return the prediction and probability as a JSON response
    return jsonify({"prediction": prediction_label, "probability": top_prob.item() * 100})

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ['jpg', 'png']

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
