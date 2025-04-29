import React, { useState } from 'react';
import { FaCalendar, FaDownload, FaCreditCard, FaChevronRight, FaChevronDown } from 'react-icons/fa';

function EarningsContent() {
    const [activeTimeframe, setActiveTimeframe] = useState('week');
    const [showPaymentDetails, setShowPaymentDetails] = useState(false);

    // Sample earnings data
    const earningsData = {
        week: {
            total: 432.75,
            orders: 38,
            tips: 87.50,
            bonuses: 45.00,
            hours: 24,
            averagePerOrder: 11.39,
            averagePerHour: 18.03
        },
        month: {
            total: 1745.60,
            orders: 152,
            tips: 348.20,
            bonuses: 120.00,
            hours: 96,
            averagePerOrder: 11.48,
            averagePerHour: 18.18
        },
        year: {
            total: 18750.25,
            orders: 1680,
            tips: 3750.05,
            bonuses: 1200.00,
            hours: 1040,
            averagePerOrder: 11.16,
            averagePerHour: 18.03
        }
    };

    // Recent payments data
    const recentPayments = [
        { id: 'PAY-20250415', date: 'Apr 15, 2025', amount: 432.75, status: 'completed' },
        { id: 'PAY-20250408', date: 'Apr 08, 2025', amount: 387.50, status: 'completed' },
        { id: 'PAY-20250401', date: 'Apr 01, 2025', amount: 412.60, status: 'completed' },
        { id: 'PAY-20250325', date: 'Mar 25, 2025', amount: 398.25, status: 'completed' },
        { id: 'PAY-20250318', date: 'Mar 18, 2025', amount: 407.80, status: 'completed' }
    ];

    const currentEarnings = earningsData[activeTimeframe];

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Earnings Summary Card */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="bg-gradient-to-r from-[#0C1A39] to-[#1D2D50] p-6 text-white">
                    <div className="flex flex-wrap items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold mb-1">Total Earnings</h2>
                            <div className="flex items-baseline">
                                <span className="text-4xl font-bold">${currentEarnings.total.toFixed(2)}</span>
                                <span className="ml-2 text-sm opacity-80">
                                    {activeTimeframe === 'week' ? 'This Week' :
                                        activeTimeframe === 'month' ? 'This Month' : 'This Year'}
                                </span>
                            </div>
                        </div>

                        {/* Timeframe Selector */}
                        <div className="flex bg-black bg-opacity-25 rounded-lg p-1 mt-2 sm:mt-0">
                            <button
                                className={`px-3 py-1 rounded-lg text-sm ${activeTimeframe === 'week' ? 'bg-[#FF8A00] text-white' : 'text-gray-300'
                                    }`}
                                onClick={() => setActiveTimeframe('week')}
                            >
                                Week
                            </button>
                            <button
                                className={`px-3 py-1 rounded-lg text-sm ${activeTimeframe === 'month' ? 'bg-[#FF8A00] text-white' : 'text-gray-300'
                                    }`}
                                onClick={() => setActiveTimeframe('month')}
                            >
                                Month
                            </button>
                            <button
                                className={`px-3 py-1 rounded-lg text-sm ${activeTimeframe === 'year' ? 'bg-[#FF8A00] text-white' : 'text-gray-300'
                                    }`}
                                onClick={() => setActiveTimeframe('year')}
                            >
                                Year
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {/* Earnings Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-gray-500 uppercase">Earnings Breakdown</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Base Pay</span>
                                    <span className="font-medium">${(currentEarnings.total - currentEarnings.tips - currentEarnings.bonuses).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tips</span>
                                    <span className="font-medium">${currentEarnings.tips.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Bonuses</span>
                                    <span className="font-medium">${currentEarnings.bonuses.toFixed(2)}</span>
                                </div>
                                <div className="pt-2 border-t border-gray-200 flex justify-between">
                                    <span className="font-medium">Total</span>
                                    <span className="font-bold">${currentEarnings.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-gray-500 uppercase">Performance</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Orders Completed</span>
                                    <span className="font-medium">{currentEarnings.orders}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Hours Active</span>
                                    <span className="font-medium">{currentEarnings.hours} hrs</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Average Per Order</span>
                                    <span className="font-medium">${currentEarnings.averagePerOrder.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Average Per Hour</span>
                                    <span className="font-medium">${currentEarnings.averagePerHour.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-gray-500 uppercase">Actions</h3>
                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-between bg-gray-100 hover:bg-gray-200 transition-colors p-3 rounded-lg text-left">
                                    <div className="flex items-center">
                                        <FaCalendar className="text-gray-500 mr-3" />
                                        <span className="font-medium">View Earnings Calendar</span>
                                    </div>
                                    <FaChevronRight className="text-gray-400" />
                                </button>

                                <button className="w-full flex items-center justify-between bg-gray-100 hover:bg-gray-200 transition-colors p-3 rounded-lg text-left">
                                    <div className="flex items-center">
                                        <FaDownload className="text-gray-500 mr-3" />
                                        <span className="font-medium">Download Statement</span>
                                    </div>
                                    <FaChevronRight className="text-gray-400" />
                                </button>

                                <button
                                    className="w-full flex items-center justify-between bg-gray-100 hover:bg-gray-200 transition-colors p-3 rounded-lg text-left"
                                    onClick={() => setShowPaymentDetails(!showPaymentDetails)}
                                >
                                    <div className="flex items-center">
                                        <FaCreditCard className="text-gray-500 mr-3" />
                                        <span className="font-medium">Payment Methods</span>
                                    </div>
                                    {showPaymentDetails ? <FaChevronDown className="text-gray-400" /> : <FaChevronRight className="text-gray-400" />}
                                </button>

                                {showPaymentDetails && (
                                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mt-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center">
                                                <div className="h-8 w-12 bg-blue-600 rounded mr-3 flex items-center justify-center text-white text-xs font-bold">VISA</div>
                                                <div>
                                                    <p className="font-medium">Visa ending in 4382</p>
                                                    <p className="text-xs text-gray-500">Default payment method</p>
                                                </div>
                                            </div>
                                            <button className="text-[#FF8A00] text-sm hover:underline">Edit</button>
                                        </div>
                                        <button className="text-[#FF8A00] text-sm hover:underline">+ Add new payment method</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Payments */}
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">Recent Payments</h2>
                    <button className="text-sm text-[#FF8A00] hover:underline">View All</button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recentPayments.map(payment => (
                                <tr key={payment.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payment.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">${payment.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                        <button className="text-[#FF8A00] hover:text-[#FF9D2F]">Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Earnings Trends */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Earnings Trends</h2>

                <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                    {/* This would be replaced by an actual chart component */}
                    <p className="text-gray-500">Earnings chart would be displayed here</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="bg-[#0C1A39] text-white rounded-lg p-4">
                        <h3 className="text-sm font-medium uppercase opacity-75">Best Day</h3>
                        <p className="text-xl font-bold mt-1">Wednesday</p>
                        <p className="text-sm mt-1">Average: $112.30</p>
                    </div>

                    <div className="bg-[#FF8A00] text-white rounded-lg p-4">
                        <h3 className="text-sm font-medium uppercase opacity-75">Best Time</h3>
                        <p className="text-xl font-bold mt-1">6:00 PM - 8:00 PM</p>
                        <p className="text-sm mt-1">Average: $24.75/hr</p>
                    </div>

                    <div className="bg-gray-700 text-white rounded-lg p-4">
                        <h3 className="text-sm font-medium uppercase opacity-75">Highest Tip</h3>
                        <p className="text-xl font-bold mt-1">$28.50</p>
                        <p className="text-sm mt-1">Apr 12, 2025</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EarningsContent;
