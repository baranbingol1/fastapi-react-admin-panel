import React, { useEffect, useState } from 'react';
import api from '../services/api';

function Products({ onClose }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: '',
    category_id: ''
  });

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data.products);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = async (product) => {
    setIsEditing(true);
    setFormData({
      id: product.id,
      name: product.name,
      price: product.price,
      category_id: product.category_id
    });
  };

  const handleDelete = async (id) => {
    if (!id) {
      setError('Invalid product ID');
      return;
    }
    try {
      await api.delete(`/products/${id}`);
      const updatedProducts = products.filter(product => product.id !== id);
      setProducts(updatedProducts);
    } catch (error) {
      console.error(error);
      setError('Error deleting product');
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
      await api.post('/products', {
        name: formData.name,
        price: parseFloat(formData.price),
        category_id: parseInt(formData.category_id, 10)
      });
      fetchProducts(); // refresh the product list
      setFormData({ name: '', price: '', category_id: '' }); // clear the form
    } catch (error) {
      console.error(error);
      setError('Error adding product');
    }
  };
  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <section className="component-container">
      <div className="header">
        <h2>Products</h2>
        <button onClick={onClose}>×</button>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Product Name"
          required
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Product Price"
          required
        />
        <input
          type="text"
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          placeholder="Category ID"
          required
        />
        <button type="submit">{isEditing ? 'Update' : 'Add'} Product</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
            {products.map((product) => (
              <tr key={product.product_id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.category_id}</td>
                <td>
                  <button onClick={() => handleEdit(product)}>Edit</button>
                  <button onClick={() => handleDelete(Number(product.id))}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </section>
  );
}

export default Products;