import React, { useState, useEffect, useRef } from 'react';
import {
    FaWallet,
    FaCheckCircle,
    FaTimes,
    FaClock,
    FaInfoCircle,
    FaBell,
    FaArrowRight,
    FaChevronDown,
    FaChevronUp
} from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

import { MakeDriverAvailable, UpdateDriverLocation } from '../DeliveryServices/DeliveryAvailabilty';
import DeliveryRiderService from '../../../services/DeliveryRider-service';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function StatCard({ title, value, change, isNegative, isPositive, icon }) {
    return (
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex justify-between">
                <div>
                    <p className="text-xs text-gray-500 font-medium">{title}</p>
                    <p className="text-xl font-bold mt-1">{value}</p>
                    <div
                        className={`inline-flex items-center text-xs mt-1 ${isNegative
                            ? 'text-red-500'
                            : isPositive
                                ? 'text-green-500'
                                : 'text-green-500'
                            }`}
                    >
                        <span>{change}</span>
                    </div>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg">{icon}</div>
            </div>
        </div>
    );
}

function EarningsTrendChart({ data }) {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    boxWidth: 12,
                    padding: 10,
                    font: { size: 11 }
                }
            },
            title: { display: false },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) label += ': ';
                        if (context.parsed.y !== null) {
                            if (context.dataset.label === 'Earnings') {
                                label += `$${context.parsed.y}`;
                            } else if (context.dataset.label === 'Avg. Time') {
                                label += `${context.parsed.y} min`;
                            } else {
                                label += context.parsed.y;
                            }
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: { beginAtZero: true, ticks: { font: { size: 10 } } },
            x: { ticks: { font: { size: 10 } } }
        }
    };

    return (
        <div className="h-[280px]">
            <Bar data={data} options={options} />
        </div>
    );
}

