import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import RestaurantService from '../../../services/restaurant-service';

function Analytics() {
  const [data, setData] = useState([]);
  const [groupBy, setGroupBy] = useState('day');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantId, setRestaurantId] = useState('');
  const [error, setError] = useState('');

  // Set default date range (last 30 days) on component mount
  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    setEndDate(formatDate(today));
    setStartDate(formatDate(thirtyDaysAgo));
    
    // Helper function to format date as YYYY-MM-DD
    function formatDate(date) {
      return date.toISOString().split('T')[0];
    }
  }, []);

  useEffect(() => {
    // Fetch the restaurants owned by the user
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const response = await RestaurantService.getMyRestaurants();

        if (response && response.data.restaurants) {
          const restaurantList = response.data.restaurants || [];
          setRestaurants(restaurantList);
          
          // Auto-select the first restaurant if available
          if (restaurantList.length > 0 && !restaurantId) {
            setRestaurantId(restaurantList[0]._id);
          }
        } else {
          setError('Failed to fetch restaurants');
        }
      } catch (error) {
        setError('Error fetching restaurants');
        console.error('Error fetching restaurants', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const fetchIncome = async () => {
    if (!startDate || !endDate) {
      setError('Please select start and end dates');
      return;
    }

    if (!restaurantId) {
      setError('Please select a restaurant');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const formData = {
        dateRange: { start: startDate, end: endDate },
        groupBy: groupBy,
      };

      const response = await RestaurantService.getIncome(restaurantId, formData);

      if (response.data.success) {
        setData(response.data.data);
        if (response.data.data.length === 0) {
          setError('No data available for the selected period');
        }
      } else {
        setError('Failed to fetch income data');
      }
    } catch (error) {
      setError('Error fetching income data');
      console.error('Error fetching income data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (restaurantId && startDate && endDate) {
      fetchIncome();
    }
    // eslint-disable-next-line
  }, [groupBy, restaurantId]); // refetch when groupBy or restaurantId changes

  // Format currency for display
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded shadow-md">
          <p className="font-medium text-gray-900">{`Date: ${label}`}</p>
          <p className="text-[#FC8A06] font-bold">
            {`Income: ${formatCurrency(payload[0].value)}`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate summary statistics
  const calculateSummary = () => {
    if (data.length === 0) return { total: 0, average: 0, highest: 0 };
    
    const total = data.reduce((sum, item) => sum + item.income, 0);
    const average = total / data.length;
    const highest = Math.max(...data.map(item => item.income));
    
    return { total, average, highest };
  };
  
  const summary = calculateSummary();

  return (
    <div className="p-6 bg-[#03081F] min-h-screen text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold  mb-2">Revenue Analytics</h1>
        <p className="">Track and analyze your restaurant's financial performance</p>
      </div>

      {/* Filter Cards */}
      <div className="bg-[#FFFFFF08] rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold  mb-4">Filters</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 ">
          {/* Restaurant Selector */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Restaurant
            </label>
            <select
              value={restaurantId}
              onChange={(e) => setRestaurantId(e.target.value)}
              className="w-full bg-[#FFFFFF08] text-white  border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FC8A06]"
            >
              <option value="">Select a restaurant</option>
              {restaurants.map((restaurant) => (
                <option key={restaurant._id} value={restaurant._id}>
                  {restaurant.name}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm  text-white font-medium  mb-2 ">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-[#FFFFFF08] text-white border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FC8A06]"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium  mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-[#FFFFFF08] border text-white border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FC8A06]"
            />
          </div>

          {/* Group By */}
          <div>
            <label className="block text-sm font-medium  mb-2">
              Group By
            </label>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="w-full bg-[#FFFFFF08] border text-white border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FC8A06]"
            >
              <option value="day">Daily</option>
              <option value="month">Monthly</option>
            </select>
          </div>
        </div>

        {/* Apply Button */}
        <button
          onClick={fetchIncome}
          className="bg-[#FC8A06] hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-md transition duration-200 flex items-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </>
          ) : (
            'Update Data'
          )}
        </button>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 border-l-4 border-red-500 rounded">
            {error}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#822a0f7d] rounded-lg shadow-md p-6 border-l-4 border-[#FC8A06]">
            <h3 className="text-[#ffffff] text-sm font-medium mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-[#ffffff] ">{formatCurrency(summary.total)}</p>
          </div>
          <div className="bg-[#822a0f7d]  rounded-lg shadow-md p-6 border-l-4 border-[#FC8A06]">
            <h3 className="text-[#ffffff]  text-sm font-medium mb-2">Average {groupBy === 'day' ? 'Daily' : 'Monthly'} Revenue</h3>
            <p className="text-3xl font-bold text-[#ffffff] ">{formatCurrency(summary.average)}</p>
          </div>
          <div className="bg-[#822a0f7d]  rounded-lg shadow-md p-6 border-l-4 border-[#FC8A06]">
            <h3 className="text-[#ffffff]  text-sm font-medium mb-2">Highest {groupBy === 'day' ? 'Daily' : 'Monthly'} Revenue</h3>
            <p className="text-3xl font-bold text-[#ffffff] ">{formatCurrency(summary.highest)}</p>
          </div>
        </div>
      )}

      {/* Chart Section */}
      <div className="bg-[#FFFFFF08] rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Revenue Trend</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FC8A06]"></div>
          </div>
        ) : data.length > 0 ? (
          <>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#83858E' }}
                    tickMargin={10}
                  />
                  <YAxis 
                    tick={{ fill: '#83858E' }}
                    tickFormatter={(value) => `Rs${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="income" 
                    name="Revenue" 
                    stroke="#FC8A06" 
                    strokeWidth={3}
                    dot={{ stroke: '#FC8A06', strokeWidth: 2, r: 4, fill: 'white' }}
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* Data Table for detailed view */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-[#03081F] mb-4">Detailed Revenue Data</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">{formatCurrency(item.income)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-[#83858E]">
            <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <p className="text-lg">No data available for the selected period</p>
            <p className="text-sm mt-2">Try adjusting your filters or selecting a different date range</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Analytics;