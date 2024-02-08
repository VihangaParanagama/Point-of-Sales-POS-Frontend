import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom"; // Import useNavigate

import axios from "axios";

const Customer = () => {
    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
        email: "",
    });

    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {

    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);


        axios.post("http://localhost:8080/customers", formData)
            .then(response => {
                console.log("Response:", response.data);
                navigate("/checkout");

            })
            .catch(error => {
                console.error("Error:", error);

            });
    };

    const goBackToProducts = () => {
        navigate('/checkout');
    };

    return (
        <>

            <nav className="navbar bg-primary fixed-top" data-bs-theme="white">
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

            <h2>Customer</h2>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Customer Register</h5>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="mobile" className="form-label">Mobile</label>
                            <input
                                type="text"
                                className="form-control"
                                id="mobile"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Customer;
