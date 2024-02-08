import { useEffect, useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';

const SingleProduct = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const getProductById = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        getProductById();
    }, [id]);

    const goBackToProducts = () => {
        navigate('/product');
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

            <div className="container mt-4">
                {product && (
                    <div className="card">
                        
                        <div className="card-body">
                            <h1 className="card-title">{product.name}</h1>
                            <p className="card-text">Product Price: {product.price} LKR</p>
                            <p className="card-text">Stock: {product.qty}</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default SingleProduct;
