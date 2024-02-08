import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from './logo.jpg'
import PrintableBill from "./PrintableBill";

const Checkout = () => {
  const [products, setProducts] = useState(null);
  const [orderProducts, setOrderProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [quantityInput, setQuantityInput] = useState({});
  const [customerId, setCustomerId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [showCustomerForm, setShowCustomerForm] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState(null);
  const [productTotal, setProductTotal] = useState(null);
  const [printableBillDetails, setPrintableBillDetails] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const navigate = useNavigate();

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const func = () => {
    setUserId(localStorage.getItem('userId'));
  };

  const setUname = () => {
    setName(localStorage.getItem('user'));
  };

  useEffect(() => {
    getProducts();
    getCustomers();
    func();
    setUname();
  }, []);

  useEffect(() => {
    setTax((total / 100) * 15);
    if (customerId) {
      getCustomerDetails();
    }
  }, [total, customerId]);

  const getProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/products");


      const filteredProducts = response.data.filter(product => product.qty > 0);

      setProducts(filteredProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const getCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/customers");
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const getCustomerDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/customers/${customerId}`);
      const { name, mobile, email } = response.data;
      setCustomerName(name);
      setCustomerMobile(mobile);
      setCustomerEmail(email);
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  };

  const createOrder = async () => {
    try {
      if (orderProducts.length === 0) {
        alert('Please add products to your order before placing it.');
        return;
      }

      const insufficientStockProducts = orderProducts.filter(
        (item) => item.qty > getStockQuantity(item.id)
      );

      if (insufficientStockProducts.length > 0) {
        const alertMessage = insufficientStockProducts.map(
          (item) =>
            `Not enough stock for ${item.name}. \nAvailable stock : ${getStockQuantity(item.id)}\n`
        );

        alert(alertMessage.join('\n'));
        return;
      }


      const products = orderProducts.map((item) => ({
        productId: item.id,
        quantity: item.qty,
      }));

      const data = {
        customerId: customerId,
        products: products,
        userId: userId,
      };

      const response = await axios.post("http://localhost:8080/orders", data);

      if (response.status === 201) {
        setOrderProducts([]);
        setTotal(0);
        setTax(0);
        setCustomerId("");
        setCustomerName("");
        setCustomerMobile("");
        setCustomerEmail("");
        setShowCustomerForm(true);


        const orderDetails = {
          billFrom: {
            companyName: 'E-Seller',

          },
          billTo: {
            customerName: customerName,
            streetAddress: customerEmail,
            city: customerMobile,
          },
          items: orderProducts.map((product) => ({
            name: product.name,
            quantity: product.qty,
            price: product.price,
            total: product.qty * product.price,
          })),
          totalAmount: total,
        };


        setPrintableBillDetails(orderDetails);
        console.log("Order Details:", orderDetails);

        setOrderPlaced(true);

        navigate(`/bill`, { state: { orderDetails } });
      } else {

      }
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const getStockQuantity = (productId) => {

    const product = products.find((p) => p.id === productId);
    return product ? product.qty : 0;
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
        setShowCustomerForm(true);
        break;
      case "summary":
        navigate("/summary");
        break;
      default:
        console.log(`${buttonType} button clicked`);
    }
  };


  const handleQuantityInputChange = (productId, event) => {
    setQuantityInput({ ...quantityInput, [productId]: event.target.value });
  };

  const handleAddToOrder = (product) => {
    const qty = quantityInput[product.id] || 0;

    if (qty > 0) {
      const existingProductIndex = orderProducts.findIndex((item) => item.id === product.id);
      if (existingProductIndex !== -1) {
        const updatedOrderProducts = [...orderProducts];
        let newQty = parseInt(updatedOrderProducts[existingProductIndex].qty) + parseInt(qty);
        updatedOrderProducts[existingProductIndex].qty = newQty;
        setOrderProducts(updatedOrderProducts);
      } else {
        const updatedOrderProducts = [...orderProducts, { ...product, qty }];
        setOrderProducts(updatedOrderProducts);
      }

      let pTotal = (product.price) * qty
      setProductTotal(pTotal)

      let currentTotal = parseInt(total) + parseInt(product.price) * qty;
      setTotal(currentTotal);

      setQuantityInput({ ...quantityInput, [product.id]: "" });
      setWarningMessage("");
    } else {
      setWarningMessage("Please add a quantity greater than 0.");
    }
  };

  const toggleCustomerForm = () => {
    setShowCustomerForm(!showCustomerForm);
  };

  const handleBackToCustomerForm = () => {
    setShowCustomerForm(true);
  };

  const AddCustomer = () => {
    navigate('/customer');
  };

  const handleCancelProduct = (productId) => {
    const updatedOrderProducts = orderProducts.filter((product) => product.id !== productId);
    setOrderProducts(updatedOrderProducts);

  };

  const handleClearOrder = () => {
    setOrderProducts([]);
    setTotal(0);
    setTax(0);
  };

  const Logout = async () => {
    navigate("/login");
  };

  return (
    <>
      <div className="row">
        <div className="col-md-6">

        </div>
        <div className="col-md-6"></div>
      </div>

      <div>
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
            <div>
              <div className='logoImage'>
                <img src={logo} alt="Logo" />
              </div>
            </div>
            <div class="parent-container">
              <div class="h5">
                <h6><i class="bi bi-person-circle"></i> Hi {name}</h6>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <div>
        <div className="container">
          <div
            className={`offcanvas offcanvas-start ${isNavOpen ? 'show' : ''}`}
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
                    className="btn-offcanvas"
                    onClick={() => handleButtonClick('dashboard')}
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
                    onClick={() => handleButtonClick('products')}
                  ><i class="bi bi-stack"> </i>
                    Products
                  </button>
                </li>

                <li className="nav-item">
                  <button
                    type="button"
                    className="btn-offcanvas"
                    onClick={() => handleButtonClick('orders')}
                  ><i class="bi bi-cart-plus-fill"> </i>
                    Orders
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    className="btn-offcanvas"
                    onClick={() => handleButtonClick('summary')}
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
      </div>
      <br /><br />
      <br />
      <h2><i class="bi bi-cart-plus-fill"></i>Order</h2>
      <div className="container-fluid">
        {showCustomerForm ? (
          <div class="card">
            <div class="card-body">
              <h1>Select Customer </h1>
              <form>
                <label><strong>Customer Name : </strong>
                  <select
                    value={customerId}
                    onChange={(e) => {
                      setCustomerId(e.target.value);
                    }}
                  >
                    <option value="">Select a customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </label>
                <br />
                <br />
                {customerId && (
                  <>
                    <label><strong>Mobile : </strong>
                      <span>{customerMobile}</span>
                    </label>
                    <br />
                    <label><strong>Email : </strong>
                      <span>{customerEmail}</span>
                    </label>
                    <br />
                    <br />
                  </>
                )}
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => {
                    if (customerId) {
                      toggleCustomerForm();
                    } else {
                      setWarningMessage("Please select or add a customer.");
                    }
                  }}
                >
                  Continue
                </button>
                <label id="" className="invisible">Test</label>
                <button
                  type="button"
                  className="btn btn-outline-info"
                  onClick={AddCustomer}
                ><i class="bi bi-person-plus"></i>
                  + Add Customer
                </button>
              </form>
            </div>
          </div>

        ) : (
          <div className="row mt-5">
            <div className="col-md-6">
              <h2>Products</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products &&
                    products.map((product, index) => (
                      <tr key={product.id}>
                        <th scope="row">{index + 1}</th>
                        <td>{product.name}</td>
                        <td>{product.price} LKR</td>
                        <td>
                          <input
                            className="InputQty"
                            type="number"
                            value={quantityInput[product.id] || ""}
                            onChange={(e) => handleQuantityInputChange(product.id, e)}
                          />
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleAddToOrder(product)}
                          ><i class="bi bi-plus-square"> </i>
                            Add to Order
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

            </div>

            <div className="col-md-6">
              <div className="row">
                <div className="col-md-12">
                  {customerId && (
                    <div className="col-md-6">
                      <h2>Customer Details</h2>
                      <p>
                        <strong>Name :</strong> {customerName}
                      </p>
                      <p>
                        <strong>Mobile :</strong> {customerMobile}
                      </p>
                      <p>
                        <strong>Email :</strong> {customerEmail}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <h2>Order</h2>
                  <table className="table table-striped">
                    <thead>
                      {warningMessage && (
                        <p style={{ color: "red" }}>{warningMessage}</p>
                      )}
                      <tr>
                        <th>Product ID</th>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Product Total</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderProducts &&
                        orderProducts.map((product) => (
                          <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>
                              <label>{product.qty || ""}</label>
                            </td>
                            <td>
                              <label>{(product.price) * product.qty || ""}</label>
                            </td>
                            <td>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleCancelProduct(product.id)}
                              ><i class="bi bi-trash3-fill"> </i>
                                Cancel
                              </button>
                            </td>
                          </tr>
                        ))}
                      <tr>
                        <td colSpan={6}>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={handleClearOrder}
                          ><i class="bi bi-trash"> </i>
                            Clear Order
                          </button>
                        </td>
                      </tr>
                    </tbody>
                    <thead>
                      <tr>
                        <th colSpan={2}>Grand Total</th>
                        <th>{total}</th>
                      </tr>
                      <tr>
                        <th colSpan={2}>Tax</th>
                        <th>{tax}</th>
                      </tr>
                    </thead>
                  </table>

                  <br />
                  <button
                    className="btn btn-outline-secondary"
                    onClick={handleBackToCustomerForm}
                  ><i class="bi bi-arrow-left-circle-fill"> </i>
                    Back to Customer Form
                  </button>

                  <button
                    className="btn btn-sm btn-primary btn-table-bottom"
                    onClick={createOrder}
                  ><i class="bi bi-bag-check-fill"> </i>
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
        }
      </div>



      {printableBillDetails && (
        <PrintableBill orderDetails={printableBillDetails} />
      )}
    </>
  );
};

export default Checkout;
