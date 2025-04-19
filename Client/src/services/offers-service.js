import { HTTP } from "./httpCommon-service";

class OffersService {
  getRestaurantOffers() {
    return HTTP.get("/offers/restaurant");
  }
}

export default new OffersService();
