import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ManageCategory = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categoryDetails, setCategoryDetails] = useState({ name: '' });
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8080/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const loadCategoryDetails = async (categoryId) => {
        try {
            const response = await axios.get(`http://localhost:8080/categories/${categoryId}`);
            setCategoryDetails(response.data);
            const productsResponse = await axios.get(`http://localhost:8080/products?categoryId=${categoryId}`);
            setProducts(productsResponse.data);
        } catch (error) {
            console.error('Error fetching category details:', error);
            alert('Failed to fetch category details for update.');
        }
    };

    const handleUpdateCategory = async (categoryId) => {
        setSelectedCategory(categoryId);
        setSelectedProduct(null);
        await loadCategoryDetails(categoryId);
    };

    const handleDeleteCategory = async (categoryId) => {
        try {
            const isConfirmed = window.confirm('Are you sure you want to delete this category?');

            if (isConfirmed) {
                await axios.delete(`http://localhost:8080/categories/${categoryId}`);
                const updatedCategories = categories.filter((category) => category.id !== categoryId);
                setCategories(updatedCategories);
                setSelectedCategory('');
                setCategoryDetails({ name: '' });
                setProducts([]);
                alert('Category deleted successfully.');
            } else {
                alert('Category deletion canceled.');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Failed to delete the category.');
        }
    };

    const handleUpdateProduct = (product) => {
        setSelectedProduct(product);
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            if (selectedCategory) {
                await axios.put(`http://localhost:8080/categories/${selectedCategory}`, categoryDetails);
                const updatedCategories = categories.map((category) =>
                    category.id === selectedCategory ? { ...category, name: categoryDetails.name } : category
                );
                setCategories(updatedCategories);
                setSelectedCategory('');
                setCategoryDetails({ name: '' });
                setProducts([]);
                alert('Category updated successfully.');
            } else {
                const response = await axios.post('http://localhost:8080/categories', categoryDetails);
                const newCategory = response.data;
                setCategories([...categories, newCategory]);
                setCategoryDetails({ name: '' });
                alert('Category added successfully.');
            }
        } catch (error) {
            console.error('Error adding/updating category:', error);
            alert('Failed to add/update category.');
        }
    };


    return (
        <>
            <nav className="navbar bg-primary" data-bs-theme="white">
                <div className="container-fluid">
                    <button className="btn btn-outline-light" type="button" onClick={() => navigate('/category')}>
                        <i className="bi bi-arrow-left"></i> Back
                    </button>
                </div>
            </nav>

            <h1><i className="bi bi-clipboard-plus"></i> Manage Categories</h1>

            <div className="row">
                <div className="col-md-6">
                    <table className="table caption-top">
                        <caption>List of Categories</caption>
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Name</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => (
                                <tr key={category.id}>
                                    <td>{category.id}</td>
                                    <td>{category.name}</td>
                                    <td>
                                        <button className="btn btn-success me-2" onClick={() => handleUpdateCategory(category.id)}>
                                            <i className="bi bi-pencil"></i> Update
                                        </button>
                                        <button className="btn btn-danger" onClick={() => handleDeleteCategory(category.id)}>
                                            <i className="bi bi-trash"></i> Delete
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
                            <h3>{selectedCategory ? 'Update Category' : 'Add New Category'}</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleAddCategory}>
                                <div className="mb-3">
                                    <label htmlFor="categoryName" className="form-label">Category Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="categoryName"
                                        value={categoryDetails.name}
                                        onChange={(e) => setCategoryDetails({ name: e.target.value })} // Update category name onChange
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary">{selectedCategory ? 'Update Category' : 'Add Category'}</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ManageCategory;
