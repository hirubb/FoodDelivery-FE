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
 
  
}

export default new AdminService();
