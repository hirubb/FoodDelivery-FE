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
 
  
}

export default new AdminService();
