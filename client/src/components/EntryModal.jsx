import React, { useState, useEffect } from 'react';
import { useEntry } from '../context/EntryContext';

const EntryModal = ({ isOpen, onClose, entry }) => {
  const { addEntry, updateEntry } = useEntry();
  
  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().split('T')[0];
  };

  const isEditMode = Boolean(entry);

  const [formData, setFormData] = useState({
    shop: entry?.shop || 'Ramu Fashions',
    company: entry?.company || '',
    purchaseAmount: entry?.purchaseAmount || '',
    purchaseDate: formatDateForInput(entry?.purchaseDate),
    cashAmount: entry?.cashAmount || '',
    cashDate: formatDateForInput(entry?.cashDate),
    checkAmount: entry?.checkAmount || '',
    checkDate: formatDateForInput(entry?.checkDate),
    returnGoods: entry?.returnGoods || '',
    returnGoodsDate: formatDateForInput(entry?.returnGoodsDate),
  });

  useEffect(() => {
    setFormData({
      shop: entry?.shop || 'Ramu Fashions',
      company: entry?.company || '',
      purchaseAmount: entry?.purchaseAmount || '',
      purchaseDate: formatDateForInput(entry?.purchaseDate),
      cashAmount: entry?.cashAmount || '',
      cashDate: formatDateForInput(entry?.cashDate),
      checkAmount: entry?.checkAmount || '',
      checkDate: formatDateForInput(entry?.checkDate),
      returnGoods: entry?.returnGoods || '',
      returnGoodsDate: formatDateForInput(entry?.returnGoodsDate),
    });
  }, [entry]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      updateEntry(entry._id, formData);
    } else {
      addEntry(formData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">{isEditMode ? 'Edit Entry' : 'Add New Entry'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Shop</label>
              <select name="shop" value={formData.shop} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                <option>Ramu Fashions</option>
                <option>Ramu Readymade</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Company</label>
              <input type="text" name="company" value={formData.company} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Purchase Amount & Date</label>
            <div className="flex gap-4">
              <input type="number" step="0.01" name="purchaseAmount" value={formData.purchaseAmount} onChange={handleChange} placeholder="Amount" required className="flex-grow p-2 border border-gray-300 rounded-md" />
              <input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} required className="p-2 border border-gray-300 rounded-md" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cash Amount & Date</label>
            <div className="flex gap-4">
              <input type="number" step="0.01" name="cashAmount" value={formData.cashAmount} onChange={handleChange} placeholder="Amount" className="flex-grow p-2 border border-gray-300 rounded-md" />
              <input type="date" name="cashDate" value={formData.cashDate} onChange={handleChange} className="p-2 border border-gray-300 rounded-md" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Check Amount & Date</label>
            <div className="flex gap-4">
              <input type="number" step="0.01" name="checkAmount" value={formData.checkAmount} onChange={handleChange} placeholder="Amount" className="flex-grow p-2 border border-gray-300 rounded-md" />
              <input type="date" name="checkDate" value={formData.checkDate} onChange={handleChange} className="p-2 border border-gray-300 rounded-md" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Return Goods Amount & Date</label>
            <div className="flex gap-4">
              <input type="number" step="0.01" name="returnGoods" value={formData.returnGoods} onChange={handleChange} placeholder="Amount" className="flex-grow p-2 border border-gray-300 rounded-md" />
              <input type="date" name="returnGoodsDate" value={formData.returnGoodsDate} onChange={handleChange} className="p-2 border border-gray-300 rounded-md" />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700">
              {isEditMode ? 'Save Changes' : 'Add Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EntryModal;

