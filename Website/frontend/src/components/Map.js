import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import { SimpleMapScreenshoter } from 'leaflet-simple-map-screenshoter';

const MapWithScreenshot = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);


  useEffect(() => {
    const mapOptions = {
      center: { lat: 34.0522, lng:-118.2437 },
      zoom: 15
    };

    // Create a map and assign it to the map div
    const map = L.map('leafletMapid', mapOptions);

    // Create some custom panes
    map.createPane('snapshot-pane');
    map.createPane('dont-include');

    // Add base layer to snapshot pane
    const baseLayer = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      pane: 'snapshot-pane'
    }).addTo(map);

    // Set up snapshotter options
    const snapshotOptions = {
      hideElementsWithSelectors: ['.leaflet-control-container', '.leaflet-dont-include-pane', '#snapshot-button'],
      hidden: true
    };

    // Add screenshotter to map
    const screenshotter = new SimpleMapScreenshoter(snapshotOptions);
    screenshotter.addTo(map);

    // Create a flag to track whether all tiles are loaded
    let tilesLoaded = false;

    // Listen for the 'tileload' event on the base layer
    baseLayer.on('tileload', () => {
      // Check if all tiles are loaded
      if (!tilesLoaded && document.querySelectorAll('.leaflet-tile.leaflet-tile-loaded').length === baseLayer._tilesToLoad) {
        tilesLoaded = true;
        // Now all tiles are loaded, take the screenshot
        takeScreenShot();
      }
    });

    // Handle clicking the "Snapshot" button
    const takeScreenShot = () => {
      screenshotter
        .takeScreen('image')
        .then(async (imageDataUrl) => {
          // Convert imageDataUrl to Blob
          const blob = dataURLtoBlob(imageDataUrl);
          const file = new File([blob], 'screenshot.png', { type: 'image/png' });

          // Set the file in state
          setImage(file);
          if (file) {
            const base64String = await convertFileToBase64(file);
            console.log(base64String)
            fetch('http://192.168.244.109:5000/predict', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ image: base64String })
            })
              .then(response => {
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                return response.json();
              })
              .then(data => {
                // console.log(data)
                setResult(data);
                // console.log(result)
              })
              .catch(error => {
                console.error('Error:', error);
                setResult('Error: ' + error);
                
              });
          }
        })
        .catch((error) => {
          console.error('Error capturing screenshot:', error);
        });
    };


    // Add takescreenshot function to button
    const button = document.getElementById('snapshot-button');
    button.addEventListener('click', takeScreenShot);

    // Cleanup function
    return () => {
      map.remove();
      button.removeEventListener('click', takeScreenShot);
    };
  }, []);

  // Function to convert dataURL to Blob
  const dataURLtoBlob = (dataURL) => {
    const parts = dataURL.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result.replace('data:', '').replace(/^.+,/, ''));
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className='container mt-3'>
      <div className="row">
        <div className="col-md-6">
          <div id="leafletMapid" style={{ height: "70vh" }} />
          <button className="btn btn-primary mt-2" id="snapshot-button">Click here to get result</button>
        </div>
        <div className="col-md-6">
        <div className="card">
            <div className="card-body">
              <h5 className="card-title">Wildfire Detection</h5>
              {result ? (
                <>
                  <p className="card-text">Prediction: {result.prediction}</p>
                  <p className="card-text">Probability: {(result.probability).toFixed(2)}%</p>
                </>
              ) : (
                <p className="card-text">Result of wildfire detection will be shown here.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapWithScreenshot;
