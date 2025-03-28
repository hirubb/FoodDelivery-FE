import React from 'react'

function HighestRatings() {

  const deals = [
    {
      name: 'KFC',
      discount: 40,
      image: '/src/assets/kfc.jpg',
      items: ['Burger', 'Side', 'Drink']
    },
    {
      name: 'Mc Donalds',
      discount: 20,
      image: '/src/assets/mc.jpeg',
      items: ['Steak', 'Salad', 'Appetizer']
    },
    {
      name: 'Burger King',

      image: '/src/assets/cheese-burger-7323672_1280.jpg',
      items: ['Sandwich', 'Pastry', 'Coffee']
    },
    {
      name: 'Dominos',

      image: '/src/assets/dominos.png',
      items: ['Sandwich', 'Pastry', 'Coffee']
    },
    {
      name: 'Starbucks',
  
      image: '/src/assets/starbucks.png',
      items: ['Sandwich', 'Pastry', 'Coffee']
    },
    {
      name: 'Butterbrot Cafe London',
     
      image: '/src/assets/french-fries-4977354_1280.jpg',
      items: ['Sandwich', 'Pastry', 'Coffee']
    }
  ];
  return (
    <div className="-mt-4 px-16 text-white text-xl">
      <div>
        <div className="text-white text-xl font-bold mb-4 flex items-center">
          <span className="mr-2">🍽️</span>
          Highest Ratings
        </div>
        
        {/* Grid layout for the cards */}
        <div className="grid grid-cols-6 gap-4 overflow-x-hidden">
          {deals.map((deal, index) => (
            <div 
              key={index} 
              className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg"
            >
              
              
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

export default HighestRatings
