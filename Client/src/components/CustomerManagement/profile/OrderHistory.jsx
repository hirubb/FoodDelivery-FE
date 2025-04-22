import React from "react";
import { FaHistory } from "react-icons/fa";

function OrderHistory() {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Order History</h2>
      
      <div className="mb-6 overflow-hidden border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Order ID</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Restaurant</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">#AMB23956</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">Royal Thai Restaurant</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">April 21, 2025</div>
              </td>
              <td className="px-6 py-4 text-right whitespace-nowrap">
                <span className="inline-flex px-2 text-xs font-semibold leading-5 text-yellow-800 bg-yellow-100 rounded-full">
                  In Progress
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-right text-gray-900 whitespace-nowrap">Rs. 1,350.00</td>
              <td className="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                <button className="text-blue-500 hover:text-blue-700">Track</button>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">#AMB23892</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">Spice Garden</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">April 19, 2025</div>
              </td>
              <td className="px-6 py-4 text-right whitespace-nowrap">
                <span className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                  Delivered
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-right text-gray-900 whitespace-nowrap">Rs. 1,200.00</td>
              <td className="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                <button className="text-blue-500 hover:text-blue-700">Details</button>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">#AMB23785</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">Pizza Corner</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">April 16, 2025</div>
              </td>
              <td className="px-6 py-4 text-right whitespace-nowrap">
                <span className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                  Delivered
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-right text-gray-900 whitespace-nowrap">Rs. 950.00</td>
              <td className="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">
                <button className="text-blue-500 hover:text-blue-700">Details</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderHistory;