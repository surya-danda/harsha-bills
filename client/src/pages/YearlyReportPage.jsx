import React, { useState, useEffect } from 'react';
import axios from 'axios';

const YearlyReportPage = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [fashionsData, setFashionsData] = useState([]);
  const [readymadeData, setReadymadeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      console.log(`%cFetching report for year: ${year}`, 'color: blue; font-weight: bold;');
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://harsha-bills.onrender.com/api/entries/reports/yearly-company', {
          headers: { 'x-auth-token': token },
          params: { year },
        });
        
        console.log('%cData received from server:', 'color: green;', res.data);

        // Defensively set state, ensuring we always have arrays
        setFashionsData(Array.isArray(res.data.fashions) ? res.data.fashions : []);
        setReadymadeData(Array.isArray(res.data.readymade) ? res.data.readymade : []);

      } catch (err) {
        setError('Failed to fetch yearly report.');
        console.error("%cError fetching yearly report:", 'color: red;', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [year]);

  const renderShopSection = (title, data, colorClass) => {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className={`text-2xl font-bold ${colorClass} mb-4`}>{title}</h2>
        {data.length === 0 ? (
          <p>No transactions found for this year.</p>
        ) : (
          data.map(({ company, monthlyTotals, totalPurchase }) => (
            <div key={company} className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800">{company} - <span className="font-bold text-blue-600">Total: ₹{totalPurchase.toFixed(2)}</span></h3>
              <div className="overflow-x-auto border rounded-lg mt-2">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
                        <th key={month} className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">{month}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    <tr>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(monthIndex => {
                        const monthData = monthlyTotals.find(m => m.month === monthIndex);
                        return (
                          <td key={monthIndex} className="px-4 py-2 text-center text-sm">
                            {monthData ? `₹${monthData.total.toFixed(2)}` : '₹0.00'}
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Yearly Company Report</h1>
        <div className="flex items-center gap-2">
          <label htmlFor="year-select" className="font-medium">Select Year:</label>
          <select 
            id="year-select"
            value={year} 
            onChange={(e) => setYear(Number(e.target.value))}
            className="p-2 border border-gray-300 rounded-md"
          >
            {[...Array(5)].map((_, i) => {
                const y = new Date().getFullYear() - i;
                return <option key={y} value={y}>{y}</option>
            })}
          </select>
        </div>
      </div>

      {loading && <p className="text-center">Loading report...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      
      {!loading && !error && (
        <div className="space-y-8 mt-6">
          {renderShopSection('Ramu Fashions', fashionsData, 'text-purple-700')}
          {renderShopSection('Ramu Readymade', readymadeData, 'text-green-700')}
        </div>
      )}
    </div>
  );
};

export default YearlyReportPage;

