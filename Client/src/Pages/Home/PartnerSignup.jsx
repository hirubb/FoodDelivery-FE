import { Link } from "react-router-dom";

const PartnerSignup = () => {
  return (
    <div className="container mx-auto px-6 py-[10%]">
      <div className="flex flex-wrap justify-center gap-8">
        {" "}
        {/* Increased gap for spacing */}
        {/* Partner Card */}
        <div className="w-full md:w-2/3 lg:w-[45%] bg-black rounded-xl overflow-hidden relative group shadow-lg">
          <img
            src="/src/assets/Restuarent.png"
            alt="Partner"
            className="w-full h-80   transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-6 left-6 bg-white text-black font-semibold px-5 py-3 rounded-md shadow-md">
            Earn more with lower fees
          </div>
          <div className="absolute bottom-6 left-6 text-white">
            <p className="text-orange-400 text-lg">Signup as a business</p>
            <h2 className="text-3xl font-bold">Partner with us</h2>

            <Link
              to="/owner-register"
              className="mt-4 bg-orange-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-[#FC8A06] inline-block text-center"
            >
              Get Started
            </Link>
          </div>
        </div>
        {/* Rider Card */}
        <div className="w-full md:w-2/3 lg:w-[48%] bg-black rounded-xl overflow-hidden relative group shadow-lg">
          <img
            src="/src/assets/DeliveryRider.png"
            alt="Rider"
            className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-6 left-6 bg-white text-black font-semibold px-5 py-3 rounded-md shadow-md">
            Avail exclusive perks
          </div>
          <div className="absolute bottom-6 left-6 text-white">
            <p className="text-orange-400 text-lg">Signup as a rider</p>
            <h2 className="text-3xl font-bold">Ride with us</h2>
            <button className="mt-4 bg-orange-500 text-white px-6 py-3 rounded-lg text-lg">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerSignup;
