import React, { useState, useEffect } from "react";
import restaurantService from "../../../services/restaurant-service";

function CreateMenuItemsForm({ restaurantId }) {
  const [menus, setMenus] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState("");
  const [items, setItems] = useState([
    {
      name: "",
      description: "",
      portion: "",
      price: "",
      category: "",
      image: null,
      available: true,
    },
  ]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!restaurantId) return;

    const fetchMenus = async () => {
      try {
        const response = await restaurantService.getMenus(restaurantId);
        setMenus(response.data);
        console.log("menues : ", response.data);
        if (response.data.length > 0) {
          setSelectedMenu(response.data[0]._id);
        }
      } catch (error) {
        console.error("Error fetching menus:", error);
      }
    };

    fetchMenus();
  }, [restaurantId]);

  const handleItemChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const newItems = [...items];
    newItems[index][name] = type === "checkbox" ? checked : value;
    setItems(newItems);
  };

  const handleFileChange = (index, e) => {
    const newItems = [...items];
    newItems[index].image = Array.from(e.target.files); // Store as array
    setItems(newItems);
  };
  

  const addItemRow = () => {
    setItems([
      ...items,
      { name: "",
        description: "",
        portion: "",
        price: "",
        category: "",
        image: null,
        available: true, },
    ]);
  };

  const removeItemRow = (index) => {
    if (items.length === 1) return;
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const requests = items.map(async (item) => {
        const form = new FormData();
        if (Array.isArray(item.image)) {
          item.image.forEach((file) => form.append("images", file));
        }
        
        form.append("menu_id", selectedMenu);
        form.append("name", item.name);
        form.append("description", item.description);
        form.append("portion", item.portion);
        form.append("price", item.price);
        form.append("category", item.category);
        form.append("available", item.available);
        if (item.image) form.append("image", item.image);

        return restaurantService.AddMenuItems(form);
      });

      await Promise.all(requests);

      setItems([
        { portion: "", price: "", category: "", image: null, available: true },
      ]);
      setMessage({ text: "Items added successfully!", type: "success" });
    } catch (error) {
      setMessage({
        text: `Error: ${error.response?.data?.error || "Failed to add items"}`,
        type: "error",
      });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
        <h2 className="text-xl font-bold text-white">Add Items to Menu</h2>
      </div>

      <div className="p-6">
        {message.text && (
          <div
            className={`mb-4 p-3 rounded-md ${
              message.type === "success"
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Menu
            </label>
            <select
              name="menu_id"
              value={selectedMenu}
              onChange={(e) => setSelectedMenu(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md"
              required
            >
              {menus.map((menu) => (
                <option key={menu._id} value={menu._id}>
                  {menu.name}
                </option>
              ))}
            </select>
          </div>

          <table className="w-full border text-sm mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-2">Name</th>
                <th className="border px-2 py-2">Description</th>
                <th className="border px-2 py-2">Portion</th>
                <th className="border px-2 py-2">Price</th>
                <th className="border px-2 py-2">Category</th>
                <th className="border px-2 py-2">Image</th>
                <th className="border px-2 py-2">Available</th>
                <th className="border px-2 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx}>
                  <td className="border p-2">
                    <input
                      type="text"
                      name="name"
                      value={item.name}
                      onChange={(e) => handleItemChange(idx, e)}
                      className="w-full border rounded px-2 py-1"
                      required
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      name="description"
                      value={item.description}
                      onChange={(e) => handleItemChange(idx, e)}
                      className="w-full border rounded px-2 py-1"
                      required
                    />
                  </td>
                  <td className="border p-2">
                    <select
                      name="portion"
                      value={item.portion}
                      onChange={(e) => handleItemChange(idx, e)}
                      className="w-full border rounded px-2 py-1"
                      required
                    >
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                    </select>
                  </td>

                  <td className="border p-2">
                    <input
                      type="number"
                      name="price"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => handleItemChange(idx, e)}
                      className="w-full border rounded px-2 py-1"
                      required
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      name="category"
                      value={item.category}
                      onChange={(e) => handleItemChange(idx, e)}
                      className="w-full border rounded px-2 py-1"
                      required
                    />
                  </td>
                  <td className="border p-2">
                  <input
  type="file"
  name="images"
  accept="image/*"
  multiple
  onChange={(e) => handleFileChange(idx, e)}
  className="w-full"
/>
                  </td>
                  <td className="border p-2 text-center">
                    <input
                      type="checkbox"
                      name="available"
                      checked={item.available}
                      onChange={(e) => handleItemChange(idx, e)}
                    />
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      type="button"
                      onClick={() => removeItemRow(idx)}
                      className="text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mb-4">
            <button
              type="button"
              onClick={addItemRow}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
            >
              + Add Item
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            {loading ? "Adding Items..." : "Submit All Items"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateMenuItemsForm;
