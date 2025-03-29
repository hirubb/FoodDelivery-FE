import { HTTP } from "./httpCommon-service";

class RestaurantOwnerService {
  registerRestaurantOwner(data) {
    return HTTP.post("/restaurant-owners/register", data);
  }
}

export default new RestaurantOwnerService();
