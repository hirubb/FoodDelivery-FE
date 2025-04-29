import React, { useEffect, useState } from 'react';
import {
    FaUser, FaCar, FaClipboardList, FaMapMarkedAlt, FaBell, FaSignOutAlt,
    FaChartLine, FaWallet
} from 'react-icons/fa';

import DashboardContent from './DashboardContent';
import ProfileContent from './ProfileContent';
import VehicleContent from './VehicleContent';
import OrdersContent from './OrdersContent';
import NavigationContent from './NavigationContent';
import EarningsContent from './EarningsContent';
import Logo from '../../../assets/logo-color.png';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for programmatic navigation
import { MakeDriverUnavailable } from '../DeliveryServices/DeliveryAvailabilty';
import DeliveryRiderService from '../../../services/DeliveryRider-service'; // Added missing import


function DeliveryRiderDashboard() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [navigationData, setNavigationData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate hook

    // Function to handle logout
    const handleLogout = async () => {
        try {

            await MakeDriverUnavailable(setLoading, setSuccess, setError);


            localStorage.removeItem("token");


            navigate("/login");
        } catch (err) {
            setError("An error occurred during logout. Please try again.");
        }
    };


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
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-20 md:w-64 bg-[#0C1A39] text-white flex flex-col">
                <div className="p-4 flex items-center justify-center md:justify-start">
                    <img src={Logo} alt="OrderLk" className="h-12 w-12" />
                    <span className="hidden md:block ml-3 font-bold text-xl">AMBULA.LK</span>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <nav className="mt-8 px-2">
                        <SidebarItem
                            icon={<FaChartLine />}
                            title="Dashboard"
                            active={activeTab === 'dashboard'}
                            onClick={() => setActiveTab('dashboard')}
                        />
                        <SidebarItem
                            icon={<FaUser />}
                            title="My Profile"
                            active={activeTab === 'profile'}
                            onClick={() => setActiveTab('profile')}
                        />
                        <SidebarItem
                            icon={<FaCar />}
                            title="Vehicle Details"
                            active={activeTab === 'vehicle'}
                            onClick={() => setActiveTab('vehicle')}
                        />
                        <SidebarItem
                            icon={<FaClipboardList />}
                            title="Orders"
                            active={activeTab === 'orders'}
                            onClick={() => setActiveTab('orders')}
                        />
                        <SidebarItem
                            icon={<FaMapMarkedAlt />}
                            title="Navigation"
                            active={activeTab === 'navigation'}
                            onClick={() => setActiveTab('navigation')}
                        />
                        <SidebarItem
                            icon={<FaWallet />}
                            title="Earnings"
                            active={activeTab === 'earnings'}
                            onClick={() => setActiveTab('earnings')}
                        />
                    </nav>
                </div>

                {/* Logout button */}
                <div className="p-4">
                    <button
                        className="flex items-center justify-center md:justify-start w-full py-2 text-sm text-white hover:bg-gray-700 rounded transition-colors"
                        onClick={handleLogout}
                    >
                        <FaSignOutAlt className="h-5 w-5" />
                        <span className="hidden md:block ml-3">Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm">
                    <div className="flex items-center justify-between px-4 py-3">
                        <h1 className="text-xl font-semibold text-gray-800">
                            {activeTab === 'dashboard' && 'Dashboard'}
                            {activeTab === 'profile' && 'My Profile'}
                            {activeTab === 'vehicle' && 'Vehicle Details'}
                            {activeTab === 'orders' && 'Orders Management'}
                            {activeTab === 'navigation' && 'Navigation'}
                            {activeTab === 'earnings' && 'Earnings'}
                        </h1>

                        <div className="flex items-center space-x-4">
                            <button className="relative p-1 rounded-full text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                                <FaBell className="h-6 w-6" />
                                <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500"></span>
                            </button>

                            <div className="flex items-center">
                                <img
                                    className="h-9 w-9 rounded-full object-cover border-2 border-orange-500"
                                    src={formData.profileImage || 'https://wallpapers.com/images/hd/contact-profile-icon-orange-background-akpgd1xj0pcgm9n7.jpg'}
                                    alt="Driver"
                                />
                                <div className="hidden md:block ml-3">
                                    <p className="text-sm font-medium text-black">{formData.firstName}   {formData.lastName}</p>
                                    <p className="text-xs text-gray-500">Online</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-4">
                    {activeTab === 'dashboard' && <DashboardContent />}
                    {activeTab === 'profile' && <ProfileContent />}
                    {activeTab === 'vehicle' && <VehicleContent />}
                    {activeTab === 'orders' && <OrdersContent setActiveTab={setActiveTab} setNavigationData={setNavigationData} />}
                    {activeTab === 'navigation' && <NavigationContent orderData={navigationData} />}
                    {activeTab === 'earnings' && <EarningsContent />}
                </main>
            </div>
        </div>
    );
}

// Sidebar Item Component
function SidebarItem({ icon, title, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center justify-center md:justify-start w-full py-3 px-2 mb-2 rounded-lg transition-colors ${active ? 'bg-[#FF8A00] text-white' : 'text-gray-300 hover:bg-gray-700'}`}
        >
            <div className="w-5 h-5">{icon}</div>
            <span className="hidden md:block ml-3">{title}</span>
        </button>
    );
}

export default DeliveryRiderDashboard;
