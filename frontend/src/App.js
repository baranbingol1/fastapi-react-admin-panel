import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { FaStore } from 'react-icons/fa';
import Products from './components/Products';
import Categories from './components/Categories';
import Customers from './components/Customers';
import Orders from './components/Orders';
import Login from './components/Login';
import './App.css';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
  const [visibleComponents, setVisibleComponents] = useState({
    products: false,
    categories: false,
    customers: false,
    orders: false,
  });

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
  };

  const toggleComponent = (component) => {
    setVisibleComponents((prev) => ({
      ...prev,
      [component]: !prev[component],
    }));
  };

  return (
    <Router>
      <nav>
        <ul>
          <li>
            <FaStore size={32} style={{ color: '#61DAFB' }} />
          </li>
          <li>Retail Management Admin Panel</li>
          {loggedIn ? (
            <li>
              <button style={{ marginLeft: '1rem' }} onClick={handleLogout}>
                Logout
              </button>
            </li>
          ) : (
            <li>
              <Link to="/login">Login</Link>
            </li>
          )}
        </ul>
      </nav>

      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        
        <Route
          path="/"
          element={
            <PrivateRoute>
              <div className="controls">
                {!visibleComponents.products && (
                  <button onClick={() => toggleComponent('products')}>Show Products</button>
                )}
                {!visibleComponents.categories && (
                  <button onClick={() => toggleComponent('categories')}>Show Categories</button>
                )}
                {!visibleComponents.customers && (
                  <button onClick={() => toggleComponent('customers')}>Show Customers</button>
                )}
                {!visibleComponents.orders && (
                  <button onClick={() => toggleComponent('orders')}>Show Orders</button>
                )}
              </div>

              {visibleComponents.products && (
                <Products onClose={() => toggleComponent('products')} />
              )}
              {visibleComponents.categories && (
                <Categories onClose={() => toggleComponent('categories')} />
              )}
              {visibleComponents.customers && (
                <Customers onClose={() => toggleComponent('customers')} />
              )}
              {visibleComponents.orders && (
                <Orders onClose={() => toggleComponent('orders')} />
              )}
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;