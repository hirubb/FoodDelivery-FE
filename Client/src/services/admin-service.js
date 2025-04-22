import { AdminHTTP } from "./httpCommon-service";


class AdminService {
  
  registerAdmin(data) {
    return AdminHTTP.post("/admin/register", data,
    {
      headers:{
        "Content-Type": "multipart/form-data",
      }
    }
    );
  }

  getAdminProfile(){
    return AdminHTTP.get("/admin/my-details");
  }
  getRestaurantOwners(){
    return AdminHTTP.get("/admin/restaurant-owners");
  }
  getSystemOffers(){
    return AdminHTTP.get("/system-offers");
  }
  createSystemOffer(data){
    return AdminHTTP.post("/system-offers",data)
  }
  getAllRestaurants(searchTerm = "") {
    return AdminHTTP.get("/admin/restaurants/", {
      params: {
        searchTerm
      }
    });
  }
  approveRestaurant(id){
    return AdminHTTP.get(`admin/restaurants/${id}/approve`,)
  }
 
  
}

export default new AdminService();
