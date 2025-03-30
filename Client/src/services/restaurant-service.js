import { HTTP } from "./httpCommon-service";


class RestaurantService {
  
  registerRestaurantOwner(data) {
    return HTTP.post("/restaurant-owners/register", data);
  }

  registerRestaurant(data) {
    return HTTP.post("/restaurant/register", data);
  }
}

export default new RestaurantService();
