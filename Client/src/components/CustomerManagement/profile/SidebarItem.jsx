import React from "react";

function SidebarItem({ icon, title, active, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center md:justify-start w-full py-3 px-2 mb-2 rounded-lg transition-colors relative ${
        active ? "bg-[#FF8A00] text-white" : "text-gray-300 hover:bg-gray-700"
      }`}
    >
      <div className="w-5 h-5">{icon}</div>
      <span className="hidden ml-3 md:block">{title}</span>
      {badge && (
        <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full md:relative md:top-auto md:right-auto md:ml-2">
          {badge}
        </span>
      )}
    </button>
  );
}

export default SidebarItem;