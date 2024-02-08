import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ManageProducts = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [productNumbers, setProductNumbers] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [qty, setQty] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isCategoryFormVisible, setCategoryFormVisible] = useState(false);
  const [isAdditionalCardVisible, setAdditionalCardVisible] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/products?categoryId=${categoryId}`);
        const sortedProducts = response.data.sort((a, b) => a.id - b.id);

        const numbers = Array.from({ length: sortedProducts.length }, (_, index) => index + 1);

        setProducts(sortedProducts);
        setProductNumbers(numbers);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8080/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, [categoryId]);

  const goBackToProducts = () => {
    navigate('/product');
  };

  const handleUpdateProduct = async (productId) => {
    try {
      const response = await axios.get(`http://localhost:8080/products/${productId}`);
      const productDetails = response.data;

      setSelectedProduct(productDetails);
      setName(productDetails.name);
      setPrice(productDetails.price);
      setQty(productDetails.qty);

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error fetching product details:', error);
      alert('Failed to fetch product details for update.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const isConfirmed = window.confirm('Are you sure you want to delete this product?');

      if (isConfirmed) {
        await axios.delete(`http://localhost:8080/products/${productId}`);
        const response = await axios.get(`http://localhost:8080/products?categoryId=${categoryId}`);
        const sortedProducts = response.data.sort((a, b) => a.id - b.id);

        const numbers = Array.from({ length: sortedProducts.length }, (_, index) => index + 1);

        setProducts(sortedProducts);
        setProductNumbers(numbers);

        alert('Product deleted successfully.');
      } else {
        alert('Product deletion canceled.');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete the product.');
    }
  };

  const handleName = (event) => {
    setName(event.target.value);
  };

  const handlePrice = (event) => {
    setPrice(event.target.value);
  };

  const handleQty = (event) => {
    setQty(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleCategorySubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post('http://localhost:8080/categories', { name: selectedCategory });


      const response = await axios.get('http://localhost:8080/categories');
      setCategories(response.data);


      setSelectedCategory('');
      setCategoryFormVisible(false);

      alert('Category added successfully.');
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to add the category.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      name,
      price,
      qty,
      categoryId: selectedCategory,
    };

    try {
      if (selectedProduct) {
        await axios.put(`http://localhost:8080/products/${selectedProduct.id}`, data);
      } else {
        await axios.post('http://localhost:8080/products', data);
      }

      const updatedResponse = await axios.get(`http://localhost:8080/products?categoryId=${categoryId}`);
      const sortedProducts = updatedResponse.data.sort((a, b) => a.id - b.id);

      const numbers = Array.from({ length: sortedProducts.length }, (_, index) => index + 1);

      setProducts(sortedProducts);
      setProductNumbers(numbers);

      setName('');
      setPrice('');
      setQty('');
      setSelectedProduct(null);
      setCategoryFormVisible(false);

      alert(selectedProduct ? 'Product updated successfully.' : 'Product created successfully.');
    } catch (error) {
      console.error('Error creating/updating product:', error);
      alert('Failed to create/update the product.');
    }
  };

  const handleCreateProduct = () => {
    setName('');
    setPrice('');
    setQty('');
    setSelectedCategory('');
    setSelectedProduct(null);
    setCategoryFormVisible(false);
  };

  const handleToggleCategoryForm = () => {
    setCategoryFormVisible(!isCategoryFormVisible);
  };


  return (
    <>
      <nav className="navbar bg-primary" data-bs-theme="white">
        <div className="container-fluid">
          <button
            className="btn btn-outline-light"
            type="button"
            onClick={goBackToProducts}
          >
            <i className="bi bi-arrow-left"></i> Back
          </button>
        </div>
      </nav>

      <h1><i class="bi bi-clipboard-plus"></i> Manage Products</h1>

      <div className="row">
        <div className="col-md-6">
          <table className="table caption-top">
            <caption>List of Products</caption>
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col">Name</th>
                <th scope="col">Price</th>
                <th scope="col">Stock</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.id}>
                  <th scope="row">{productNumbers[index]}</th>
                  <td>{product.name}</td>
                  <td>{product.price} LKR</td>
                  <td>{product.qty} in stock</td>
                  <td>
                    <button
                      className="btn btn-success me-2"
                      onClick={() => handleUpdateProduct(product.id)}
                    ><i class="bi bi-clipboard-check"> </i>
                      Update
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteProduct(product.id)}
                    ><i class="bi bi-trash3-fill"> </i>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3>
                {isCategoryFormVisible
                  ? 'Add New Category'
                  : selectedProduct
                    ? 'Update Product'
                    : 'Add New Product'}
              </h3>
            </div>
            <div className="card-body">
              {isCategoryFormVisible ? (
                <form onSubmit={handleCategorySubmit}>
                  <div className="form-group mb-3">
                    <label>Category Name</label>
                    <input
                      type="text"
                      required
                      onChange={handleCategoryChange}
                      value={selectedCategory}
                      className="form-control"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Save Category
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-primary mt-3"
                    onClick={() => setCategoryFormVisible(false)}
                  >
                    Cancel Category Creation
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group mb-3">
                    <label>Product Name</label>
                    <input
                      type="text"
                      required
                      onChange={handleName}
                      value={name}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label>Product Price</label>
                    <input
                      type="text"
                      required
                      onChange={handlePrice}
                      value={price}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label>Product Qty</label>
                    <input
                      type="text"
                      required
                      onChange={handleQty}
                      value={qty}
                      className="form-control"
                    />
                  </div>
                  {!selectedProduct && (
                    <div className="form-group mb-3">
                      <label>Category</label>
                      <select
                        required
                        onChange={handleCategoryChange}
                        value={selectedCategory}
                        className="form-select"
                      >
                        <option>Please Select</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <button className="btn btn-primary" type="submit">
                    {selectedProduct ? 'Update Product' : 'Save Product'}
                  </button><br /><br />&nbsp;&nbsp;
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={handleCreateProduct}
                  >
                    + Add Product
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-success"
                    onClick={handleToggleCategoryForm}
                  >
                    + Add Category
                  </button>
                </form>
              )}
            </div>
          </div>

          {isAdditionalCardVisible && (
            <div className="card mt-3">
              <div className="card-header">
                <h3>Additional Card</h3>
              </div>
              <div className="card-body">

              </div>
            </div>
          )}
        </div>

      </div>
    </>
  );
};

export default ManageProducts;
