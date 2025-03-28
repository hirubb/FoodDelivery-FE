import React from 'react';

function Deals({ nextSectionRef }) {

  const deals = [
    {
      name: 'Chef Burgers London',
      discount: 40,
      image: '/src/assets/cheese-burger-7323672_1280.jpg',
      items: ['Burger', 'Side', 'Drink']
    },
    {
      name: 'Grand Ai Cafe London',
      discount: 20,
      image: '/src/assets/french-fries-4977354_1280.jpg',
      items: ['Steak', 'Salad', 'Appetizer']
    },
    {
      name: 'Butterbrot Cafe London',
      discount: 17,
      image: '/src/assets/cheese-burger-7323672_1280.jpg',
      items: ['Sandwich', 'Pastry', 'Coffee']
    },
    {
      name: 'Butterbrot Cafe London',
      discount: 17,
      image: '/src/assets/french-fries-4977354_1280.jpg',
      items: ['Sandwich', 'Pastry', 'Coffee']
    },
    {
      name: 'Butterbrot Cafe London',
      discount: 17,
      image: '/src/assets/cheese-burger-7323672_1280.jpg',
      items: ['Sandwich', 'Pastry', 'Coffee']
    },
    {
      name: 'Butterbrot Cafe London',
      discount: 17,
      image: '/src/assets/french-fries-4977354_1280.jpg',
      items: ['Sandwich', 'Pastry', 'Coffee']
    }
  ];

  return (
    <div ref={nextSectionRef} className="min-h-screen mt-16 px-16 py-48 text-white text-xl">
      <div>
        <div className="text-white text-xl font-bold mb-4 flex items-center">
          <span className="mr-2">🍽️</span>
          Up to -40% 🇱🇰 AMBULA Lk exclusive deals
        </div>
        
        {/* Grid layout for the cards */}
        <div className="grid grid-cols-3 gap-4 overflow-x-hidden">
          {deals.map((deal, index) => (
            <div 
              key={index} 
              className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg"
            >
              <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 rounded-full">
                -{deal.discount}%
              </div>
              
              <img 
                src={deal.image} 
                alt={deal.name} 
                className="w-full h-48 object-cover"
              />
              
              <div className="p-3">
                <h3 className="text-white font-semibold mb-1">
                  {deal.name}
                </h3>
                <p className="text-gray-400 text-sm">
                  {deal.items.join(' • ')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Deals;
