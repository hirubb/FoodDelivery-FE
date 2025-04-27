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
  getRestaurantOffersById(restaurantId){
    console.log("restaurantId : ", restaurantId)
    return HTTP.get(`/offers/restaurant/${restaurantId}`);
  }
  updateRestaurantOffer(id,data){
    console.log("here")
    return HTTP.put(`/offers/${id}`,data)

  }
}

export default new OffersService();
