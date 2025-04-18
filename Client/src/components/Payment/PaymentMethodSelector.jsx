import React from 'react';

export default function PaymentMethodSelector({ selected, onChange }) {
  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Pay securely with your card',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Fast and secure payment with PayPal',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 0 0-.794.68l-.04.22-.63 4.028-.024.13a.804.804 0 0 1-.794.68h-2.52a.483.483 0 0 1-.477-.558l.04-.22 1.255-7.956a.48.48 0 0 1 .476-.404h3.517c2.437 0 4.31-.893 4.887-3.488l.116-.63c.05-.272.094-.53.13-.777l.073-.47z" />
          <path d="M18.188 6.188C17.667 2.723 15.125 1.5 12 1.5H6.318a.805.805 0 0 0-.794.68l-2.52 15.96a.483.483 0 0 0 .476.558H6l.55-3.48a.913.913 0 0 1 .9-.768h1.929c3.686 0 6.417-1.495 7.236-5.81.367-1.643.003-2.705-.427-3.452z" />
        </svg>
      )
    }
  ];

  return (
    <div className="space-y-3">
      {paymentMethods.map((method) => (
        <div
          key={method.id}
          className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
            selected === method.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:bg-gray-50'
          }`}
          onClick={() => onChange(method.id)}
        >
          <div className={`flex-shrink-0 ${selected === method.id ? 'text-blue-600' : 'text-gray-500'}`}>
            {method.icon}
          </div>
          
          <div className="flex-grow ml-4">
            <div className="font-medium text-gray-800">{method.name}</div>
            <div className="text-sm text-gray-600">{method.description}</div>
          </div>
          
          <div className="flex-shrink-0 ml-4">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              selected === method.id
                ? 'border-blue-500'
                : 'border-gray-300'
            }`}>
              {selected === method.id && (
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}