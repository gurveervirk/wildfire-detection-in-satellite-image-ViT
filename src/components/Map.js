import React, { useEffect } from 'react';
import L from 'leaflet';
import { SimpleMapScreenshoter } from 'leaflet-simple-map-screenshoter';

const MapWithScreenshot = () => {
  useEffect(() => {
    const mapOptions = {
      center: { lat: 39.76738, lng: -121.633759 },
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
        .then((image) => {
          // Process the image and do other actions as needed
          console.log('Screenshot captured:', image);
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

  return (
    <div className='container mt-3'>
      <div className="row">
        <div className="col-md-6">
          <div id="leafletMapid" style={{ height: "80vh" }} />
          <button className="btn btn-primary mt-2" id="snapshot-button">Snapshot</button>
        </div>
        <div className="col-md-6">
          {/* Placeholder for result */}
          <div>Result</div>
        </div>
      </div>
    </div>
  );
};

export default MapWithScreenshot;
