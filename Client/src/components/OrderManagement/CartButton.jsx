// components/OrderManagement/CartButton.jsx
import { ShoppingBag } from "lucide-react";

function CartButton({ itemCount, onClick }) {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={onClick}
        className="bg-[#FC8A06] text-white p-4 rounded-full shadow-lg flex items-center justify-center"
      >
        <ShoppingBag size={24} />
        <span className="bg-white text-[#FC8A06] rounded-full w-6 h-6 flex items-center justify-center font-bold absolute -top-2 -right-2">
          {itemCount}
        </span>
      </button>
    </div>
  );
}

export default CartButton;