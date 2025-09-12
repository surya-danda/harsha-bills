import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useEntry } from '../context/EntryContext';
import FilterControls from '../components/FilterControls';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TransactionsPage = () => {
  const { filterYear, filterMonth } = useEntry();
  const [activeShop, setActiveShop] = useState('Ramu Fashions');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/entries/transactions', {
          headers: { 'x-auth-token': token },
          params: { shop: activeShop, year: filterYear, month: filterMonth },
        });
        
        if (Array.isArray(res.data)) {
            setData(res.data);
        } else {
            setData([]);
        }

      } catch (err) {
        setError('Failed to fetch transactions.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [activeShop, filterYear, filterMonth]);

  const renderTransactionTable = () => {
    if (loading) return <p className="text-center">Loading transactions...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (data.length === 0) {
        return <p className="text-center text-gray-500">No transactions found for this period.</p>;
    }

    return data.map(({ company, transactions }) => {
        const chartData = transactions.map(t => ({
            date: new Date(t.purchaseDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
            amount: t.purchaseAmount,
        }));

        return (
            <div key={company} className="mb-8 p-4 bg-white rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">{company}</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cash</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {transactions.map(t => {
                                const balance = t.purchaseAmount - (t.cashAmount + t.checkAmount);
                                const formatDate = (dateStr) => dateStr ? `on ${new Date(dateStr).toLocaleDateString('en-IN')}` : '';
                                return (
                                    <tr key={t._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">₹{t.purchaseAmount.toFixed(2)} <span className="text-gray-500">{formatDate(t.purchaseDate)}</span></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">₹{t.cashAmount.toFixed(2)} <span className="text-gray-500">{formatDate(t.cashDate)}</span></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">₹{t.checkAmount.toFixed(2)} <span className="text-gray-500">{formatDate(t.checkDate)}</span></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">₹{balance.toFixed(2)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="mt-6" style={{ height: '200px' }}>
                    <h4 className="text-md font-semibold text-center mb-2 text-gray-600">Purchase Trend</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                            <Legend />
                            <Bar dataKey="amount" fill="#8884d8" name="Purchase Amount" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        );
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Company Transactions</h1>
      <FilterControls />
      <div className="mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveShop('Ramu Fashions')}
              className={`${activeShop === 'Ramu Fashions' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Ramu Fashions
            </button>
            <button
              onClick={() => setActiveShop('Ramu Readymade')}
              className={`${activeShop === 'Ramu Readymade' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Ramu Readymade
            </button>
          </nav>
        </div>
        <div className="mt-6">{renderTransactionTable()}</div>
      </div>
    </div>
  );
};

export default TransactionsPage;

