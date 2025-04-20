import React from 'react';

function EarningsOverview() {
    // Placeholder values
    const totalEarnings = 25430.75;
    const totalOrders = 324;
    const pendingPayouts = 4700.50;

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Earnings Summary</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-600">Total Earnings</h3>
                    <p className="text-3xl font-bold text-green-600 mt-2">LKR {totalEarnings.toLocaleString()}</p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-600">Total Orders</h3>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{totalOrders}</p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-600">Pending Payouts</h3>
                    <p className="text-3xl font-bold text-orange-500 mt-2">LKR {pendingPayouts.toLocaleString()}</p>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Monthly Overview (Coming Soon)</h3>
                <div className="text-sm text-gray-400">Charts and analytics will appear here.</div>
            </div>
        </div>
    );
}

export default EarningsOverview;
