import { HTTP, AuthHTTP, CustomerHTTP } from "./httpCommon-service";

class CustomerService {
  // Register a new customer
  registerCustomer(data) {
    // Using JSON instead of FormData since the backend expects JSON
    return CustomerHTTP.post("/customers/register", data, {
      headers: {
        "Content-Type": "application/json",
      }
    });
  }

  // Login customer
  login(formData) {
    return AuthHTTP.post("/login", formData);
  }

  // Get customer profile
  getCustomerProfile() {
    return CustomerHTTP.get("/customers/my-details");
  }

  // Update customer profile
  updateCustomerProfile(data) {
    // Changed to application/json to match how the data is sent in the component
    return CustomerHTTP.put("/customers/update-profile", data, {
      headers: {
        "Content-Type": "application/json",
      }
    });
  }

  // Get order history
  getOrderHistory() {
    return CustomerHTTP.get("/orders/history");
  }

  // Get current order tracking
  trackCurrentOrder() {
    return CustomerHTTP.get("/orders/current");
  }

  // Get favorite restaurants
  getFavoriteRestaurants() {
    return CustomerHTTP.get("/favorites");
  }

  // Get payment methods
  getPaymentMethods() {
    return CustomerHTTP.get("/payment-methods");
  }

  // Get address book
  getAddressBook() {
    return CustomerHTTP.get("/addresses");
  }

  // Get shopping cart
  getShoppingCart() {
    return CustomerHTTP.get("/cart");
  }
}

export default new CustomerService();