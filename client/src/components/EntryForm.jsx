import React, { useState } from 'react';
import { useEntry } from '../context/EntryContext'; // <-- Import the hook

const EntryForm = ({ department, color }) => {
  const { addEntry } = useEntry(); // <-- Use the hook
  const [formData, setFormData] = useState({
    companyName: '',
    purchaseAmount: '',
    checkPayment: '',
    cashPayment: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    checkPaymentDate: '',
    cashPaymentDate: '',
  });

  const { companyName, purchaseAmount, checkPayment, cashPayment, purchaseDate, checkPaymentDate, cashPaymentDate } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    const entryData = {
      ...formData,
      department,
      purchaseAmount: parseFloat(purchaseAmount) || 0,
      checkPayment: parseFloat(checkPayment) || 0,
      cashPayment: parseFloat(cashPayment) || 0,
    };
    addEntry(entryData);
    setFormData({ 
        companyName: '', purchaseAmount: '', checkPayment: '', cashPayment: '',
        purchaseDate: new Date().toISOString().split('T')[0], checkPaymentDate: '', cashPaymentDate: '' 
    });
  };

  const balance = (parseFloat(purchaseAmount) || 0) - ((parseFloat(checkPayment) || 0) + (parseFloat(cashPayment) || 0));

  return (
    // ... JSX remains the same
    <form onSubmit={onSubmit} className="space-y-4">
      <input type="text" name="companyName" value={companyName} onChange={onChange} placeholder="Company Name" required className="w-full p-2 border rounded" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label className="text-sm">Purchase Amount (₹)</label>
            <input type="number" name="purchaseAmount" value={purchaseAmount} onChange={onChange} placeholder="0.00" required className="w-full p-2 border rounded" />
        </div>
        <div>
            <label className="text-sm">Purchase Date</label>
            <input type="date" name="purchaseDate" value={purchaseDate} onChange={onChange} className="w-full p-2 border rounded" />
        </div>
        <div>
            <label className="text-sm">Check Payment (₹)</label>
            <input type="number" name="checkPayment" value={checkPayment} onChange={onChange} placeholder="0.00" className="w-full p-2 border rounded" />
        </div>
        <div>
            <label className="text-sm">Check Payment Date</label>
            <input type="date" name="checkPaymentDate" value={checkPaymentDate} onChange={onChange} className="w-full p-2 border rounded" />
        </div>
        <div>
            <label className="text-sm">Cash Payment (₹)</label>
            <input type="number" name="cashPayment" value={cashPayment} onChange={onChange} placeholder="0.00" className="w-full p-2 border rounded" />
        </div>
        <div>
            <label className="text-sm">Cash Payment Date</label>
            <input type="date" name="cashPaymentDate" value={cashPaymentDate} onChange={onChange} className="w-full p-2 border rounded" />
        </div>
      </div>
      <div className="p-3 bg-gray-100 rounded text-lg font-bold">
        Balance: ₹{balance.toFixed(2)}
      </div>
      <button type="submit" className={`w-full p-3 text-white font-bold rounded ${color}`}>
        + Add Entry
      </button>
    </form>
  );
};

export default EntryForm;