import { HTTP, AuthHTTP, CustomerHTTP } from "./httpCommon-service";

class CustomerService {
  // Register a new customer
  registerCustomer(data) {
    return HTTP.post("/customers/register", data, 
      {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      }
    );
  }

  // Login customer
  login(formData) {
    return AuthHTTP.post("/login", formData);
  }

  // Get customer profile
  getCustomerProfile() {
    return HTTP.get("/customers/my-details");
  }

  // Update customer profile
  updateCustomerProfile(data) {
    return HTTP.put("/customers/update-profile", data, 
      {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      }
    );
  }
}

export default new CustomerService();
