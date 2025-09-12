import React from 'react';
import { useEntry } from '../context/EntryContext'; // <-- Import the hook

const EntryItem = ({ entry }) => {
  const { deleteEntry } = useEntry(); // <-- Use the hook
  const balance = entry.purchaseAmount - (entry.checkPayment + entry.cashPayment);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  return (
    // ... JSX remains the same
    <div className="bg-gray-50 p-4 rounded-lg shadow space-y-2">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-lg">{entry.companyName}</h4>
          <p className="text-xs text-gray-500">Purchased on: {formatDate(entry.purchaseDate)}</p>
        </div>
        <button onClick={() => deleteEntry(entry._id)} className="text-red-500 hover:text-red-700 font-bold text-2xl leading-none">
          &times;
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <p>Purchase:</p><p className="font-semibold">₹{entry.purchaseAmount.toFixed(2)}</p>
        <p>Check:</p><p>₹{entry.checkPayment.toFixed(2)} ({formatDate(entry.checkPaymentDate)})</p>
        <p>Cash:</p><p>₹{entry.cashPayment.toFixed(2)} ({formatDate(entry.cashPaymentDate)})</p>
        <p className="font-bold pt-1 border-t mt-1">Balance:</p><p className="font-bold pt-1 border-t mt-1">₹{balance.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default EntryItem;