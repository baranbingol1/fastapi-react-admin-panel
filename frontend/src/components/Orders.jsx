import React, { useEffect, useState } from 'react';
import api from '../services/api';

function Orders({ onClose }) {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    customer_id: '',
    order_date: '',
    total_amount: '',
    status: ''
  });

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data.orders);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers');
      setCustomers(res.data.customers);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchOrders();
      await fetchCustomers();
    };
    fetchData();
  }, []);

  const handleEdit = (order) => {
    setIsEditing(true);
    setFormData({
      id: order.order_id,
      customer_id: order.customer_id,
      order_date: order.order_date,
      total_amount: order.total_amount,
      status: order.status
    });
  };

  const handleDelete = async (id) => {
    if (!id) {
      setError('Invalid order ID');
      return;
    }
    try {
      await api.delete(`/orders/${id}`);
      const updatedOrders = orders.filter(order => order.order_id !== id);
      setOrders(updatedOrders);
    } catch (error) {
      console.error(error);
      setError('Error deleting order');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/orders/${formData.id}`, {
          customer_id: parseInt(formData.customer_id, 10),
          order_date: formData.order_date,
          total_amount: parseFloat(formData.total_amount),
          status: formData.status
        });
      } else {
        await api.post('/orders', {
          customer_id: parseInt(formData.customer_id, 10),
          order_date: formData.order_date,
          total_amount: parseFloat(formData.total_amount),
          status: 'pending' // default status
        });
      }
      fetchOrders(); // Refresh the order list
      setFormData({ id: '', customer_id: '', order_date: '', total_amount: '', status: '' }); // Clear the form
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setError('Error saving order');
    }
  };

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="component-container">
      <div className="header">
        <h2>Orders</h2>
        <button onClick={onClose}>×</button>
      </div>
      <form onSubmit={handleSubmit}>
        <select
          name="customer_id"
          value={formData.customer_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Customer</option>
          {customers.map(customer => (
            <option key={customer.customer_id} value={customer.customer_id}>
              {customer.first_name} {customer.last_name}
            </option>
          ))}
        </select>
        <input
          type="date"
          name="order_date"
          value={formData.order_date}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="total_amount"
          value={formData.total_amount}
          onChange={handleChange}
          placeholder="Total Amount"
          required
          min="0"
          step="0.01"
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value="">Select Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button type="submit">{isEditing ? 'Update' : 'Add'} Order</button>
        {isEditing && (
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setFormData({ id: '', customer_id: '', order_date: '', total_amount: '', status: '' });
            }}
          >
            Cancel
          </button>
        )}
      </form>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer ID</th>
            <th>Order Date</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.order_id}>
              <td>{order.order_id}</td>
              <td>{order.customer_id}</td>
              <td>{new Date(order.order_date).toLocaleDateString()}</td>
              <td>${order.total_amount.toFixed(2)}</td>
              <td>{order.status}</td>
              <td>
                <button onClick={() => handleEdit(order)}>Edit</button>
                <button onClick={() => handleDelete(order.order_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default Orders;