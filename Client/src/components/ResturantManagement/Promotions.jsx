// components/Promotions.jsx
import { ChevronLeft, ChevronRight } from "lucide-react";

const Promotions = ({ promos }) => {
  return (
    <div className="relative my-6 text-[#03081F]">
      <div className="flex gap-4 overflow-x-auto text-[#03081F]">
        {promos.map((promo, index) => (
          <div
            key={index}
            className={`${promo.color} p-6 rounded-lg min-w-64 flex flex-col justify-between`}
          >
            <div>
              <h3 className="font-bold text-lg mb-1">{promo.title}</h3>
              {promo.description && (
                <p className="text-sm mb-4">{promo.description}</p>
              )}
            </div>
            {promo.button && (
              <button className="bg-black text-white rounded px-4 py-2 w-24">
                {promo.button}
              </button>
            )}
            {promo.code && (
              <div className="bg-white rounded px-3 py-2 self-start text-sm">
                Use {promo.code.includes("CB") ? "Promo " : ""}Code: {promo.code}
              </div>
            )}
          </div>
        ))}
      </div>

      <button className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-1">
        <ChevronLeft size={20} />
      </button>

      <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-1">
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default Promotions;
