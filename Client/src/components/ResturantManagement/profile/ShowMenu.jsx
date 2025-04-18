import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import restaurantService from '../../../services/restaurant-service';

function ShowMenu() {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [menus, setMenus] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await restaurantService.getMenus(restaurantId);
        setMenus(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load menus.');
      }
    };

    fetchMenus();
  }, [restaurantId]);

  if (error) {
    return <div className="text-red-600 font-semibold text-center mt-10">{error}</div>;
  }

  if (menus.length === 0) {
    return <div className="text-center text-gray-500 mt-10">No menus available for this restaurant.</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto text-[#03081F]">
      <h2 className="text-3xl font-bold mb-8 text-center">Restaurant Menus</h2>

      {menus.map((menu) => (
        <div key={menu._id} className="mb-8 border border-gray-200 rounded-lg shadow-md p-6 bg-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold">{menu.name}</h3>
              <p className="text-gray-600">{menu.description || "No description provided."}</p>
            </div>
            <button
              onClick={() => navigate(`/menu/${menu._id}/edit`)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow-sm"
            >
              Edit Menu
            </button>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-3 border-b pb-1 text-[#03081F]">Menu Items</h4>
            {menu.menu_items && menu.menu_items.length > 0 ? (
              <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 text-[#03081F]">
                {menu.menu_items.map((item, idx) => (
                  <li key={idx} className="bg-gray-50 rounded-lg p-4 shadow hover:shadow-md transition">
                    <img
                      src={item.images}
                      alt={item.name}
                      className="w-full h-40 object-cover rounded-md mb-3"
                    />
                    <h5 className="font-semibold text-lg">{item.name}</h5>
                    <p className="text-sm text-gray-600 mb-1">{item.description}</p>
                    <p className="text-green-700 font-medium">Rs. {item.price}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">No items in this menu yet.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ShowMenu;
