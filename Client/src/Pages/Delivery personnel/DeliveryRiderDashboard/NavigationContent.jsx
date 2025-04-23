import { useState, useEffect, useRef } from 'react';
import {
    FaDirections,
    FaMapMarkerAlt,
    FaCheckCircle,
    FaTimes,
    FaPhone,
    FaStore,
    FaUser,
    FaExchangeAlt,
    FaRoute
} from 'react-icons/fa';
import { GoogleMap, useJsApiLoader, DirectionsRenderer, Marker, InfoWindow } from '@react-google-maps/api';

// Replace with your actual Google Maps API key
const GOOGLE_MAPS_API_KEY = 'AIzaSyBi4Wz0qEqvCXOoaI3G9GcYEFmIBzx870g';

function NavigationContent({ orderData }) {
    // Loading Google Maps API
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: ['places']
    });

    // State variables
    const [driverLocation, setDriverLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [directions, setDirections] = useState(null);
    const [mapInstance, setMapInstance] = useState(null);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [distanceInfo, setDistanceInfo] = useState({ distance: '', duration: '' });
    const [deliveryStage, setDeliveryStage] = useState('goingToRestaurant'); // goingToRestaurant, atRestaurant, goingToCustomer, atCustomer, delivered
    const locationWatchId = useRef(null);

    // Default order data if none provided
    const currentOrder = orderData || {
        id: 'ORD-5675',
        customer: 'David Brown',
        pickup: '555 Market St',
        dropoff: '777 Home Ave',
        customerPhone: '(555) 987-6543',
        status: 'Accepted',
        restaurant: 'Burger Corner',
        pickupLatitude: '6.03538579711526',
        pickupLongitude: '80.21097343326443',
        dropoffLatitude: '6.0105569999665125',
        dropoffLongitude: '80.26322751821459',
    };

    // Convert string coordinates to numbers
    const pickupLocation = {
        lat: parseFloat(currentOrder.pickupLatitude),
        lng: parseFloat(currentOrder.pickupLongitude)
    };

    const dropoffLocation = {
        lat: parseFloat(currentOrder.dropoffLatitude),
        lng: parseFloat(currentOrder.dropoffLongitude)
    };

    // Get the current destination based on delivery stage
    const getCurrentDestination = () => {
        return (deliveryStage === 'goingToRestaurant' || deliveryStage === 'atRestaurant')
            ? pickupLocation
            : dropoffLocation;
    };

    // Initialize geolocation tracking
    useEffect(() => {
        if (navigator.geolocation) {
            // Get initial position
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setDriverLocation(pos);
                    setIsLoading(false);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    // Fallback position - slightly offset from pickup
                    setDriverLocation({
                        lat: pickupLocation.lat - 0.002,
                        lng: pickupLocation.lng - 0.002
                    });
                    setIsLoading(false);
                },
                { enableHighAccuracy: true }
            );

            // Set up continuous tracking
            locationWatchId.current = navigator.geolocation.watchPosition(
                (position) => {
                    setDriverLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => console.error("Location watch error:", error),
                { enableHighAccuracy: true, maximumAge: 10000 }
            );
        } else {
            // Fallback for browsers without geolocation
            setDriverLocation({
                lat: pickupLocation.lat - 0.002,
                lng: pickupLocation.lng - 0.002
            });
            setIsLoading(false);
        }

        // Cleanup
        return () => {
            if (locationWatchId.current) {
                navigator.geolocation.clearWatch(locationWatchId.current);
            }
        };
    }, [pickupLocation.lat, pickupLocation.lng]);

    // Calculate route when driver location or destination changes
    useEffect(() => {
        if (!isLoaded || !driverLocation) return;

        const destination = getCurrentDestination();

        const directionsService = new window.google.maps.DirectionsService();

        directionsService.route(
            {
                origin: driverLocation,
                destination: destination,
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    setDirections(result);

                    // Extract distance and duration
                    const leg = result.routes[0].legs[0];
                    setDistanceInfo({
                        distance: leg.distance.text,
                        duration: leg.duration.text
                    });

                    // Auto-detect when driver is near destination
                    if (leg.distance.value < 100) { // Within 100 meters
                        if (deliveryStage === 'goingToRestaurant') {
                            setDeliveryStage('atRestaurant');
                        } else if (deliveryStage === 'goingToCustomer') {
                            setDeliveryStage('atCustomer');
                        }
                    }
                } else {
                    console.error(`Directions request failed: ${status}`);
                }
            }
        );
    }, [isLoaded, driverLocation, deliveryStage, pickupLocation, dropoffLocation]);

    // Handle pickup confirmation - CRITICAL FIX: This switches the navigation to customer
    const confirmPickup = () => {
        setDeliveryStage('goingToCustomer');
        setDirections(null); // Clear directions to force recalculation
    };

    // Handle delivery confirmation
    const confirmDelivery = () => {
        setDeliveryStage('delivered');
    };

    // Recenter map on driver
    const recenterMap = () => {
        if (mapInstance && driverLocation) {
            mapInstance.panTo(driverLocation);
            mapInstance.setZoom(15);
        }
    };

    // Map container style
    const mapContainerStyle = {
        width: '100%',
        height: '100%',
        borderRadius: '0.5rem'
    };

    // Map options
    const mapOptions = {
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
    };

    // Error fallback
    if (loadError) {
        return (
            <div className="h-full flex items-center justify-center bg-gray-100">
                <div className="text-center p-6 bg-white rounded-lg shadow-lg">
                    <FaTimes className="mx-auto text-red-500 text-3xl mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Failed to load Google Maps</h3>
                    <p className="text-gray-600">Please check your internet connection or API key and try again.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full">
            <div className="h-full flex flex-col">
                {/* Map Container */}
                <div className="relative flex-1 bg-gray-200 rounded-lg overflow-hidden shadow-inner">
                    {!isLoaded || isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                        </div>
                    ) : (
                        <div className="relative h-full">
                            <GoogleMap
                                mapContainerStyle={mapContainerStyle}
                                center={driverLocation}
                                zoom={15}
                                options={mapOptions}
                                onLoad={(map) => setMapInstance(map)}
                            >
                                {/* Direction path */}
                                {directions && (
                                    <DirectionsRenderer
                                        options={{
                                            directions: directions,
                                            suppressMarkers: true, // Use custom markers instead
                                            polylineOptions: {
                                                strokeColor: "#FF8A00",
                                                strokeWeight: 5,
                                                strokeOpacity: 0.8
                                            }
                                        }}
                                    />
                                )}

                                {/* Driver Marker */}
                                {driverLocation && (
                                    <Marker
                                        position={driverLocation}
                                        icon={{
                                            url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
                                            scaledSize: isLoaded ? new window.google.maps.Size(40, 40) : null
                                        }}
                                        onClick={() => setSelectedMarker('driver')}
                                    />
                                )}

                                {/* Restaurant Marker */}
                                <Marker
                                    position={pickupLocation}
                                    icon={{
                                        url: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png',
                                        scaledSize: isLoaded ? new window.google.maps.Size(40, 40) : null
                                    }}
                                    onClick={() => setSelectedMarker('restaurant')}
                                />

                                {/* Customer Marker */}
                                <Marker
                                    position={dropoffLocation}
                                    icon={{
                                        url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                                        scaledSize: isLoaded ? new window.google.maps.Size(40, 40) : null
                                    }}
                                    onClick={() => setSelectedMarker('customer')}
                                />

                                {/* Info Windows */}
                                {selectedMarker === 'driver' && (
                                    <InfoWindow
                                        position={driverLocation}
                                        onCloseClick={() => setSelectedMarker(null)}
                                    >
                                        <div className="p-2">
                                            <p className="font-bold text-sm text-black">Your Location</p>
                                            <p className="text-xs text-gray-500">Updating in real-time</p>
                                        </div>
                                    </InfoWindow>
                                )}

                                {selectedMarker === 'restaurant' && (
                                    <InfoWindow
                                        position={pickupLocation}
                                        onCloseClick={() => setSelectedMarker(null)}
                                    >
                                        <div className="p-2">
                                            <p className="font-bold text-sm text-black ">{currentOrder.restaurant}</p>
                                            <p className="text-xs text-gray-500 ">{currentOrder.pickup}</p>
                                        </div>
                                    </InfoWindow>
                                )}

                                {selectedMarker === 'customer' && (
                                    <InfoWindow
                                        position={dropoffLocation}
                                        onCloseClick={() => setSelectedMarker(null)}
                                    >
                                        <div className="p-2">
                                            <p className="font-bold text-sm text-black">{currentOrder.customer}</p>
                                            <p className="text-xs text-gray-500 ">{currentOrder.dropoff}</p>
                                        </div>
                                    </InfoWindow>
                                )}
                            </GoogleMap>

                            {/* Stage Indicator */}
                            <div className="absolute top-4 left-0 right-0 mx-auto w-4/5 max-w-md bg-white rounded-lg shadow-lg p-3 z-10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        {(deliveryStage === 'goingToRestaurant' || deliveryStage === 'atRestaurant') ? (
                                            <>
                                                <div className="bg-orange-500 p-2 rounded-full text-white mr-3">
                                                    <FaStore size={16} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm text-black">
                                                        {deliveryStage === 'goingToRestaurant' ? 'Heading to Restaurant' : 'At Restaurant'}
                                                    </p>
                                                    <p className="text-xs text-black">{currentOrder.restaurant}</p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="bg-blue-500 p-2 rounded-full text-white mr-3">
                                                    <FaUser size={16} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm text-black">
                                                        {deliveryStage === 'goingToCustomer' ? 'Heading to Customer' :
                                                            deliveryStage === 'atCustomer' ? 'At Customer Location' :
                                                                'Delivered'}
                                                    </p>
                                                    <p className="text-xs text-black">{currentOrder.customer}</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">{distanceInfo.distance}</p>
                                        <p className="text-sm font-medium text-black">{distanceInfo.duration}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Controls */}
                            <div className="absolute top-20 right-4 bg-white rounded-lg shadow-lg p-2 z-10">
                                <button
                                    onClick={recenterMap}
                                    className="flex items-center justify-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm w-full"
                                >
                                    <FaRoute className="mr-2" /> Re-center Map
                                </button>

                                {deliveryStage === 'atRestaurant' && (
                                    <button
                                        onClick={confirmPickup}
                                        className="flex items-center justify-center px-3 py-2 mt-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm w-full"
                                    >
                                        <FaCheckCircle className="mr-2" /> Confirm Pickup
                                    </button>
                                )}

                                {deliveryStage === 'atCustomer' && (
                                    <button
                                        onClick={confirmDelivery}
                                        className="flex items-center justify-center px-3 py-2 mt-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm w-full"
                                    >
                                        <FaCheckCircle className="mr-2" /> Confirm Delivery
                                    </button>
                                )}

                                {(deliveryStage === 'goingToRestaurant' || deliveryStage === 'goingToCustomer') && (
                                    <button
                                        onClick={() => setDeliveryStage(deliveryStage === 'goingToRestaurant' ? 'atRestaurant' : 'atCustomer')}
                                        className="flex items-center justify-center px-3 py-2 mt-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm w-full"
                                    >
                                        <FaExchangeAlt className="mr-2" /> I've Arrived
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Current Order Card */}
                <div className="bg-white rounded-lg shadow-lg mt-4 p-4">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="font-bold text-lg ">{currentOrder.id}</h3>
                            <p className="text-sm text-gray-500 ">{currentOrder.restaurant}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${deliveryStage === 'goingToRestaurant' ? 'bg-orange-100 text-orange-800' :
                            deliveryStage === 'atRestaurant' ? 'bg-yellow-100 text-yellow-800' :
                                deliveryStage === 'goingToCustomer' ? 'bg-blue-100 text-blue-800' :
                                    deliveryStage === 'atCustomer' ? 'bg-purple-100 text-purple-800' :
                                        'bg-green-100 text-green-800'
                            }`}>
                            {deliveryStage === 'goingToRestaurant' ? 'Going to Pickup' :
                                deliveryStage === 'atRestaurant' ? 'Ready for Pickup' :
                                    deliveryStage === 'goingToCustomer' ? 'Delivering' :
                                        deliveryStage === 'atCustomer' ? 'Ready to Deliver' :
                                            'Delivered'}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">RESTAURANT</p>
                                    <p className="font-medium text-black">{currentOrder.pickup}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">CUSTOMER</p>
                                    <p className="font-medium  text-black">{currentOrder.dropoff}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-gray-500 font-medium">CUSTOMER CONTACT</p>
                                <div className="flex items-center">
                                    <p className="font-medium  text-black">{currentOrder.customer}</p>
                                    <a
                                        href={`tel:${currentOrder.customerPhone}`}
                                        className="ml-2 bg-green-500 text-white p-1.5 rounded-full hover:bg-green-600 transition-colors"
                                    >
                                        <FaPhone size={10} />
                                    </a>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">ETA</p>
                                <p className="font-medium text-blue-600">
                                    {distanceInfo.duration || '15-20 mins'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <div className="bg-blue-100 text-blue-800 p-1.5 rounded-full mr-2">
                                    <FaRoute size={14} />
                                </div>
                                <div>
                                    <p className="font-medium text-sm text-black">
                                        {(deliveryStage === 'goingToRestaurant' || deliveryStage === 'atRestaurant') ?
                                            'Distance to restaurant' :
                                            'Distance to customer'
                                        }
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {distanceInfo.distance || '3.2 km'} • {distanceInfo.duration || '15 mins'}
                                    </p>
                                </div>
                            </div>

                            {/* Action buttons based on delivery stage */}
                            {deliveryStage === 'atRestaurant' && (
                                <button
                                    onClick={confirmPickup}
                                    className="flex items-center justify-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                >
                                    <FaCheckCircle className="mr-2" /> Confirm Pickup
                                </button>
                            )}

                            {deliveryStage === 'atCustomer' && (
                                <button
                                    onClick={confirmDelivery}
                                    className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                >
                                    <FaCheckCircle className="mr-2" /> Confirm Delivery
                                </button>
                            )}

                            {deliveryStage === 'delivered' && (
                                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-lg">
                                    <FaCheckCircle className="inline-block mr-1" /> Delivered
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NavigationContent;
