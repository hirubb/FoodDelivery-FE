import { HTTP } from "./httpCommon-service";

class RestaurantService {
  registerRestaurantOwner(data) {
    return HTTP.post("/restaurant-owners/register", data);
  }
}

export default new RestaurantService();
