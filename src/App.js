import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import './App.css';
import Data from './jawa-timur.geojson';
mapboxgl.accessToken = 'pk.eyJ1IjoiaGFuc2FsYmEiLCJhIjoiY2t0NDMxMzlnMTAxNzJ2bW03bDFwM21vbyJ9.4jAdRHYVdOteOa1Y-9nYug';

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(112.768845);
  const [lat, setLat] = useState(-7.250445);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [lng, lat],
      zoom: zoom
    });
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('load', () => {
      map.current.addSource('my-data', {
        'type': 'geojson',
        'data': Data
      });

      map.current.addLayer({
        'id': 'kabupaten',
        'type': 'fill',
        'source': 'my-data',
        'layout': {
          'fill-sort-key': 2
        },
        'paint': {
          'fill-color': '#648DE5',
          'fill-opacity': 0.3
        },
        'filter': ['>=', ['get', 'name'], 'Kabupaten']
      })

      map.current.addLayer({
        'id': 'kota',
        'type': 'fill',
        'source': 'my-data',
        'layout': {
          'fill-sort-key': 1
        },
        'paint': {
          'fill-color': '#D00000',
          'fill-opacity': 0.3
        },
        'filter': ['>=', ['get', 'name'], 'Kota']
      })

      map.current.addLayer({
        'id': 'garis-pembatas',
        'type': 'line',
        'source': 'my-data',
        'paint': {
          'line-color': '#000000',
          'line-width': 3
        },
      })
    });
  });

  return (
    <div>
    <div ref={mapContainer} className="map-container" />
  </div>
  );
}

export default App;
