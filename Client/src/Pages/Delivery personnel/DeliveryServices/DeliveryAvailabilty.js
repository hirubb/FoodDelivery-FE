import DeliveryRiderService from '../../../services/../services/DeliveryRider-service';

const MakeDriverAvailable = async (setLoading, setSuccess, setError) => {
    setLoading(true);
    try {
        const response = await DeliveryRiderService.UpdateDriverDetails({ available: true });
        setSuccess('Driver details updated successfully!');
        setError(null);
    } catch (err) {
        console.error("Error updating driver details:", err);
        setError(err.response?.data?.message || "Failed to update driver details.");
        setSuccess(null);
    } finally {
        setLoading(false);
    }
};



const MakeDriverUnavailable = async (setLoading, setSuccess, setError) => {
    setLoading(true);
    try {
        const response = await DeliveryRiderService.UpdateDriverDetails({ available: false });
        console.log("Driver details updated successfully:", response.data);
        setSuccess('Driver details updated successfully!');
        setError(null);
        return true; // Success indicator
    } catch (err) {
        console.error("Error updating driver details:", err);
        setError(err.response?.data?.message || "Failed to update driver details.");
        setSuccess(null);
        return false; // Failure indicator
    } finally {
        setLoading(false);
    }
};




const UpdateDriverLocation = async (setLoading, setSuccess, setError) => {
    setLoading(true);

    // Check if geolocation is supported by the browser
    if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser.");
        setLoading(false);
        return;
    }


    const locationWatchId = { current: null };


    const getInitialPosition = () => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve(position);


                    locationWatchId.current = navigator.geolocation.watchPosition(
                        (updatedPosition) => {

                            const { latitude, longitude } = updatedPosition.coords;
                            console.log("Location updated - Latitude:", latitude, "Longitude:", longitude);


                            DeliveryRiderService.UpdateDriverDetails({
                                latitude,
                                longitude,
                            }).catch(err => console.error("Background location update failed:", err));
                        },
                        (watchError) => console.error("Location watch error:", watchError),
                        { enableHighAccuracy: true, maximumAge: 10000 }
                    );
                },
                (error) => {
                    reject(error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 0
                }
            );
        });
    };

    try {

        const position = await getInitialPosition();
        const { latitude, longitude } = position.coords;

        console.log("Initial position - Latitude:", latitude, "Longitude:", longitude);


        const response = await DeliveryRiderService.UpdateDriverDetails({
            latitude,
            longitude,
        });

        setSuccess('Driver location updated successfully! Continuous tracking enabled.');
        setError(null);
        setLoading(false);


        setTimeout(() => {
            if (locationWatchId.current) {
                navigator.geolocation.clearWatch(locationWatchId.current);
                console.log("Location tracking stopped after 30 minutes");
            }
        }, 30 * 60 * 1000);

    } catch (err) {
        console.error("Error updating driver location:", err);


        if (err.code) {
            switch (err.code) {
                case 1:
                    setError("Location access was denied. Please enable location services in your browser settings.");
                    break;
                case 2:
                    setError("Your location information is currently unavailable. Please try again.");
                    break;
                case 3:
                    setError("The request to get your location timed out. Please check your internet connection.");
                    break;
                default:
                    setError("An error occurred while trying to retrieve your location.");
            }
        } else {
            setError(err.response?.data?.message || "Failed to update driver location.");
        }

        setSuccess(null);
        setLoading(false);
    }


    return () => {
        if (locationWatchId.current) {
            navigator.geolocation.clearWatch(locationWatchId.current);
            console.log("Location tracking manually stopped");
        }
    };
};



export { MakeDriverAvailable, MakeDriverUnavailable, UpdateDriverLocation };
