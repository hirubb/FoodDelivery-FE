import { orderHTTP } from "./httpCommon-service";


class orderService {
  placeOrder(orderData) {
    return orderHTTP.post("/orders", orderData);
  }

}
export default new orderService();


