import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import { SimpleMapScreenshoter } from 'leaflet-simple-map-screenshoter';

const MapWithScreenshot = () => {
    const [map, setMap] = useState(null);
    const [imageParts, setImageParts] = useState([]);
    const [screenshotter, setScreenshotter] = useState(null);
    const [results, setResults] = useState([]);
    const [mPart, setMpart] = useState([]);

    useEffect(() => {
        const mapOptions = {
            center: { lat: 39.76738, lng: -121.633759 },
            zoom: 15
        };
        const mapInstance = L.map('leafletMapid', mapOptions);

        // Create some custom panes
        mapInstance.createPane('snapshot-pane');
        mapInstance.createPane('dont-include');

        // Add base layer to snapshot pane
        const baseLayer = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            pane: 'snapshot-pane'
        }).addTo(mapInstance);

        // const mapInstance = L.map('leafletMapid', mapOptions);
        setMap(mapInstance);

        // Your existing map setup code...

        // Set up screenshotter options
        const snapshotOptions = {
            hideElementsWithSelectors: ['.leaflet-control-container', '.leaflet-dont-include-pane', '#snapshot-button'],
            hidden: true
        };

        // Add screenshotter to map
        const screenshotter = new SimpleMapScreenshoter(snapshotOptions);
        screenshotter.addTo(mapInstance);
        setScreenshotter(screenshotter);
        // Function to calculate the 9 parts of the visible map

        // Function to zoom into each part and capture the view

        // Capture the parts when the map is ready
        // mapInstance.whenReady(() => captureParts());

        // Cleanup function
        return () => {
            mapInstance.remove();
        };
    }, []);
    const calculateMapParts = () => {
        const bounds = map.getBounds();
        console.log(bounds)
        const northEast = bounds.getNorthEast();
        const southWest = bounds.getSouthWest();
        const center = bounds.getCenter();

        // Calculate the width and height of the visible map in degrees
        const width = northEast.lng - southWest.lng;
        const height = northEast.lat - southWest.lat;

        // Divide the visible map into 9 parts
        const parts = [];
        for (let i = 0; i < width / 0.00397498428; i++) {
            for (let j = 0; j < height / 0.00682353973; j++) {
                const partCenter = L.latLng(
                    center.lat + 0.00397498428 * (i - 1),
                    center.lng + 0.00682353973 * (j - 1)
                );
                parts.push({ center: partCenter, zoom: 17 });
            }
        }
        setMpart(parts);
        console.log(parts)
        return parts;
    };
    const captureParts = async () => {
        setImageParts([]);
        setResults([]);
        const mapParts = calculateMapParts();
        console.log(mapParts)
        for (const part of mapParts) {

            await new Promise(resolve => map.flyTo(part.center, part.zoom, { duration: 2 }).whenReady(resolve));
            const imageDataUrl = await screenshotter.takeScreen('image');

            const blob = dataURLtoBlob(imageDataUrl);
            const file = new File([blob], 'screenshot.png', { type: 'image/png' });
            // console.log(file)
            // Set the file in state
            if (file) {
                const base64String = await convertFileToBase64(file);
                // console.log(base64String)
                setResults(prevResults => [...prevResults, { loading: true }]);
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
                        console.log(data);
                        setResults(prevResults => [...prevResults.slice(0, -1), data]);
                        if (data && data.prediction === 'Normal') {
                            fetch('http://192.168.244.109:3000/send-email', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ target: 'sardapreet@gmail.com', lat: part.center.lat, long: part.center.lng })
                            })
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error('Network response was not ok');
                                    }
                                    return response.json();
                                })
                                .then(data => {
                                    console.log('Email sent:', data);
                                })
                                .catch(error => {
                                    console.error('Error sending email:', error);
                                });
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        setResults(prevResults => [...prevResults.slice(0, -1), { error }]);
                    });
            }

            setImageParts(prevParts => [...prevParts, imageDataUrl]);
        }
    };

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
                    <button className="btn btn-primary mt-2" onClick={captureParts} id="capture-button">Start Monitor</button>
                    {/* <p>{results}</p> */}
                </div>
                <div className="col-md-6">
                    {/* Display the image parts and prediction results in cards */}
                    <div className="card my-2">
                        <div className="card-body">
                            <h5 className="card-title">Select the area to be monitored and click the start button</h5>
                        </div>
                    </div>

                    {imageParts.map((part, index) => (
                        <div key={index} className="card mb-3">
                            <div className="row g-0">
                                <div className="col-md-4">
                                    <img src={part} className="card-img-top" alt="Part" style={{ width: '25vh', height: '25vh' }} />
                                </div>
                                <div className="col-md-8">
                                    <div className="card-body">
                                        <h5 className="card-title">Image Part {index + 1}</h5>
                                        <p className="card-text">Latitude: {mPart[index].center.lat}</p>
                                        <p className="card-text">Longitude: {mPart[index].center.lng}</p>
                                        <p className="card-text">Prediction: {results[index].prediction}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    ))}
                </div>

            </div>
        </div>
    );
};

export default MapWithScreenshot;