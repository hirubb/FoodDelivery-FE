import { FaFacebookF, FaInstagram, FaTiktok, FaSnapchatGhost } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-[#D9D9D9] text-black">
            <div className="container mx-auto px-6 py-14 flex flex-wrap justify-between items-center">
                {/* Left Section - Logo + Company Text */}


                <div className="w-full md:w-1/3 flex flex-col items-center md:items-start mb-6 md:mb-0 text-center md:text-left  ">
                    <h1 className="flex flex-col items-center md:items-start">
                        <img src="/src/assets/logo-color.png" alt="Company Logo" className="w-28 md:w-32 h-auto mb-2 mx-auto" />
                        <p className="text-sm font-semibold text-center ">
                            Company # 490039-445, Registered with
                            <p>
                                House of Companies.
                            </p>
                        </p>
                    </h1>
                </div>

                {/* Middle Section - Subscription */}
                <div className="w-full md:w-1/3 flex flex-col    md:mb-0">
                    <h2 className="font-semibold text-2xl mb-2">Get Exclusive Deals in Your Inbox</h2>
                    <div className="flex items-center bg-white rounded-full shadow-md overflow-hidden w-full max-w-sm mt-3">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="px-4 py-2 w-full text-gray-700 focus:outline-none"
                        />
                        <button className="bg-orange-500 text-white px-6 py-2 rounded-full">
                            Subscribe
                        </button>
                    </div>
                    <p className="text-gray-600 text-xs mt-2 font-semibold  ml-[14%] ">
                        We won’t spam, read our <a href="#" className="text-blue-600 underline">email policy</a>.
                    </p>
                    {/* Social Media Icons */}
                    <div className="flex   gap-6 mt-5 text-2xl text-gray-800  ml-[14%]">
                        <a href="#"><FaFacebookF className="hover:text-blue-600 transition-all" /></a>
                        <a href="#"><FaInstagram className="hover:text-pink-600 transition-all" /></a>
                        <a href="#"><FaTiktok className="hover:text-black transition-all" /></a>
                        <a href="#"><FaSnapchatGhost className="hover:text-yellow-500 transition-all" /></a>
                    </div>
                </div>

                {/* Right Section - Legal & Important Links */}
                <div className="w-full md:w-1/6 flex flex-col items-center md:items-start text-center md:text-left   md:mb-0">
                    <h2 className="font-bold mb-3 text-xl">Legal Pages</h2>
                    <ul className="text-sm text-gray-700 font-semibold space-y-4 underline">
                        <li><a href="#" className="hover:underline">Terms and Conditions</a></li>
                        <li><a href="#" className="hover:underline">Privacy</a></li>
                        <li><a href="#" className="hover:underline">Cookies</a></li>
                        <li><a href="#" className="hover:underline">Modern Slavery Statement</a></li>
                    </ul>
                </div>

                <div className="w-full md:w-1/6 flex flex-col items-center md:items-start text-center md:text-left">
                    <h2 className="font-bold mb-3 text-xl">Important Links</h2>
                    <ul className="text-sm text-gray-700 font-semibold space-y-4 underline">
                        <li><a href="#" className="hover:underline">Get help</a></li>
                        <li><a href="#" className="hover:underline">Add your restaurant</a></li>
                        <li><a href="#" className="hover:underline">Sign up to deliver</a></li>
                        <li><a href="#" className="hover:underline">Create a business account</a></li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-gray-900 text-white text-center py-6 text-sm flex gap-10 items-center justify-between px-[10%] ">
                <p className="font-semibold">AMBULA.LK © 2025, All Rights Reserved.</p>
                <div className=" flex justify-center gap-14 text-sm ">
                    <a href="#" className="hover:underline">About Us</a>
                    <a href="#" className="hover:underline">Privacy Policy</a>
                    <a href="#" className="hover:underline">Terms</a>
                    <a href="#" className="hover:underline">Pricing</a>
                    <a href="#" className="hover:underline">Do not sell or share my personal information</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
