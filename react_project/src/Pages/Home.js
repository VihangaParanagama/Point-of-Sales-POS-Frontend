import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import logo from './logo.jpg'
import axios from 'axios';

const Home = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [name, setName] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [totalSales, setTotalSales] = useState(null);
  const [orderqtyT, setorderqtyT] = useState(null);
  const [utotalsales, setutotalsales] = useState(null);
  const [utotalorderqty, setutotalorderqty] = useState(null);
  const [todayutotalorderqty, settodayutotalorderqty] = useState(null);
  const [todayTotOrders, settodayTotOrders] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/login');
    }
    func();
    getUserDetails();
    getTodaysales();
    getUserSales();

  }, []);

  const func = () => {
    setName(localStorage.getItem('user'));
    setUserId(localStorage.getItem('userId'));
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleButtonClick = (buttonType) => {
    switch (buttonType) {
      case 'dashboard':
        navigate('/home');
        break;
      case 'products':
        navigate('/product');
        break;
      case 'orders':
        navigate('/checkout');
        break;
      case 'summary':
        navigate('/summary');
      case 'category':
        navigate('/category');
        break;
      default:
        console.log(`${buttonType} button clicked`);
    }
  };

  const getTodaysales = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/orders/details?date=${getCurrentDate()}`);

      if (response.status === 200) {
        const todaySales = response.data;

        const calculatedTotalSales = todaySales.reduce((total, sale) => total + sale.total, 0);
        setTotalSales(calculatedTotalSales);

        const numberOfOrders = todaySales.length;
        console.log(numberOfOrders);
        setorderqtyT(numberOfOrders);


      } else {
        console.error('Failed to fetch today sales data.');
      }
    } catch (error) {
      console.error('Error fetching today sales data:', error);
    }
  };
  const getUserSales = async () => {
    try {
      let userId = localStorage.getItem('userId');
      const response = await axios.get(`http://localhost:8080/orders/details?userId=${userId}`);

      const responseq = await axios.get(`http://localhost:8080/orders/details?userId=${userId}&date=${getCurrentDate()}`);

      if (response.status === 200 || responseq.status === 200) {
        const userSales = response.data;
        const tuserSales = responseq.data;

        const totalUserSales = userSales.reduce((total, sale) => total + sale.total, 0);
        console.log('Total sales for user with ID', userId, ':', totalUserSales);
        setutotalsales(totalUserSales)

        const numberOfSales = userSales.length;
        console.log(numberOfSales);
        setutotalorderqty(numberOfSales);

        const TodaytotalUserSales = tuserSales.reduce((total, sale) => total + sale.total, 0);
        console.log('Today Total sales for user with ID', userId, ':', TodaytotalUserSales);
        settodayutotalorderqty(TodaytotalUserSales)

        const numberOfSalestoday = tuserSales.length;
        console.log(numberOfSalestoday);
        settodayTotOrders(numberOfSalestoday);

        return totalUserSales;
      } else {
        console.error('Failed to fetch user sales data.');
        return null;
      }
    } catch (error) {
      console.error('Error fetching user sales data:', error);
      return null;
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getUserDetails = async () => {
    try {
      let userId = localStorage.getItem('userId');
      const response = await axios.get(`http://localhost:8080/user/${userId}`);
      setUserDetails(response.data);
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
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
            <img src={logo} alt="Logo" />
          </div>
          <div className="parent-container">
            <div className="h5">

              <h6><i class="bi bi-person-circle"></i> Hi {name}</h6>
            </div>
          </div>
        </div>
      </nav>

      <h1>Home</h1>

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
                  className="btn-offcanvas "
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

        </div>
      </div>

      <br />
      <h2><i class="bi bi-grid-fill"> </i>  Dashboard</h2>

      <div className="container">
        <div className="row">

          <div className="col-lg-6 col-md-8 col-12 mb-4">
            <div className="card mt-4 bg-primary text-white" style={{ width: "80%", fontSize: "1.5rem" }}>
              <div className="card-body">
                <h5 className="card-title">Today's Total Sales</h5>
                {totalSales !== null ? (
                  <p className="card-text">{totalSales} LKR</p>
                ) : (
                  <p className="card-text">Loading...</p>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-8 col-12 mb-4">
            <div className="card mt-4 bg-primary text-white" style={{ width: "80%", fontSize: "1.5rem" }}>
              <div className="card-body">
                <h5 className="card-title">Today's Total Orders</h5>
                {totalSales !== null ? (
                  <p className="card-text"> {orderqtyT}</p>
                ) : (
                  <p className="card-text">Loading...</p>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-8 col-12 mb-4">
            <div className="card mt-4 bg-success text-white" style={{ width: "80%", fontSize: "1.5rem" }}>
              <div className="card-body">
                <h5 className="card-title">My Total Sales</h5>
                {totalSales !== null ? (
                  <p className="card-text"> {utotalsales} LKR</p>
                ) : (
                  <p className="card-text">Loading...</p>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-8 col-12 mb-4">
            <div className="card mt-4 bg-success text-white" style={{ width: "80%", fontSize: "1.5rem" }}>
              <div className="card-body">
                <h5 className="card-title">My Total Orders</h5>
                {totalSales !== null ? (
                  <p className="card-text"> {utotalorderqty} </p>
                ) : (
                  <p className="card-text">Loading...</p>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-8 col-12 mb-4">
            <div className="card mt-4 bg-success text-white" style={{ width: "80%", fontSize: "1.5rem" }}>
              <div className="card-body">
                <h5 className="card-title">Today My Total Sales</h5>
                {totalSales !== null ? (
                  <p className="card-text"> {todayutotalorderqty} LKR</p>
                ) : (
                  <p className="card-text">Loading...</p>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-md-8 col-12 mb-4">
            <div className="card mt-4 bg-success text-white" style={{ width: "80%", fontSize: "1.5rem" }}>
              <div className="card-body">
                <h5 className="card-title">Today My Total Orders</h5>
                {totalSales !== null ? (
                  <p className="card-text"> {todayTotOrders} </p>
                ) : (
                  <p className="card-text">Loading...</p>
                )}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h4 className="card-title"><i class="bi bi-person-lines-fill"> </i>User Details</h4>
              {userDetails && (
                <>
                  <p className="card-text"><strong>Username : </strong>{userDetails.username}</p>
                  <p className="card-text"><strong>Email :</strong>  {userDetails.email}</p>
                  <p className="card-text"><strong>Mobile : </strong>  {userDetails.mobile}</p>
                  <p className="card-text"><strong>Address : </strong> {userDetails.address}</p>
                  <p className="card-text"><strong>Full Name :</strong> {userDetails.fullName}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
