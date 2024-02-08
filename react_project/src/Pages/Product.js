import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from './logo.jpg'

const Product = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [products, setProducts] = useState(null);
  const [categories, setCategories] = useState(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState(0);
  const [categoryId, setCategoryId] = useState("");
  const [uname, setuName] = useState(null);

  useEffect(() => {
    getProducts();
    getCategories();
    func();
  }, []);

  const func = () => {
    setuName(localStorage.getItem('user'));
  };

  const navigate = useNavigate();

  const getProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/products");
      setProducts(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/login");
      }
    }
  };

  const getCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8080/categories");
      setCategories(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/login");
      }
    }
  };


  const handleViewProduct = (productId) => {
    navigate(`/SingleProduct/${productId}`);
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleButtonClick = (buttonType) => {
    switch (buttonType) {
      case "dashboard":
        navigate("/home");
        break;
      case "category":
        navigate("/category");
        break;
      case "products":
        navigate("/product");
        break;
      case "orders":
        navigate("/checkout");
        break;
      case "summary":
        navigate("/summary");
        break;
      default:
        console.log(`${buttonType} button clicked`);
    }


    setIsNavOpen(false);
  };

  const ManageProduct = () => {
    navigate("/manageproducts");
  };

  const Logout = async () => {
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar bg-primary fixed-top" data-bs-theme="white">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
            aria-label="Toggle navigation"
            onClick={toggleNav}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className='logoImage'>
            <img src={logo} alt="Logoe" />

          </div>
          <div class="parent-container">
            <div class="h5">
              <h6><i class="bi bi-person-circle"></i> Hi {uname}</h6>
            </div>
          </div>


        </div>
      </nav>

      <h1>Product</h1>

      <div className="container">
        <div
          className={`offcanvas offcanvas-start ${isNavOpen ? "show" : ""}`}
          tabIndex="-1"
          id="offcanvasNav"
          aria-labelledby="offcanvasNavLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasNavLabel">
              Main Menu
            </h5>
            <button
              type="button"
              className="btn-close text-reset"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
              onClick={toggleNav}
            ></button>
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav">
              <li className="nav-item">
                <button
                  type="button"
                  className="btn-offcanvas "
                  onClick={() => handleButtonClick("dashboard")}
                ><i class="bi bi-house-fill" > </i>
                  Dashboard
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className="btn-offcanvas"
                  onClick={() => handleButtonClick('category')}
                ><i class="bi bi-list-ul"> </i>
                  Category
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className="btn-offcanvas"
                  onClick={() => handleButtonClick("products")}
                ><i class="bi bi-stack"> </i>
                  Products
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className="btn-offcanvas"
                  onClick={() => handleButtonClick("orders")}
                ><i class="bi bi-cart-plus-fill"> </i>
                  Orders
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className="btn-offcanvas"
                  onClick={() => handleButtonClick("summary")}
                ><i class="bi bi-grid-1x2-fill"> </i>
                  Summary
                </button>
              </li>
            </ul>

            <br /><br /><br /><br /><br /><br /><br /><br /><br />

            <div className='col-md-8'>
              <button
                className="btn btn-primary"
                onClick={() => Logout()}
              >
                <i className="bi bi-box-arrow-right"></i> Logout
              </button>

            </div>
          </div>
          <div></div>
        </div>
      </div>

      <br />
      <h2><i class="bi bi-archive-fill"> </i>Products</h2>
      <div className="container">
        <div className="row">
          {products &&
            products.map((product) => (
              <div
                key={product.id}
                className="col-lg-4 col-md-6 col-12 mb-4"
              >
                <div className="card" style={{ width: "22rem", margin: "10px" }}>

                  <div className="card-body">
                    <h3 className="card-title">{product.name}</h3>
                    <h4>
                      <span className="badge bg-secondary">
                        {product.categoryEntity?.name}
                      </span>
                    </h4>
                    <p className="card-text">Price: {product.price} LKR</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <h4>
                        <span
                          className={`badge ${product.qty === 0
                            ? "bg-danger"
                            : product.qty < 10
                              ? "bg-warning"
                              : "bg-success"
                            }`}
                        >
                          {product.qty === 0
                            ? "Out of Stock"
                            : product.qty < 10
                              ? "Low Stock"
                              : "In Stock"}
                        </span>
                      </h4>
                      {product.qty > 0 && (
                        <button
                          onClick={() => handleViewProduct(product.id)}
                          className="btn btn-primary"
                        >
                          View Product
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <button
        type="button"
        className="btn btn-outline-primary"
        onClick={ManageProduct}
      >
        + Manage Products
      </button>
    </>
  );
};

export default Product;
