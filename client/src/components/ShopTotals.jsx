import React from 'react';

const ShopTotals = ({ entries }) => {
  const totalPurchase = entries.reduce((acc, entry) => acc + (entry.purchaseAmount || 0), 0);
  const totalCash = entries.reduce((acc, entry) => acc + (entry.cashAmount || 0), 0);
  const totalChecks = entries.reduce((acc, entry) => acc + (entry.checkAmount || 0), 0);
  const totalReturnedGoods = entries.reduce((acc, entry) => acc + (entry.returnGoods || 0), 0);
  const totalBalance = totalPurchase - (totalCash + totalChecks + totalReturnedGoods);

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 p-4 bg-gray-50 rounded-lg border">
      <div className="text-center">
        <p className="text-sm text-gray-500">Total Purchase</p>
        <p className="text-xl font-bold text-gray-800">₹{totalPurchase.toFixed(2)}</p>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-500">Total Cash Paid</p>
        <p className="text-xl font-bold text-green-600">₹{totalCash.toFixed(2)}</p>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-500">Total Checks Paid</p>
        <p className="text-xl font-bold text-yellow-600">₹{totalChecks.toFixed(2)}</p>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-500">Total Goods Returned</p>
        <p className="text-xl font-bold text-orange-600">₹{totalReturnedGoods.toFixed(2)}</p>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-500">Total Balance</p>
        <p className="text-xl font-bold text-red-600">₹{totalBalance.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ShopTotals;

