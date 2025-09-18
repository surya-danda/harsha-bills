import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CompanySummary = () => {
    const [summary, setSummary] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('https://harsha-bills.onrender.com/api/entries/reports/company-summary', {
                    headers: { 'x-auth-token': token },
                });
                setSummary(res.data);
            } catch (error) {
                console.error('Failed to fetch company summary:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, []);

    if (loading) {
        return <p>Loading company summary...</p>;
    }

    if (summary.length === 0) {
        return null;
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-center">Purchases by Company</h2>
            <ul className="space-y-2">
                {summary.map((item) => (
                    <li key={item._id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <Link 
                            to={`/company/${encodeURIComponent(item._id)}`} 
                            className="font-semibold text-gray-700 hover:text-indigo-600 hover:underline"
                        >
                            {item._id}
                        </Link>
                        <span className="font-bold text-blue-600">₹{item.totalPurchase.toFixed(2)}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CompanySummary;
