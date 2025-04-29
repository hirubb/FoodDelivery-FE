import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import restaurantService from '../../../services/restaurant-service';

function MenuManagement() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [menus, setMenus] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingMenu, setEditingMenu] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '' });
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [menuItemForm, setMenuItemForm] = useState({
    name: '',
    description: '',
    price: '',
    portion: '',
    category: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const { data } = await restaurantService.getMyRestaurants();
        const list = data.restaurants || [];
        setRestaurants(list);
        if (list.length) {
          setSelectedRestaurant(list[0]._id);
        } else {
          setError('No restaurants found. Please create one.');
        }
      } catch {
        setError('Failed to load restaurants.');
      } finally {
        setLoading(false);
      }
    }
    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (!selectedRestaurant) return;
    async function fetchMenus() {
      setLoading(true);
      try {
        const { data } = await restaurantService.getMenus(selectedRestaurant);
        setMenus(data);
      } catch {
        setError('Failed to load menus.');
      } finally {
        setLoading(false);
      }
    }
    fetchMenus();
  }, [selectedRestaurant]);

  const handleRestaurantChange = (e) => setSelectedRestaurant(e.target.value);

  const filteredMenus = (() => {
    if (activeTab === 'active') return menus.filter(menu => menu.status === 'active');
    if (activeTab === 'drafts') return menus.filter(menu => menu.status === 'draft');
    return menus;
  })();

  const counts = {
    all: menus.length,
    active: menus.filter(m => m.status === 'active').length,
    drafts: menus.filter(m => m.status === 'draft').length,
  };

  const selectedRestaurantName = restaurants.find(r => r._id === selectedRestaurant)?.name || '';

  // Menu editing functions
  const handleEditMenuClick = (menu) => {
    setEditingMenu(menu);
    setEditForm({ name: menu.name, description: menu.description });
    // Close any open menu item editing
    setEditingMenuItem(null);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditFormSubmit = async () => {
    if (!editingMenu) return;
    try {
      const updated = {
        name: editForm.name,
        description: editForm.description,
      };
      await restaurantService.updateMenu(editingMenu._id, updated);
      setMenus(prev =>
        prev.map(m => (m._id === editingMenu._id ? { ...m, ...updated } : m))
      );
      handleCancelEdit();
    } catch {
      alert('Failed to update menu.');
    }
  };

  const handleDeleteMenu = async (menuId) => {
    if (!window.confirm('Are you sure you want to delete this menu?')) return;
    try {
      await restaurantService.deleteMenu(selectedRestaurant, menuId);
      setMenus(prev => prev.filter(m => m._id !== menuId));
    } catch {
      alert('Failed to delete menu.');
    }
  };

  const handleCancelEdit = () => {
    setEditingMenu(null);
    setEditForm({ name: '', description: '' });
  };

  // Menu Item editing functions
  const handleEditMenuItemClick = (menuId, menuItem) => {
    // Close any menu editing that might be open
    setEditingMenu(null);
    
    setEditingMenuItem({
      menuId,
      itemId: menuItem._id
    });
    
    setMenuItemForm({
      name: menuItem.name,
      description: menuItem.description,
      price: menuItem.price,
      portion: menuItem.portion,
      category: menuItem.category,
      image: null
    });

    // Set image preview if available
    if (menuItem.images && menuItem.images.length > 0) {
      setImagePreview(menuItem.images[0]);
    } else {
      setImagePreview('');
    }
  };

  const handleMenuItemFormChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'image' && files && files[0]) {
      setMenuItemForm(prev => ({ ...prev, image: files[0] }));
      // Create a preview URL for the selected image
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setMenuItemForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleMenuItemFormSubmit = async () => {
    if (!editingMenuItem) return;
    
    try {
      const { menuId, itemId } = editingMenuItem;
      
      // Validate form fields
      if (!menuItemForm.name || !menuItemForm.price) {
        alert('Name and price are required fields.');
        return;
      }
      
      // Create form data to handle file upload
      const formData = new FormData();
      formData.append('name', menuItemForm.name);
      formData.append('description', menuItemForm.description);
      formData.append('price', Number(menuItemForm.price));
      formData.append('portion', menuItemForm.portion);
      formData.append('category', menuItemForm.category);
      
      // Only append image if a new one was selected
      if (menuItemForm.image) {
        formData.append('images', menuItemForm.image);
      }
      
      // Call API to update the menu item
      await restaurantService.updateMenuItemWithImage(itemId, formData);
      
      // Refresh menus to get updated data including new image
      const { data } = await restaurantService.getMenus(selectedRestaurant);
      setMenus(data);
      
      handleCancelMenuItemEdit();
    } catch (err) {
      console.error(err);
      alert('Failed to update menu item.');
    }
  };

  const handleDeleteMenuItem = async (menuId, itemId) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    
    try {
      await restaurantService.deleteMenuItem(itemId);
      
      // Update local state
      setMenus(prevMenus => 
        prevMenus.map(menu => {
          if (menu._id === menuId) {
            return {
              ...menu,
              menu_items: menu.menu_items.filter(item => item._id !== itemId)
            };
          }
          return menu;
        })
      );
    } catch {
      alert('Failed to delete menu item.');
    }
  };

  const handleCancelMenuItemEdit = () => {
    setEditingMenuItem(null);
    setMenuItemForm({
      name: '',
      description: '',
      price: '',
      portion: '',
      category: '',
      image: null
    });
    setImagePreview('');
    // Revoke any object URLs to avoid memory leaks
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  // Function to add a new menu item
  const handleAddMenuItem = (menuId) => {
    navigate(`/restaurant/menu/${menuId}/add-item`);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 text-white">
        <div>
          <h1 className="text-3xl font-bold text-white">Menu Management</h1>
          <p className="text-white mt-1">Manage all your restaurant menus</p>
        </div>
        <button
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center transition"
          onClick={() =>
            selectedRestaurant
              ? navigate(`/restaurant/menu/create/${selectedRestaurant}`)
              : alert('Please select a restaurant first.')
          }
        >
          <span className="mr-1">+</span> Add New Menu
        </button>
      </div>

      {/* Restaurant Selector */}
      <div className="bg-[#FFFFFF08] rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="w-full md:w-1/3">
            <label htmlFor="restaurant-select" className="block text-sm font-medium text-white mb-1 bg-[#FFFFFF08]">
              Select Restaurant
            </label>
            <select
              id="restaurant-select"
              value={selectedRestaurant}
              onChange={handleRestaurantChange}
              className="w-full px-3 py-2 text-white bg-[#FFFFFF08] border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              disabled={loading || !restaurants.length}
            >
              {restaurants.length === 0 ? (
                <option>No restaurants available</option>
              ) : (
                <>
                  <option value="" disabled>Choose a restaurant</option>
                  {restaurants.map(r => (
                    <option key={r._id} value={r._id}>
                      {r.name}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          {selectedRestaurantName && (
            <div className="bg-[#04203c08] border-l-4 border-blue-500 p-3 md:flex-1">
              <h3 className="text-orange-500 font-medium">
                Viewing menus for: {selectedRestaurantName}
              </h3>
              <p className="text-orange-500 text-sm">{counts.all} total menus</p>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {['all', 'active', 'drafts'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Menus ({counts[tab]})
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center h-40 ">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center mb-4">{error}</div>
      ) : filteredMenus.length === 0 ? (
        <div className="text-center text-white mt-10">No menus found.</div>
      ) : (
        <div className="grid gap-6 ">
          {filteredMenus.map(menu => (
            <div key={menu._id} className="bg-[#FFFFFF08]  text-white shadow rounded-lg p-5">
              {editingMenu?._id === menu._id ? (
                <div>
                  <input
                    name="name"
                    value={editForm.name}
                    onChange={handleEditFormChange}
                    className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Menu Name"
                  />
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleEditFormChange}
                    className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Menu Description"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleEditFormSubmit}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4 text-white">
                    <div>
                      <h2 className="text-xl font-semibold text-orange-500 mb-1">{menu.name}</h2>
                      <p className="text-white">{menu.description}</p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEditMenuClick(menu)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
                      >
                        Edit Menu
                      </button>
                      <button
                        onClick={() => handleDeleteMenu(menu._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
                      >
                        Delete Menu
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-white mb-3">Menu Items</h3>
                    {menu.menu_items?.length ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ">
                        {menu.menu_items.map(item => (
                          <div key={item._id} className=" p-4 rounded-md shadow-sm relative bg-[#ffffff28]">
                            {editingMenuItem && editingMenuItem.menuId === menu._id && editingMenuItem.itemId === item._id ? (
                              <div className="p-3 bg-gray-50 rounded">
                                <h4 className="text-lg font-semibold mb-3 text-black">Edit Menu Item</h4>
                                <div className="space-y-3">
                                  {/* Image Upload Field */}
                                  <div>
                                    <label className="block text-sm font-medium text-black mb-1">
                                      Image
                                    </label>
                                    <div className="flex flex-col items-center mb-3">
                                      {imagePreview && (
                                        <div className="mb-2">
                                          <img 
                                            src={imagePreview} 
                                            alt="Preview" 
                                            className="w-full h-40 object-cover rounded-md"
                                          />
                                        </div>
                                      )}
                                      <input
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleMenuItemFormChange}
                                        className="w-full text-sm text-black file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                      />
                                      <p className="mt-1 text-xs text-gray-500">
                                        {imagePreview ? "Change image or keep current one" : "Upload an image"}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <label className="block text-sm font-medium text-black mb-1">
                                      Name
                                    </label>
                                    <input
                                      name="name"
                                      value={menuItemForm.name}
                                      onChange={handleMenuItemFormChange}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                      placeholder="Item Name"
                                    />
                                  </div>
                                  
                                  <div>
                                    <label className="block text-sm font-medium text-black mb-1">
                                      Description
                                    </label>
                                    <textarea
                                      name="description"
                                      value={menuItemForm.description}
                                      onChange={handleMenuItemFormChange}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                      placeholder="Item Description"
                                    />
                                  </div>
                                  
                                  <div>
                                    <label className="block text-sm font-medium text-black mb-1">
                                      Price (Rs.)
                                    </label>
                                    <input
                                      name="price"
                                      type="number"
                                      value={menuItemForm.price}
                                      onChange={handleMenuItemFormChange}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black"
                                      placeholder="Price"
                                    />
                                  </div>
                                  
                                  <div>
                                    <label className="block text-sm font-medium text-black mb-1">
                                      Portion
                                    </label>
                                    <input
                                      name="portion"
                                      value={menuItemForm.portion}
                                      onChange={handleMenuItemFormChange}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                      placeholder="Portion (e.g., Small, Medium, Large)"
                                    />
                                  </div>
                                  
                                  <div>
                                    <label className="block text-sm font-medium text-black mb-1">
                                      Category
                                    </label>
                                    <input
                                      name="category"
                                      value={menuItemForm.category}
                                      onChange={handleMenuItemFormChange}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                      placeholder="Category"
                                    />
                                  </div>
                                  
                                  <div className="flex gap-3 pt-2">
                                    <button
                                      onClick={handleMenuItemFormSubmit}
                                      className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-md text-sm flex-1"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={handleCancelMenuItemEdit}
                                      className="bg-gray-400 hover:bg-gray-500 text-black px-4 py-2 rounded-md text-sm flex-1"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <>
                                {item.images && item.images.length > 0 && (
                                  <img
                                    src={item.images[0]}
                                    alt={item.name}
                                    className="w-full h-40 object-cover rounded-md mb-3"
                                  />
                                )}
                                <h3 className="text-md font-bold text-white">{item.name}</h3>
                                <p className="text-sm text-white">{item.description}</p>
                                <p className="text-sm text-white">Portion: {item.portion}</p>
                                <p className="text-sm text-white">Category: {item.category}</p>
                                <p className="text-orange-600 font-semibold mt-1">Rs. {item.price}</p>
                                
                                <div className="flex gap-2 mt-3">
                                  <button
                                    onClick={() => handleEditMenuItemClick(menu._id, item)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs flex-1"
                                  >
                                    Edit Item
                                  </button>
                                  <button
                                    onClick={() => handleDeleteMenuItem(menu._id, item._id)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs flex-1"
                                  >
                                    Delete Item
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-8 border border-dashed rounded-lg">
                        <p>No items in this menu.</p>
                        <button
                          onClick={() => handleAddMenuItem(menu._id)}
                          className="mt-2 text-blue-500 hover:text-blue-700 font-medium"
                        >
                          + Add your first menu item
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MenuManagement;