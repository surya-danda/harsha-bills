import React from 'react';
import { useEntry } from '../context/EntryContext';

const FilterControls = () => {
  const { filterYear, setFilterYear, filterMonth, setFilterMonth } = useEntry();

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
  const months = [
    { value: 1, name: 'January' }, { value: 2, name: 'February' },
    { value: 3, name: 'March' }, { value: 4, name: 'April' },
    { value: 5, name: 'May' }, { value: 6, name: 'June' },
    { value: 7, name: 'July' }, { value: 8, name: 'August' },
    { value: 9, name: 'September' }, { value: 10, name: 'October' },
    { value: 11, name: 'November' }, { value: 12, name: 'December' },
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow-md mb-8 flex flex-wrap items-center justify-center gap-4">
      <h3 className="font-semibold text-gray-700">Filter by:</h3>
      <select
        value={filterMonth}
        onChange={(e) => setFilterMonth(parseInt(e.target.value))}
        className="p-2 border rounded-md bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
      >
        {months.map(m => <option key={m.value} value={m.value}>{m.name}</option>)}
      </select>
      <select
        value={filterYear}
        onChange={(e) => setFilterYear(parseInt(e.target.value))}
        className="p-2 border rounded-md bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
      >
        {years.map(y => <option key={y} value={y}>{y}</option>)}
      </select>
    </div>
  );
};

export default FilterControls;

