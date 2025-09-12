import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const CompanyPage = () => {
  const { companyName } = useParams();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanyEntries = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/entries/company/${encodeURIComponent(companyName)}`, {
          headers: { 'x-auth-token': token },
        });
        setEntries(res.data);
      } catch (err) {
        setError('Failed to fetch company details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyEntries();
  }, [companyName]);

  if (loading) {
    return <p className="text-center">Loading details for {companyName}...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  const totalPurchase = entries.reduce((acc, entry) => acc + entry.purchaseAmount, 0);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <Link to="/" className="text-indigo-600 hover:underline mb-4 inline-block">&larr; Back to Dashboard</Link>
      <h1 className="text-3xl font-bold mb-2">{decodeURIComponent(companyName)}</h1>
      <p className="text-lg text-gray-600 mb-6">Total Purchases: <span className="font-bold text-blue-600">₹{totalPurchase.toFixed(2)}</span></p>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2">Purchase History</h2>
        {entries.length > 0 ? (
          entries.map(entry => (
            <div key={entry._id} className="bg-gray-50 p-4 rounded-lg">
              <p><strong>Date:</strong> {new Date(entry.purchaseDate).toLocaleDateString('en-IN')}</p>
              <p><strong>Amount:</strong> ₹{entry.purchaseAmount.toFixed(2)}</p>
              <p><strong>Department:</strong> {entry.department}</p>
            </div>
          ))
        ) : (
          <p>No purchase history found.</p>
        )}
      </div>
    </div>
  );
};

export default CompanyPage;