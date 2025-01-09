import React, { useEffect, useState } from 'react';
import api from '../services/api';

function Customers({ onClose }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: ''
  });

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers');
      setCustomers(res.data.customers);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleEdit = (customer) => {
    setIsEditing(true);
    setFormData({
      id: customer.customer_id,
      first_name: customer.first_name,
      last_name: customer.last_name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address
    });
  };

  const handleDelete = async (id) => {
    if (!id) {
      setError('Invalid customer ID');
      return;
    }
    try {
      await api.delete(`/customers/${id}`);
      const updatedCustomers = customers.filter(customer => customer.customer_id !== id);
      setCustomers(updatedCustomers);
    } catch (error) {
      console.error(error);
      setError('Error deleting customer');
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
        await api.put(`/customers/${formData.id}`, {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address
        });
      } else {
        await api.post('/customers', {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address
        });
      }
      fetchCustomers(); // Refresh the customer list
      setFormData({ id: '', first_name: '', last_name: '', email: '', phone: '', address: '' }); // Clear the form
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setError('Error saving customer');
    }
  };

  if (loading) return <div>Loading customers...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="component-container">
      <div className="header">
        <h2>Customers</h2>
        <button onClick={onClose}>×</button>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          placeholder="First Name"
          required
        />
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          placeholder="Last Name"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
        />
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
        />
        <button type="submit">{isEditing ? 'Update' : 'Add'} Customer</button>
        {isEditing && (
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setFormData({ id: '', first_name: '', last_name: '', email: '', phone: '', address: '' });
            }}
          >
            Cancel
          </button>
        )}
      </form>
      <table>
        <thead>
          <tr>
            <th>Customer ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((cust) => (
            <tr key={cust.customer_id}>
              <td>{cust.customer_id}</td>
              <td>{cust.first_name}</td>
              <td>{cust.last_name}</td>
              <td>{cust.email}</td>
              <td>{cust.phone}</td>
              <td>{cust.address}</td>
              <td>
                <button onClick={() => handleEdit(cust)}>Edit</button>
                <button onClick={() => handleDelete(cust.customer_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default Customers;