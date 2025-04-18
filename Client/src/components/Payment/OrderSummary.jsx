import React from 'react';

export default function OrderSummary({ data }) {
  if (!data) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-800">Order Summary</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Order ID:</span>
          <span className="font-medium">{data.orderId}</span>
        </div>
        
        {data.items && data.items.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Items:</p>
            {data.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>
                  {item.quantity} x {item.name}
                </span>
                <span className="font-medium">LKR {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
        
        <div className="pt-2 mt-2 space-y-2 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">LKR {data.subtotal.toFixed(2)}</span>
          </div>
          
          {data.tax !== undefined && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax:</span>
              <span className="font-medium">LKR {data.tax.toFixed(2)}</span>
            </div>
          )}
          
          {data.deliveryFee !== undefined && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery Fee:</span>
              <span className="font-medium">LKR {data.deliveryFee.toFixed(2)}</span>
            </div>
          )}
          
          {data.discount !== undefined && data.discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Discount:</span>
              <span className="font-medium text-green-600">- LKR {data.discount.toFixed(2)}</span>
            </div>
          )}
        </div>
        
        <div className="pt-2 mt-2 border-t border-gray-200">
          <div className="flex justify-between font-medium">
            <span className="text-gray-800">Total:</span>
            <span className="text-blue-600">LKR {data.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {data.restaurant && (
        <div className="pt-2 mt-2 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Restaurant: {data.restaurant.name}
          </p>
          {data.restaurant.address && (
            <p className="text-sm text-gray-600">
              {data.restaurant.address}
            </p>
          )}
        </div>
      )}
      
      {data.deliveryAddress && (
        <div className="pt-2 mt-2 border-t border-gray-200">
          <p className="text-sm font-medium">Delivery Address:</p>
          <p className="text-sm text-gray-600">
            {data.deliveryAddress}
          </p>
        </div>
      )}
    </div>
  );
}