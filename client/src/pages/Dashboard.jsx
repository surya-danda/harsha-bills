import React, { useState, useEffect } from 'react';
import { useEntry } from '../context/EntryContext';
import FilterControls from '../components/FilterControls';
import EntryModal from '../components/EntryModal';
import TransactionTable from '../components/TransactionTable';
import ShopTotals from '../components/ShopTotals';

const DashboardPage = () => {
  const { entries, loading, error, filterYear, filterMonth, getEntries, deleteEntry } = useEntry();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  // This effect runs when the page loads or when the filters change
  useEffect(() => {
    if (filterYear && filterMonth) {
      getEntries(filterYear, filterMonth);
    }
  }, [filterYear, filterMonth, getEntries]);

  // Handler to open the modal for editing a specific entry
  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  // Handler for deleting an entry after confirmation
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      deleteEntry(id);
    }
  };

  // Handler to open the modal for adding a new entry
  const handleAddNew = () => {
    setEditingEntry(null); // Ensure no data is passed for a new entry
    setIsModalOpen(true);
  };

  // Filter the main entries array for each shop
  const fashionEntries = entries.filter((e) => e.shop === 'Ramu Fashions');
  const readymadeEntries = entries.filter((e) => e.shop === 'Ramu Readymade');

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Payment Dashboard</h1>
        <button
          onClick={handleAddNew}
          className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700"
        >
          + Add New Entry
        </button>
      </div>

      <FilterControls />

      {/* The modal is only rendered when isModalOpen is true */}
      {isModalOpen && (
        <EntryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          entry={editingEntry}
        />
      )}

      {/* Conditional rendering for loading and error states */}
      {loading && <p className="text-center mt-4">Loading entries...</p>}
      {error && <p className="text-center text-red-500 mt-4">{error}</p>}
      
      {/* The main content is only rendered when not loading and there are no errors */}
      {!loading && !error && (
        <div className="mt-6 space-y-8">
          {/* Ramu Fashions Section */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-purple-700 mb-4">Ramu Fashions</h2>
            <ShopTotals entries={fashionEntries} />
            <TransactionTable entries={fashionEntries} onEdit={handleEdit} onDelete={handleDelete} />
          </div>

          {/* Ramu Readymade Section */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-green-700 mb-4">Ramu Readymade</h2>
            <ShopTotals entries={readymadeEntries} />
            <TransactionTable entries={readymadeEntries} onEdit={handleEdit} onDelete={handleDelete} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;

