import { HTTP } from "./httpCommon-service";


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
    return HTTP.post("/restaurant-owners/login",formData)
  }
  getMenus(restaurant_id){
    console.log("service calleddd")
    return HTTP.get(`menu/${restaurant_id}`);
  }

  AddMenu(formData){
    
    return HTTP.post("menu/create",formData,
      {
        headers:{
          "Content-Type": "multipart/form-data",
        }
      }
    )
  }
  AddMenuItems(formData){
    console.log("create called");
    return HTTP.post("menu-item/create",formData)
  }
  
}

export default new RestaurantService();
