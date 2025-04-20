import { HTTP, AuthHTTP, CustomerHTTP } from "./httpCommon-service";

class CustomerService {
  
  // Register a new customer
  registerCustomer(data) {
    return CustomerHTTP.post("/customers/register", data);
  }

  // Login customer (via Auth service)
  login(data) {
    return AuthHTTP.post("/login", data);
  }

  // Get current customer's profile (protected route)
  getCustomerProfile() {
    return CustomerHTTP.get("/customers/my-details");
  }

  // Get all customers (optional/admin view)
  getAllCustomers() {
    return CustomerHTTP.get("/customers");
  }
}

export default new CustomerService();
