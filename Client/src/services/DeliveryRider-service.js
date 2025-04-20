import { HTTP } from "./httpCommon-service";

class DeliveryRiderService {

    // Register Delivery Rider
    RegisterDeliveryRider(data) {
        return HTTP.post("/api/auth/register", data, {
            headers: {
                "Content-Type": "multipart/form-data",  // Change this if not sending files
            }
        });
    }

    // Login Delivery Rider
    LoginDeliveryRider(data) {
        return HTTP.post("/api/auth/login", data, {
            headers: {
                "Content-Type": "multipart/form-data",  // Change this if not sending files
            }
        });
    }

    // Login Delivery Rider
    ChooseVehicle(data) {
        return HTTP.post("/api/auth/login", data, {
            headers: {
                "Content-Type": "multipart/form-data",  // Change this if not sending files
            }
        });
    }




}

// Export an instance of the service to be used elsewhere
export default new DeliveryRiderService();
