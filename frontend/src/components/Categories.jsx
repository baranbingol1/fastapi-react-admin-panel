import React, { useEffect, useState } from 'react';
import api from '../services/api';

function Categories({ onClose }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: ''
  });

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.categories);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = async (category) => {
    setIsEditing(true);
    setFormData({
      id: category.category_id,
      name: category.name,
      description: category.description
    });
  };

  const handleDelete = async (id) => {
    if (!id) {
      setError('Invalid category ID');
      return;
    }
    try {
      await api.delete(`/categories/${id}`);
      const updatedCategories = categories.filter(category => category.category_id !== id);
      setCategories(updatedCategories);
    } catch (error) {
      console.error(error);
      setError('Error deleting category');
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
        await api.put(`/categories/${formData.id}`, {
          name: formData.name,
          description: formData.description
        });
      } else {
        await api.post('/categories', {
          name: formData.name,
          description: formData.description
        });
      }
      fetchCategories(); // Refresh the category list
      setFormData({ id: '', name: '', description: '' }); // Clear the form
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setError('Error saving category');
    }
  };

  if (loading) return <div>Loading categories...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="component-container">
      <div className="header">
        <h2>Categories</h2>
        <button onClick={onClose}>×</button>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Category Name"
          required
        />
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <button type="submit">{isEditing ? 'Update' : 'Add'} Category</button>
        {isEditing && <button type="button" onClick={() => { setIsEditing(false); setFormData({ id: '', name: '', description: '' }); }}>Cancel</button>}
      </form>
      <table>
        <thead>
          <tr>
            <th>Category ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.category_id}>
              <td>{category.category_id}</td>
              <td>{category.name}</td>
              <td>{category.description}</td>
              <td>
                <button onClick={() => handleEdit(category)}>Edit</button>
                <button onClick={() => handleDelete(category.category_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default Categories;