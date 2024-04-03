# Wildfire detection in satellite images using Google's ViT-base

This project aims to:
- Create a model that can reliably detect wildfires in satellite images
- Compare different models in this task and find the best one
- Integrate with a website that incorporates:
  - Taking a satellite image as input and giving an output "fire" or "no fire"
  - Taking a snapshot from the satellite map and passing it to the model for widlfire detection
  - Automatic monitoring of a region which takes fixed size (level) snapshots of a region on the map, until stopped
 
The datasets and the code used to train the model are available [here](https://www.kaggle.com/code/gurveersinghvirk/fire-detection-vit).