function DashboardContent() {
    // Moved all state declarations inside the component
    const [editMode, setEditMode] = useState(false);
    const [profileImg, setProfileImg] = useState('https://randomuser.me/api/portraits/men/32.jpg');
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        firstName: 'John',
        lastName: 'Driver',
        age: 30,
        gender: "Male",
        mobile: '(555) 123-4567',
        email: 'john.driver@example.com',
        password: 'password123',
        isVerified: true,
        profileImage: ''
    });

    const [timePeriod, setTimePeriod] = useState('week');
    const [showNotification, setShowNotification] = useState(true);
    const [expandChart, setExpandChart] = useState(false);
    const [success, setSuccess] = useState(null);

    const chartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Earnings',
                data: [65, 78, 86, 61, 98, 87, 92],
                backgroundColor: 'rgba(255, 138, 0, 0.6)',
                borderColor: 'rgb(255, 138, 0)',
                borderWidth: 1,
                borderRadius: 5,
            },
            {
                label: 'Completed',
                data: [9, 12, 14, 8, 16, 13, 15],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 1,
                borderRadius: 5,
            },
            {
                label: 'Cancelled',
                data: [2, 1, 0, 3, 1, 2, 1],
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 1,
                borderRadius: 5,
            },
            {
                label: 'Avg. Time',
                data: [32, 29, 28, 35, 25, 27, 24],
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgb(54, 162, 235)',
                borderWidth: 1,
                borderRadius: 5,
            }
        ],
    };

    useEffect(() => {
        const callDriverFunctions = async () => {
            await MakeDriverAvailable(setLoading, setSuccess, setError);
            await UpdateDriverLocation(setLoading, setSuccess, setError);
        };

        callDriverFunctions();
    }, []);  // Empty array ensures this runs once when the component mounts.

    // =================== Fetch driver details ===================
    useEffect(() => {
        const fetchDriverDetails = async () => {
            setLoading(true);
            try {
                const response = await DeliveryRiderService.GetDriverDetails();
                console.log("Driver details fetched:", response.data);
                setFormData({
                    ...formData,
                    firstName: response.data.driver.firstName,
                    lastName: response.data.driver.lastName,
                    age: response.data.driver.age,
                    gender: response.data.driver.gender,
                    mobile: response.data.driver.mobile,
                    email: response.data.driver.email,
                    password: response.data.driver.password,
                    profileImage: response.data.driver.profileImage,
                });
            } catch (err) {
                console.error("Error fetching driver details:", err);
                setError(err.response?.data?.message || "Failed to load driver details.");
            } finally {
                setLoading(false);
            }
        };

        fetchDriverDetails();
    }, []);  // Consider adding formData to the dependency array if needed



    return (
        <div className="h-full overflow-hidden">
            <div className="h-full flex flex-col">
                <div className="flex-1 flex flex-col gap-4 p-4">
                    <div className="bg-gradient-to-r from-[#0C1A39] to-[#235789] text-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-4 flex justify-between items-start">
                            <div>
                                <h2 className="text-lg font-bold">Welcome back, {formData.firstName}!</h2>
                                <p className="mt-1 text-sm text-gray-200">8 active orders in your area</p>
                            </div>
                            <div className="relative">
                                <div className="bg-orange-500 h-2 w-2 rounded-full absolute -top-1 -right-1"></div>
                                <FaBell className="text-white text-base cursor-pointer hover:text-orange-200 transition-colors" />
                            </div>
                        </div>

                        {showNotification && (
                            <div className="bg-orange-500 bg-opacity-95 px-4 py-3 flex justify-between items-center">
                                <div className="flex items-center">
                                    <FaInfoCircle className="h-4 w-4 text-white mr-2" />
                                    <div>
                                        <h3 className="font-medium text-white text-sm">New Order: $12.45 • 2.3 miles</h3>
                                        <p className="text-orange-100 text-xs">Pizza Palace</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => setShowNotification(false)} className="text-orange-200 hover:text-white">
                                        <FaTimes size={14} />
                                    </button>
                                    <button className="bg-white text-orange-500 px-3 py-1 rounded text-xs font-medium hover:bg-orange-50 transition-colors flex items-center">
                                        View <FaArrowRight className="ml-1" size={10} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <StatCard title="Today's Earnings" value="$86.50" change="+12%" icon={<FaWallet className="h-6 w-6 text-orange-500" />} />
                        <StatCard title="Completed Orders" value="14" change="+5" icon={<FaCheckCircle className="h-6 w-6 text-green-500" />} />
                        <StatCard title="Cancelled" value="2" change="-1" isNegative icon={<FaTimes className="h-6 w-6 text-red-500" />} />
                        <StatCard title="Average Time" value="28 min" change="-3 min" isPositive icon={<FaClock className="h-6 w-6 text-blue-500" />} />
                    </div>

                    <div className="bg-white rounded-lg shadow flex-1 flex flex-col">
                        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                            <div className="flex items-center">
                                <h3 className="font-semibold text-gray-800">Performance Overview</h3>
                                <button onClick={() => setExpandChart(!expandChart)} className="ml-2 text-gray-500 hover:text-gray-700">
                                    {expandChart ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                                </button>
                            </div>
                            <div className="flex bg-gray-100 rounded overflow-hidden text-xs">
                                <button
                                    className={`px-3 py-1 font-medium ${timePeriod === 'week' ? 'bg-[#0C1A39] text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                                    onClick={() => setTimePeriod('week')}
                                >
                                    Week
                                </button>
                                <button
                                    className={`px-3 py-1 font-medium ${timePeriod === 'month' ? 'bg-[#0C1A39] text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                                    onClick={() => setTimePeriod('month')}
                                >
                                    Month
                                </button>
                                <button
                                    className={`px-3 py-1 font-medium ${timePeriod === 'year' ? 'bg-[#0C1A39] text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                                    onClick={() => setTimePeriod('year')}
                                >
                                    Year
                                </button>
                            </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                            <EarningsTrendChart data={chartData} />
                            {!expandChart && (
                                <div className="grid grid-cols-3 gap-4 mt-auto">
                                    {/* Add your quick stats here */}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardContent;
