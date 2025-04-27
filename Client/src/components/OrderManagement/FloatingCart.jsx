// components/OrderManagement/FloatingCart.jsx
import { ShoppingBag, XCircle, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import OrderSummary from "../../components/OrderManagement/OrderSummary";

function FloatingCart({ 
  cart, 
  updateQuantity, 
  removeItem, 
  userLocation, 
  getCurrentLocation,
  placeOrder,
  isPlacingOrder,
  orderError,
  isOpen,
  onClose,
  getImageUrl
}) {
  const navigate = useNavigate();

  // Calculate total amount with delivery fee
  const calculateTotal = () => {
    const itemsTotal = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const deliveryFee = itemsTotal * 0.05; // 5% delivery fee
    return itemsTotal + deliveryFee;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto animate-slide-in-right">
        {/* Cart Header */}
        <div className="sticky top-0 bg-[#FC8A06] text-white p-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold flex items-center">
            <ShoppingBag size={24} className="mr-2" />
            Your Cart
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#E67E22] rounded-full transition-colors"
          >
            <XCircle size={24} />
          </button>
        </div>

        {/* Cart Content */}
        <div className="p-4">
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <button
                onClick={onClose}
                className="text-[#FC8A06] hover:underline"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <>
              {/* Location status */}
              <div
                className={`flex items-center p-3 rounded mb-6 ${
                  userLocation
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                <MapPin size={20} className="mr-2" />
                {userLocation ? (
                  <div>
                    <span className="font-semibold">Delivery location:</span> Location
                    detected for delivery
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <span>No delivery location provided</span>
                    <button
                      onClick={getCurrentLocation}
                      className="text-blue-600 underline text-sm mt-1"
                    >
                      Share your location for delivery
                    </button>
                  </div>
                )}
              </div>

              {/* Order Error if any */}
              {orderError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                  {orderError}
                </div>
              )}

              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 text-black"
                  >
                    {/* Image */}
                    <img
                      src={getImageUrl(item.images?.[0])}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />

                    {/* Item Details */}
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-xs text-gray-600">
                        Portion: {item.portion}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() =>
                            updateQuantity(item._id, Math.max(item.quantity - 1, 0))
                          }
                          className="px-2 py-0.5 bg-gray-200 rounded hover:bg-gray-300 text-black"
                        >
                          -
                        </button>
                        <span className="text-black">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="px-2 py-0.5 bg-gray-200 rounded hover:bg-gray-300 text-black"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Price and Remove */}
                    <div className="text-right">
                      <p className="font-bold text-[#FC8A06]">
                        Rs. {item.price * item.quantity}
                      </p>
                      <button
                        onClick={() => removeItem(item._id)}
                        className="text-red-500 hover:text-red-700 mt-1 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                         <OrderSummary cart={cart} />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={placeOrder}
                  disabled={isPlacingOrder}
                  className={`w-full py-3 ${
                    isPlacingOrder ? "bg-gray-400" : "bg-[#FC8A06] hover:bg-[#E67E22]"
                  } text-white rounded-lg flex items-center justify-center gap-2`}
                >
                  {isPlacingOrder ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={20} />
                      Place Order (Rs. {calculateTotal().toFixed(2)})
                    </>
                  )}
                </button>
                <button
                  onClick={() => navigate("/cart")}
                  className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg"
                >
                  Go to Cart Page
                </button>
                <button
                  onClick={onClose}
                  className="text-[#FC8A06] hover:underline text-center mt-2"
                >
                  Continue Shopping
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default FloatingCart;