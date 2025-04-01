import { HTTP } from "./httpCommon-service";


class RestaurantService {
  
  registerRestaurantOwner(data) {
    return HTTP.post("/restaurant-owners/register", data);
  }

  registerRestaurant(data) {
    return HTTP.post("/restaurant/register", data);
  }
  getRestaurantOwner(){
    return HTTP.get("/restaurant-owners/my-details");
  }
}

export default new RestaurantService();
