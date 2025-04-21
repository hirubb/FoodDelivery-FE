import { HTTP, AuthHTTP,AdminHTTP } from "./httpCommon-service";



class RestaurantService {
  
  registerRestaurantOwner(data) {
    return HTTP.post("/restaurant-owners/register", data,
    {
      headers:{
        "Content-Type": "multipart/form-data",
      }
    }
    );
  }

  registerRestaurant(data) {
    return HTTP.post("/restaurant/register", data,
      {
        headers:{
          "Content-Type": "multipart/form-data",
        }
      }
    );
  }
  getRestaurantOwner(){
    return HTTP.get("/restaurant-owners/my-details");
  }
  getMyRestaurants(){
    return HTTP.get("/restaurant/my-restaurants");
  }
  login(formData){
    return AuthHTTP.post("/login",formData)
  }
  getMenus(restaurant_id){
    console.log("service calleddd")
    return HTTP.get(`menu/${restaurant_id}`);
  }
  getAllRestaurants(searchTerm = "", cuisine = "") {
    return HTTP.get("/restaurant/", {
      params: {
        searchTerm,
        cuisine_type: cuisine
      }
    });
  }
  AddMenu(formData){
    
    return HTTP.post("menu/create",formData
    )
  }
  AddMenuItems(formData){
    
    return HTTP.post("menu-item/create",formData,{
      headers:{
        "Content-Type": "multipart/form-data"
      }
    })
  }
  getTopRatedRestaurants(){
    return HTTP.get("/restaurant/top-rated");
  }
  updateRestaurantOwner(id, data){
    console.log("id : ", id)
    return HTTP.put(`/restaurant-owners/edit/${id}`,
      data,
    );

  }
  getRestaurantById(id){
    return HTTP.get(`/restaurant/${id}`);
  }
  getSystemOffers(){
    return AdminHTTP.get("/system-offers");
  }
  


  
}

export default new RestaurantService();
