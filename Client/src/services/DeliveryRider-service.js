import { DeliveryRiderHTTP } from "./httpCommon-service";



class DeliveryRiderService {


    RegisterDeliveryRider(data) {
        return DeliveryRiderHTTP.post("/auth/DriverRegister", data, {

            headers: {
                "Content-Type": "application/json",
            }
        });
    }

    ChooseVehicleType(data) {
        return DeliveryRiderHTTP.put("/vehicle/VehicleTypeRegister", data, {
            headers: {
                "Content-Type": "application/json",
            }
        });
    }
    RegisterVehicleDetails(data) {
        return DeliveryRiderHTTP.put("/vehicle/VehicleDetailsSignUp", data, {
            headers: {
                "Content-Type": "Multipart/form-data",
            }
        });
    }


}


export default new DeliveryRiderService();
