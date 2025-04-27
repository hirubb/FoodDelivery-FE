import { HTTP, AuthHTTP,AdminHTTP ,orderHTTP} from "./httpCommon-service";

;

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
  editRestaurant(formdata,restaurant_id){
    return HTTP.put(`/restaurant/${restaurant_id}`,formdata,
      {
        headers:{
          "Content-Type": "multipart/form-data",
        }
      }
    )
  }
  getMyRestaurantOrders(restaurantId){
    return HTTP.get(`/restaurant/get-orders/${restaurantId}`);
  }

  
  getOrders(restaurantId){
    return orderHTTP.get(`/orders/restaurantOrders/${restaurantId}`)
  }

  updateRestaurant(restaurantId, formdata){
    
    return HTTP.put(`/restaurant/edit/${restaurantId}`,formdata)
  }
  updateMenu(menuId,formdata){
    
   
    return HTTP.put(`/menu/${menuId}`,formdata)
  }
  updateMenuItem(itemId,formdata){
    return HTTP.put(`/menu-item/${itemId}`,formdata)
  }

  getIncome(restaurantId,formdata){
    return orderHTTP.post(`/orders/getIncome/${restaurantId}`,
      formdata
    )
  }

  updateOrderStatus(orderId, status) {
    console.log("status : ", orderId, status);
    return orderHTTP.put(
      `/orders/status/update/${orderId}`,
      { newStatus: status }, // This is the data/body parameter in axios
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
  submitRating(id, userRating) {
    return HTTP.post(`/restaurant/${id}/rate`, { rating: userRating });
  }
  updateAvailability(restaurantId, updatedAvailability){
    console.log("here : ")
    return HTTP.patch(`/restaurant/availability/${restaurantId}`,

      {availability:updatedAvailability}
      
      )
  }

  
  
}

export default new RestaurantService();
