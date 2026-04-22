'use client';

import React, { useState } from 'react';
import Map from '@/components/Map';
import axios from 'axios';

const MapTestPage = () => {
  const [routeData, setRouteData] = useState<{ duration: number; geometry: any } | null>(null);
  const [loading, setLoading] = useState(false);

  const origin = { lat: 12.9716, lng: 77.5946, label: 'Origin (Hospital)' };
  const destination = { lat: 13.0827, lng: 80.2707, label: 'Destination (Donor)' };

  const fetchRoute = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/route/', {
        params: {
          origin_lat: origin.lat,
          origin_lng: origin.lng,
          dest_lat: destination.lat,
          dest_lng: destination.lng
        }
      });
      setRouteData(response.data);
    } catch (error) {
      console.error("Error fetching route:", error);
      alert("Failed to fetch route. Make sure the backend is running and the ORS key is valid.");
    } finally {
      setLoading(false);
    }
  };

  const markers = [
    { id: 'origin', ...origin, type: 'hospital' as const },
    { id: 'destination', ...destination, type: 'donor' as const }
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white p-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Route Visualization
          </h1>
          <p className="text-slate-400 mt-2">MapLibre + OpenRouteService Integration</p>
        </div>
        
        <div className="flex gap-4 items-center">
          {routeData && (
            <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
              <span className="text-sm text-slate-400">Duration: </span>
              <span className="font-mono text-blue-400 font-bold">{routeData.duration} mins</span>
            </div>
          )}
          <button
            onClick={fetchRoute}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-colors rounded-lg font-semibold shadow-lg shadow-blue-500/20"
          >
            {loading ? 'Calculating...' : 'Calculate Route'}
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 relative">
        <Map 
          markers={markers}
          routeGeometry={routeData?.geometry}
          center={[78.9629, 20.5937]} // Center of India roughly
          zoom={5}
        />
      </div>
    </div>
  );
};

export default MapTestPage;
