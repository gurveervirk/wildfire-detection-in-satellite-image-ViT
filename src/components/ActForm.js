import React, { useRef, useEffect, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './map.css';
import html2canvas from 'html2canvas'

export default function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const tokyo = { lng: 139.753, lat: 35.6844 };
  const [zoom] = useState(14);
  maptilersdk.config.apiKey = 'deAcHpfKkeVZGXkn6T1F';

  const takeScreenshot = () => {
    if (!mapContainer.current) return;

    html2canvas(mapContainer.current).then((canvas) => {
      const dataUrl = canvas.toDataURL('image/png');
      // Now you can save the image or send it to the backend
      // For demonstration, we'll log the data URL
      console.log(dataUrl);
    });
  };

  useEffect(() => {
    if (map.current) return; // stops map from intializing more than once

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.SATELLITE,
      center: [tokyo.lng, tokyo.lat],
      zoom: zoom
    });

  }, [tokyo.lng, tokyo.lat, zoom]);

  return (
    <div className='container mt-3'>
      <div className="map-wrap">
        <div ref={mapContainer} className="map" />
      </div>
      <button onClick={takeScreenshot} className='btn btn-primary mt-2'> Download</button>
    </div>
  );
}