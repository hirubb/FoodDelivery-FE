import { useState, useEffect, useRef } from "react";
import { MapPin, X, Search, Check, Crosshair } from "lucide-react";

function DeliveryLocationPopup({ isOpen, onClose, onSave, initialLocation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(initialLocation || null);
  const [isLoading, setIsLoading] = useState(false);
  const [mapUrl, setMapUrl] = useState("");
  const searchInputRef = useRef(null);

  // Focus on search input when popup opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 300);
    }
  }, [isOpen]);

  // Update map when location changes
  useEffect(() => {
    if (selectedLocation?.latitude && selectedLocation?.longitude) {
      const lat = selectedLocation.latitude;
      const lng = selectedLocation.longitude;
      
      // Set map URL based on selected location
      const googleMapsEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBUTPe2A_fLIr6l51kJJxQ2GZNutWiHe8c&q=${lat},${lng}&zoom=15`;
      setMapUrl(googleMapsEmbedUrl);
    }
  }, [selectedLocation]);

  // Try to get user's location when popup opens
  useEffect(() => {
    if (isOpen && !selectedLocation) {
      handleUseCurrentLocation();
    }
  }, [isOpen]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
  
    try {
      setIsLoading(true);
  
      // Simulate location search with a timeout
      setTimeout(() => {
        // Center coordinates for Malabe, Sri Lanka
        const malabeLat = 6.9147;
        const malabeLng = 79.9710;
  
        // Generate small random variations around Malabe
        const mockLocation = {
          latitude: malabeLat + (Math.random() - 0.5) * 0.01,  // ~0.005 degree variation
          longitude: malabeLng + (Math.random() - 0.5) * 0.01,
          address: searchQuery,
          timestamp: Date.now(),
          source: "search"
        };
        
        setSelectedLocation(mockLocation);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error searching location:", error);
      setIsLoading(false);
    }
  };
  

  const handleUseCurrentLocation = () => {
    setIsLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Reverse geocode to get address (simulated here)
        // In a real app, you would use a service like Google's Geocoding API
        
        const locationData = {
          latitude,
          longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
          address: "Current Location", // In real app, get this from geocoding service
          source: "current"
        };
        
        setSelectedLocation(locationData);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error getting user location:", error);
        setIsLoading(false);
        alert("Could not get your current location. Please try entering an address.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handleSaveLocation = () => {
    if (selectedLocation) {
      onSave(selectedLocation);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header - Fixed position */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-white">
          <h2 className="text-xl font-semibold flex items-center">
            <MapPin className="text-[#FC8A06] mr-2" size={20} />
            Delivery Location
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto">
          {/* Current Location Button */}
          <div className="p-4 border-b">
            <button
              onClick={handleUseCurrentLocation}
              className="flex items-center justify-center w-full p-3 bg-blue-500 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              {isLoading ? (
                <div className="animate-spin h-5 w-5 border-2 border-[#FC8A06] border-t-transparent rounded-full mr-2"></div>
              ) : (
                <Crosshair size={20} className="text-gray-700 mr-2" />
              )}
              <span>Use My Current Location</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b">
            <div className="mb-2 text-sm font-medium text-gray-700">Or search for a different location:</div>
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-grow">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search address or landmark"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FC8A06] focus:border-transparent outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !searchQuery.trim()}
                className="bg-[#FC8A06] text-white px-3 py-2 rounded-lg hover:bg-[#E67E22] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading && searchQuery ? (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <Search size={16} />
                )}
              </button>
            </form>
          </div>

          {/* Map Display */}
          <div className="h-64 bg-gray-100">
            {mapUrl ? (
              <iframe
                title="Delivery Location"
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
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <p className="text-center px-4">
                  {isLoading ? "Getting location..." : "Use current location or search for an address"}
                </p>
              </div>
            )}
          </div>

          {/* Selected Location Info */}
          {selectedLocation && (
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <h3 className="font-medium text-gray-800 mb-1">Selected Location</h3>
              <p className="text-gray-600 text-sm mb-2">
                {selectedLocation.address || "No address available"}
              </p>
              <div className="text-xs text-gray-500 flex gap-4">
                <span>Lat: {selectedLocation.latitude.toFixed(6)}</span>
                <span>Lng: {selectedLocation.longitude.toFixed(6)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Fixed position at bottom */}
        <div className="sticky bottom-0 z-10 flex justify-end p-4 border-t bg-white">
          <button
            onClick={handleSaveLocation}
            disabled={!selectedLocation}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
          >
            <Check size={16} className="mr-1" />
            Save Location
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeliveryLocationPopup;