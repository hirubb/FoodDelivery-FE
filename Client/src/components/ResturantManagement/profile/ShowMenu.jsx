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
        console.log("res id : ", restaurantId);
        const response = await restaurantService.getMenus(restaurantId);
        setMenus(response.data);
        console.log("response : ", response);
      } catch (err) {
        console.error(err);
        setError('Failed to load menus.');
      }
    };

    fetchMenus();
  }, [restaurantId]);

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (menus.length === 0) {
    return <div className="p-4">No menus available for this restaurant.</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Menus</h2>
      {menus.map((menu) => (
        <div key={menu._id} className="mb-6 border rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="text-xl font-semibold">{menu.name}</h3>
              <p className="text-gray-600">{menu.description}</p>
            </div>
            <button
              onClick={() => navigate(`/menu/${menu._id}/edit`)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
            >
              Edit Menu
            </button>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-2">Menu Items</h4>
            {menu.menu_items && menu.menu_items.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {menu.menu_items.map((item, idx) => (
                  <li key={idx}>
                    <span className="font-semibold">{item.name}</span> - Rs.{item.price} <br />
                    <span className="text-sm text-gray-500">{item.description}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No items in this menu.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ShowMenu;
