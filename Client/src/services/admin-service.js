import { AdminHTTP,CustomerHTTP,HTTP } from "./httpCommon-service";


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
  getAllCustomers(){
    return AdminHTTP.get("admin/customers");
  }
  getAllDrivers(){
    return AdminHTTP.get("admin/drivers");
  }
  getAllNotifications(){
    return AdminHTTP.get("/admin/notifications");
  }
  updateAdmin(id,formData){
    return AdminHTTP.put(`/admin/${id}`,formData)

  }
  deteleCustomer(id){
    return CustomerHTTP.delete(`/customers/delete/${id}`)
  }
  deleteRestaurantOwner(id){
    return HTTP.delete(`/restaurant-owners/delete/${id}`)

  }
  deleteOffer(id){
    return AdminHTTP.delete(`/system-offers/${id}`)
  }
 
  
}

export default new AdminService();
