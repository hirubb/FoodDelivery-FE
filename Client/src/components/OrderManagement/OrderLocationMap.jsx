import { useEffect, useState } from 'react';
import { MapPin, AlertCircle } from 'lucide-react';

function OrderLocationMap({ location }) {
  const [mapUrl, setMapUrl] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location || !location.latitude || !location.longitude) {
      setError('No location data available for this order');
      return;
    }
    
    // Use Google Maps Embed API instead of Static API
    const googleMapsEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBUTPe2A_fLIr6l51kJJxQ2GZNutWiHe8c&q=${location.latitude},${location.longitude}&zoom=15`;
    
    setMapUrl(googleMapsEmbedUrl);
  }, [location]);

  if (error) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
        <AlertCircle className="text-yellow-500 mr-3 flex-shrink-0" />
        <div>
          <h3 className="font-medium text-yellow-800">Location Unavailable</h3>
          <p className="text-yellow-700 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!mapUrl) {
    return (
      <div className="animate-pulse bg-gray-200 h-64 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">Loading map...</span>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200">
      <div className="bg-blue-50 p-3 flex items-center border-b border-gray-200">
        <MapPin className="text-blue-500 mr-2" />
        <h3 className="font-medium">Delivery Location</h3>
      </div>
      
      <div className="h-64 relative">
        <iframe
          title="Order Delivery Location"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight="0"
          marginWidth="0"
          src={mapUrl}
          style={{ border: 0 }}
          allowFullScreen
        ></iframe>
        
        {/* Coordinates Display */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
          <div className="flex justify-between">
            <span>Lat: {location?.latitude?.toFixed(6)}</span>
            <span>Lng: {location?.longitude?.toFixed(6)}</span>
          </div>
        </div>
      </div>
      
      <div className="p-3 bg-gray-50 border-t border-gray-200">
        <a 
          href={`https://www.google.com/maps/search/?api=1&query=${location?.latitude},${location?.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
        >
          <span>Open in Google Maps</span>
          <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}

export default OrderLocationMap;