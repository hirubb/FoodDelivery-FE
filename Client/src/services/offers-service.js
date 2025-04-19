import { HTTP } from "./httpCommon-service";

class OffersService {
  getRestaurantOffers() {
    return HTTP.get("/offers/restaurant");
  }
  createRestaurantOffers(formData){
    return HTTP.post("/offers",
      formData
    )
  }
}

export default new OffersService();
