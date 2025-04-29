// components/Promotions.jsx
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

const Promotions = ({ promos }) => {

  const fallbackColors = [
    "bg-pink-200",
    "bg-green-100",
    "bg-blue-100",
    "bg-yellow-100",
    "bg-purple-100",
  ];
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="relative my-8 text-[#03081F]">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar text-[#03081F]"
      >
        {promos.map((promo, index) => (
          <div
            key={index}
            className={`${promo.color || fallbackColors[index % fallbackColors.length]} p-6 rounded-lg min-w-64 flex flex-col justify-between`}
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
              <div className="bg-[#FC8A06]  text-white rounded px-5 py-2 self-start text-md">
                Use {promo.code.includes("CB") ? "Promo " : ""}Code: {promo.code}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Left Button */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-1"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Right Button */}
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-1"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};
export default Promotions;
