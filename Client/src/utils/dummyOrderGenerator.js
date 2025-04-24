// utils/dummyOrderGenerator.js

/**
 * Generate a random dummy order for testing PayHere integration
 * @returns {Object} A dummy order object
 */
export const generateDummyOrder = () => {
    // Generate a random order ID
    const orderId = `TEST-${Math.floor(Math.random() * 10000)}`;
    
    // List of sample food items
    const foodItems = [
      { name: "Chicken Burger", price: 650.00 },
      { name: "Fried Chicken", price: 950.00 },
      { name: "Beef Burger", price: 750.00 },
      { name: "Vegetable Burger", price: 550.00 },
      { name: "French Fries", price: 350.00 },
      { name: "Onion Rings", price: 400.00 },
      { name: "Coke", price: 250.00 },
      { name: "Sprite", price: 250.00 },
      { name: "Water", price: 150.00 }
    ];
    
    // Randomly select 2-4 items
    const numberOfItems = Math.floor(Math.random() * 3) + 2;
    const selectedItems = [];
    let totalAmount = 0;
    
    for (let i = 0; i < numberOfItems; i++) {
      const randomIndex = Math.floor(Math.random() * foodItems.length);
      const item = foodItems[randomIndex];
      const quantity = Math.floor(Math.random() * 2) + 1; // 1 or 2 items
      
      selectedItems.push({
        name: item.name,
        price: item.price,
        quantity: quantity
      });
      
      totalAmount += item.price * quantity;
    }
    
    return {
      orderId: orderId,
      customerId: "645f340926f4bd4eff1e7111", // Replace with actual customer ID if needed
      restaurantId: "645f340926f4bd4eff1e7222", // Replace with actual restaurant ID if needed
      totalAmount: totalAmount,
      items: selectedItems,
      orderDate: new Date().toISOString(),
      status: "pending"
    };
  };
  
  /**
   * Get sample user data
   * @returns {Object} Sample user data
   */
  export const getSampleUserData = () => {
    return {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "0771234567",
      address: "123 Main Street",
      city: "Colombo",
      country: "Sri Lanka",
      postalCode: "10100"
    };
  };
  
  /**
   * Store dummy order in localStorage
   * @param {Object} order The order to store
   */
  export const storeDummyOrder = (order) => {
    localStorage.setItem('orderData', JSON.stringify(order));
  };
  
  /**
   * Store sample user data in localStorage
   * @param {Object} userData The user data to store
   */
  export const storeSampleUserData = (userData = null) => {
    const data = userData || getSampleUserData();
    localStorage.setItem('userData', JSON.stringify(data));
  };
  
  /**
   * Generate and store a dummy order
   * @returns {Object} The generated order
   */
  export const setupDummyOrder = () => {
    const order = generateDummyOrder();
    storeDummyOrder(order);
    storeSampleUserData();
    return order;
  };