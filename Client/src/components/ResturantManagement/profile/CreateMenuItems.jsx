import React, { useState, useEffect } from "react";
import restaurantService from "../../../services/restaurant-service";

function CreateMenuItemsForm({ restaurantId }) {
  const [menus, setMenus] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState("");
  const [items, setItems] = useState([
    {
      name: "",
      description: "",
      portion: "M",  // Set default value
      price: "",
      category: "",
      image: null,
      available: true,
    },
  ]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [loadingMenus, setLoadingMenus] = useState(false);
  const [imagePreview, setImagePreview] = useState({});

  useEffect(() => {
    if (!restaurantId) return;
  
    const fetchMenus = async () => {
      setLoadingMenus(true);
      try {
        const response = await restaurantService.getMenus(restaurantId);
        if (response.data.length > 0) {
          setMenus(response.data);
          if (!selectedMenu) {
            setSelectedMenu(response.data[0]._id);
          }
        } else {
          setMessage({
            text: "Please create a menu first before adding items.",
            type: "info"
          });
        }
      } catch (error) {
        console.error("Error fetching menus:", error);
        setMessage({
          text: "Could not load menus. Please try again later.",
          type: "error"
        });
      } finally {
        setLoadingMenus(false);
      }
    };
  
    fetchMenus();
  
    // Listen to menuCreated event
    const handleMenuCreated = (e) => {
      const newMenu = e.detail;
      setMenus((prev) => [...prev, newMenu]);
      setSelectedMenu(newMenu._id);
      setMessage({
        text: `Menu "${newMenu.name}" created! You can now add items to it.`,
        type: "success"
      });
    };
  
    window.addEventListener('menuCreated', handleMenuCreated);
  
    // Cleanup
    return () => {
      window.removeEventListener('menuCreated', handleMenuCreated);
    };
  }, [restaurantId]);
  
  // Categories suggestion list
  const suggestedCategories = [
    "Appetizers", "Main Course", "Desserts", "Beverages", 
    "Starters", "Soups", "Salads", "Sides", "Specials"
  ];

  const handleItemChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const newItems = [...items];
    newItems[index][name] = type === "checkbox" ? checked : value;
    setItems(newItems);
  };

  const handleFileChange = (index, e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    const newItems = [...items];
    newItems[index].image = files;
    setItems(newItems);
    
    // Generate preview for the first image
    const previewURL = URL.createObjectURL(files[0]);
    setImagePreview({...imagePreview, [index]: previewURL});
  };

  const addItemRow = () => {
    setItems([
      ...items,
      { 
        name: "",
        description: "",
        portion: "M", // Default to medium
        price: "",
        category: items[items.length - 1].category || "", // Copy category from last item
        image: null,
        available: true, 
      },
    ]);
  };

  const removeItemRow = (index) => {
    if (items.length === 1) {
      // Reset the first row instead of removing it
      setItems([{ 
        name: "",
        description: "",
        portion: "M",
        price: "",
        category: "",
        image: null,
        available: true, 
      }]);
      
      // Clear preview
      const newPreviews = {...imagePreview};
      delete newPreviews[0];
      setImagePreview(newPreviews);
      return;
    }
    
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    
    // Clear preview for removed item
    const newPreviews = {...imagePreview};
    delete newPreviews[index];
    setImagePreview(newPreviews);
  };

  const clearForm = () => {
    setItems([{ 
      name: "",
      description: "",
      portion: "M",
      price: "",
      category: "",
      image: null,
      available: true, 
    }]);
    setImagePreview({});
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

        return restaurantService.AddMenuItems(form);
      });

      await Promise.all(requests);

      clearForm();
      setMessage({ 
        text: `✅ Success! ${items.length} ${items.length === 1 ? 'item' : 'items'} added to your menu.`, 
        type: "success" 
      });
    } catch (error) {
      setMessage({
        text: `❌ Error: ${error.response?.data?.error || "Failed to add items"}`,
        type: "error",
      });
    } finally {
      setLoading(false);
      // Only clear success messages automatically
      if (message.type === "success") {
        setTimeout(() => setMessage({ text: "", type: "" }), 5000);
      }
    }
  };

  // Helper function to generate message style classes
  const getMessageClasses = (type) => {
    switch(type) {
      case 'success':
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'error':
        return 'bg-red-100 text-red-800 border border-red-300';
      case 'info':
        return 'bg-blue-100 text-blue-800 border border-blue-300';
      default:
        return '';
    }
  };

  const disableSubmit = loadingMenus || loading || menus.length === 0;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden text-[#03081F]">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
        <h2 className="text-xl font-bold text-white">Add Items to Menu</h2>
        <p className="text-blue-100 text-sm mt-1">
          Create food items for your selected menu
        </p>
      </div>

      <div className="p-6">
        {message.text && (
          <div
            className={`mb-4 p-3 rounded-md flex items-center justify-between ${getMessageClasses(message.type)}`}
          >
            <div>{message.text}</div>
            {message.type !== "success" && (
              <button 
                className="text-gray-700 hover:text-gray-900" 
                onClick={() => setMessage({ text: "", type: "" })}
              >
                ✕
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Menu <span className="text-red-500">*</span>
            </label>
            {loadingMenus ? (
              <div className="w-full p-2 bg-gray-50 border border-gray-300 rounded-md text-gray-500 text-sm">
                Loading menus...
              </div>
            ) : (
              <select
                name="menu_id"
                value={selectedMenu}
                onChange={(e) => setSelectedMenu(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                required
                disabled={menus.length === 0}
              >
                {menus.length === 0 ? (
                  <option value="">No menus available</option>
                ) : (
                  <>
                    <option value="" disabled>Choose a menu</option>
                    {menus.map((menu) => (
                      <option key={menu._id} value={menu._id}>
                        {menu.name}
                      </option>
                    ))}
                  </>
                )}
              </select>
            )}
            <p className="text-xs text-gray-500 mt-1">Select the menu where you want to add these items</p>
          </div>

          {menus.length > 0 && (
            <>
              <div className="mb-4 bg-gray-50 p-4 rounded-md border-l-4 border-blue-500">
                <h3 className="font-medium text-gray-700 mb-2">Adding items to your menu</h3>
                <ul className="text-sm text-gray-600 list-disc ml-5 space-y-1">
                  <li>Add multiple items at once using the "Add Item" button</li>
                  <li>All fields marked with <span className="text-red-500">*</span> are required</li>
                  <li>You can upload images for each menu item</li>
                  <li>Items are automatically set as "Available"</li>
                </ul>
              </div>

              <div className="overflow-x-auto mb-6">
                <table className="w-full border text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-2 py-2">Name <span className="text-red-500">*</span></th>
                      <th className="border px-2 py-2">Description <span className="text-red-500">*</span></th>
                      <th className="border px-2 py-2">Portion <span className="text-red-500">*</span></th>
                      <th className="border px-2 py-2">Price <span className="text-red-500">*</span></th>
                      <th className="border px-2 py-2">Category <span className="text-red-500">*</span></th>
                      <th className="border px-2 py-2">Image</th>
                      <th className="border px-2 py-2">Available</th>
                      <th className="border px-2 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="border p-2">
                          <input
                            type="text"
                            name="name"
                            value={item.name}
                            onChange={(e) => handleItemChange(idx, e)}
                            placeholder="Item name"
                            className="w-full border rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          />
                        </td>
                        <td className="border p-2">
                          <textarea
                            name="description"
                            value={item.description}
                            onChange={(e) => handleItemChange(idx, e)}
                            placeholder="Brief description"
                            rows="2"
                            className="w-full border rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          />
                        </td>
                        <td className="border p-2">
                          <select
                            name="portion"
                            value={item.portion}
                            onChange={(e) => handleItemChange(idx, e)}
                            className="w-full border rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          >
                            <option value="" disabled>Size</option>
                            <option value="S">Small</option>
                            <option value="M">Medium</option>
                            <option value="L">Large</option>
                          </select>
                        </td>

                        <td className="border p-2">
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                              <span className="text-gray-500">$</span>
                            </div>
                            <input
                              type="number"
                              name="price"
                              step="0.01"
                              min="0"
                              value={item.price}
                              onChange={(e) => handleItemChange(idx, e)}
                              placeholder="0.00"
                              className="w-full border rounded pl-6 pr-2 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              required
                            />
                          </div>
                        </td>
                        <td className="border p-2">
                          <input
                            type="text"
                            list={`categories-${idx}`}
                            name="category"
                            value={item.category}
                            onChange={(e) => handleItemChange(idx, e)}
                            placeholder="e.g., Appetizers"
                            className="w-full border rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                          />
                          <datalist id={`categories-${idx}`}>
                            {suggestedCategories.map((cat, catIdx) => (
                              <option key={catIdx} value={cat} />
                            ))}
                          </datalist>
                        </td>
                        <td className="border p-2">
                          <div className="flex flex-col items-center">
                            <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-2 rounded text-xs w-full text-center">
                              {imagePreview[idx] ? 'Change Image' : 'Upload Image'}
                              <input
                                type="file"
                                name="images"
                                accept="image/*"
                                onChange={(e) => handleFileChange(idx, e)}
                                className="hidden"
                              />
                            </label>
                            {imagePreview[idx] && (
                              <div className="mt-2 relative">
                                <img 
                                  src={imagePreview[idx]} 
                                  alt="Preview" 
                                  className="h-12 w-12 object-cover rounded" 
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newItems = [...items];
                                    newItems[idx].image = null;
                                    setItems(newItems);
                                    
                                    const newPreviews = {...imagePreview};
                                    delete newPreviews[idx];
                                    setImagePreview(newPreviews);
                                  }}
                                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                                >
                                  ×
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="border p-2 text-center">
                          <label className="flex items-center justify-center cursor-pointer">
                            <input
                              type="checkbox"
                              name="available"
                              checked={item.available}
                              onChange={(e) => handleItemChange(idx, e)}
                              className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                            />
                            <span className="ml-2 text-xs text-gray-700">Yes</span>
                          </label>
                        </td>
                        <td className="border p-2 text-center">
                          <button
                            type="button"
                            onClick={() => removeItemRow(idx)}
                            className="text-red-600 hover:text-red-800 hover:underline text-sm"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between mb-6">
                <button
                  type="button"
                  onClick={addItemRow}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Item
                </button>

                <button
                  type="button"
                  onClick={clearForm}
                  className="text-gray-600 px-4 py-2 rounded-md hover:bg-gray-100 transition border border-gray-300"
                >
                  Clear Form
                </button>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  <span className="text-red-500">*</span> Required fields
                </p>
                <button
                  type="submit"
                  disabled={disableSubmit}
                  className={`flex justify-center items-center py-2 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                    disableSubmit ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving Items...
                    </>
                  ) : (
                    `Save ${items.length} ${items.length === 1 ? 'Item' : 'Items'}`
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default CreateMenuItemsForm;