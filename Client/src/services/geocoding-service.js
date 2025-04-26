/**
 * Service to handle geocoding operations like getting addresses from coordinates
 * Note: For production, you'll need to use a proper geocoding API like Google Maps, Mapbox, etc.
 */

// Example function to get address from coordinates using the Nominatim OpenStreetMap API
// Note: For production use, consider using a paid service as free services have rate limits
export const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'YourAppName/1.0', // Required by Nominatim's terms of use
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch address data');
      }
      
      const data = await response.json();
      
      // Format the address
      if (data && data.display_name) {
        return data.display_name;
      } else {
        return 'Address not found';
      }
    } catch (error) {
      console.error('Error getting address:', error);
      return 'Error retrieving address';
    }
  };
  
  // Function to format address for display
  export const formatAddress = (address) => {
    if (!address) return 'No address information';
    
    // Simple formatting to remove extra commas, spaces, etc.
    return address
      .replace(/,\s*,/g, ',')
      .replace(/\s+/g, ' ')
      .trim();
  };