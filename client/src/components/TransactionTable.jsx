import React from 'react';

const TransactionTable = ({ entries, onEdit, onDelete }) => {
  // Group entries by company name
  const groupedByCompany = entries.reduce((acc, entry) => {
    const company = entry.company;
    if (!acc[company]) {
      acc[company] = [];
    }
    acc[company].push(entry);
    return acc;
  }, {});

  if (entries.length === 0) {
    return <p className="text-center text-gray-500">No entries for the selected period.</p>;
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedByCompany).map(([company, transactions]) => {
        // Calculate total purchase amount for the current company
        const totalPurchase = transactions.reduce((sum, t) => sum + (t.purchaseAmount || 0), 0);
        
        return (
          <div key={company}>
            <div className="flex justify-between items-baseline">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{company}</h3>
              <p className="text-sm font-bold text-blue-600">Total Purchase: ₹{totalPurchase.toFixed(2)}</p>
            </div>
            <div className="overflow-x-auto border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cash</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return Goods</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map(t => {
                    // Provide fallback values of 0 to prevent crashes from null/undefined data
                    const purchaseAmount = t.purchaseAmount || 0;
                    const cashAmount = t.cashAmount || 0;
                    const checkAmount = t.checkAmount || 0;
                    const returnGoods = t.returnGoods || 0;
                    
                    // The final balance calculation including returned goods
                    const balance = purchaseAmount - (cashAmount + checkAmount + returnGoods);
                    
                    // Helper function to format dates, returning an empty string if the date is null
                    const formatDate = (dateStr) => dateStr ? `on ${new Date(dateStr).toLocaleDateString('en-IN')}` : '';
                    
                    return (
                      <tr key={t._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">₹{purchaseAmount.toFixed(2)} <span className="block text-gray-500 font-normal">{formatDate(t.purchaseDate)}</span></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">₹{cashAmount.toFixed(2)} <span className="block text-gray-500 font-normal">{formatDate(t.cashDate)}</span></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">₹{checkAmount.toFixed(2)} <span className="block text-gray-500 font-normal">{formatDate(t.checkDate)}</span></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">₹{returnGoods.toFixed(2)} <span className="block text-gray-500 font-normal">{formatDate(t.returnGoodsDate)}</span></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">₹{balance.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-4">
                          <button onClick={() => onEdit(t)} className="text-indigo-600 hover:text-indigo-900 font-medium">Edit</button>
                          <button onClick={() => onDelete(t._id)} className="text-red-600 hover:text-red-900 font-medium">Delete</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TransactionTable;

