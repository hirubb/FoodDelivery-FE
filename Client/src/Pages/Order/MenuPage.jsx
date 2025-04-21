import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

function MenuPage() {
  const { id } = useParams(); // restaurant ID
  const [menu, setMenu] = useState([]);
  const { addToCart, setRestaurantId } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/restaurants/${id}/menu`)
      .then(res => {
        setMenu(res.data);
        setRestaurantId(id); // store restaurantId for placing order
      });
  }, [id]);

  const handleAddToCart = (item) => {
    addToCart({ ...item, quantity: 1 });
  };

  return (
    <div>
      <h2>Menu</h2>
      <ul>
        {menu.map(item => (
          <li key={item._id}>
            {item.name} - Rs.{item.price}
            <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate('/cart')}>Go to Cart</button>
    </div>
  );
}

export default MenuPage;
