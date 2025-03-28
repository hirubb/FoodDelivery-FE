import React from 'react'

function StartOrdering() {
  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-brown-600">
          <path d="M10.5 1.875a1.125 1.125 0 0 1 2.25 0v8.25a.75.75 0 0 0 1.5 0V4.5a3.75 3.75 0 1 1 7.5 0v8.25a.75.75 0 0 0 1.5 0V4.5a5.25 5.25 0 1 0-10.5 0v5.625a.75.75 0 0 0 1.5 0v-5.625Z" />
        </svg>
      ),
      title: 'Easy Order',
      description: 'Faucibus ante, in porttitor tellus blandit et. Phasellus tincidunt metus lectus sollicitudin.'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-brown-600">
          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM9.763 9.51a2.25 2.25 0 0 1 3.828-1.351.75.75 0 0 0 1.06-1.06 3.75 3.75 0 1 0-1.413 6.962.75.75 0 1 0-.6-1.375 2.25 2.25 0 0 1-3.875-2.876Z" clipRule="evenodd" />
        </svg>
      ),
      title: 'Enjoy Food',
      description: 'Morbi convallis bibendum urna ut viverra. Maecenas quis consequat libero, a feugiat eros.'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-brown-600">
          <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h8.25c1.035 0 1.875-.84 1.875-1.875V15Z" />
          <path d="M6.75 7.5l.75-.75A3.375 3.375 0 0 1 10.875 3c1.394 0 2.634.777 3.375 2.25m-4.125 7.5l.75.75A3.375 3.375 0 0 0 10.875 21c1.394 0 2.634-.777 3.375-2.25M16.5 15h1.125c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H16.5v3.75Z" />
        </svg>
      ),
      title: 'Quick Delivery',
      description: 'Maecenas pulvinar, risus in facilisis dignissim, quam nisi hendrerit nulla, id vestibulum.'
    }
  ];

  return (
<div className="bg-gray-500 flex justify-center mx-auto mt-20 max-w-screen-xl px-6 py-28 rounded-lg">


      <div className="max-w-6xl w-full bg-white shadow-lg rounded-2xl overflow-hidden flex">
        {/* Features Section */}
        <div className="w-1/2 p-12 space-y-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-6">
              <div className="flex-shrink-0">{feature.icon}</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Section */}
        <div className="w-1/2 bg-gray-50 p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Start Ordering Now
          </h2>

          <p className="text-gray-600 mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed imperdiet libero id nisi euismod, sed porta est consectetur deserunt.
          </p>
          <p className="text-gray-600 mb-8">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>
          <button className="bg-[#FC8A06] border  text-white px-6 py-3 rounded-lg hover:bg-[#03081F] transition-colors">
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default StartOrdering;