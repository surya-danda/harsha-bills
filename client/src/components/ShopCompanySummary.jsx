import React from 'react';

const ShopCompanySummary = ({ entries, shopName }) => {
  // 1. Filter entries for the specific shop
  const shopEntries = entries.filter((e) => e.shop === shopName);

  // 2. Group entries by company and calculate totals
  const companyData = shopEntries.reduce((acc, entry) => {
    const { company, purchaseAmount } = entry;
    if (!acc[company]) {
      acc[company] = { totalPurchase: 0, count: 0, dates: [] };
    }
    acc[company].totalPurchase += purchaseAmount;
    acc[company].count += 1;
    acc[company].dates.push(new Date(entry.purchaseDate).toLocaleDateString('en-IN'));
    return acc;
  }, {});

  // 3. Convert the grouped data into a sorted array
  const summaryList = Object.entries(companyData)
    .map(([company, data]) => ({
      company,
      ...data,
    }))
    .sort((a, b) => b.totalPurchase - a.totalPurchase);

  if (shopEntries.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800">{shopName}</h3>
        <p className="mt-4 text-center text-gray-500">No entries for the selected period.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{shopName} - Company Summary</h3>
      <div className="space-y-4">
        {summaryList.map(({ company, totalPurchase, dates }) => (
          <div key={company} className="p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">{company}</span>
              <span className="font-bold text-blue-600">₹{totalPurchase.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Transactions on: {Array.from(new Set(dates)).join(', ')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopCompanySummary;

