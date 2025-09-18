import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShopSummary = () => {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://harsha-bills.onrender.com/api/entries/reports/shop-summary', {
          headers: { 'x-auth-token': token },
        });
        setSummary(res.data);
      } catch (error) {
        console.error('Failed to fetch shop summary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const getShopData = (department) => {
    return summary.find(item => item._id === department) || { totalPurchase: 0, totalPayments: 0 };
  };

  const fashionData = getShopData('Fashion');
  const readymadesData = getShopData('Readymades');

  if (loading) {
    return <p>Loading summary...</p>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Shop-wise Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ramu Fashion Summary */}
        <div className="p-4 bg-purple-50 rounded-lg">
          <h3 className="font-bold text-lg text-purple-700">Ramu Fashion</h3>
          <div className="mt-2 space-y-1 text-sm">
            <p className="flex justify-between"><span>Total Purchase:</span> <span className="font-semibold">₹{fashionData.totalPurchase.toFixed(2)}</span></p>
            <p className="flex justify-between"><span>Total Payments:</span> <span className="font-semibold">₹{fashionData.totalPayments.toFixed(2)}</span></p>
            <p className="flex justify-between border-t pt-1 mt-1 font-bold"><span>Balance:</span> <span>₹{(fashionData.totalPurchase - fashionData.totalPayments).toFixed(2)}</span></p>
          </div>
        </div>
        {/* Ramu Readymades Summary */}
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="font-bold text-lg text-green-700">Ramu Readymades</h3>
          <div className="mt-2 space-y-1 text-sm">
            <p className="flex justify-between"><span>Total Purchase:</span> <span className="font-semibold">₹{readymadesData.totalPurchase.toFixed(2)}</span></p>
            <p className="flex justify-between"><span>Total Payments:</span> <span className="font-semibold">₹{readymadesData.totalPayments.toFixed(2)}</span></p>
            <p className="flex justify-between border-t pt-1 mt-1 font-bold"><span>Balance:</span> <span>₹{(readymadesData.totalPurchase - readymadesData.totalPayments).toFixed(2)}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopSummary;
