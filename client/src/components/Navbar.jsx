import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { token, logout } = useAuth();

  const activeLinkStyle = {
    color: '#4f46e5',
    borderBottom: '2px solid #4f46e5',
  };

  const authLinks = (
    <>
      <NavLink to="/" className="text-gray-600 hover:text-indigo-600 py-2" style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}>
        Dashboard
      </NavLink>
      <NavLink to="/yearly-report" className="text-gray-600 hover:text-indigo-600 py-2" style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}>
        Yearly Report
      </NavLink>
      <button onClick={logout} className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700">
        Logout
      </button>
    </>
  );

  const guestLinks = (
    <>
      <Link to="/login" className="text-gray-600 hover:text-indigo-600">Login</Link>
      <Link to="/register" className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
        Register
      </Link>
    </>
  );

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between h-auto md:h-16 py-2">
          <Link to="/" className="text-2xl font-bold text-indigo-600 mb-2 md:mb-0">
            BillManager
          </Link>
          <div className="flex items-center space-x-4 md:space-x-6 text-sm sm:text-base">
            {token ? authLinks : guestLinks}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

