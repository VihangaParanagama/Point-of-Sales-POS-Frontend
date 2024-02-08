import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PrintableBill from './PrintableBill';

const Bill = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderDetails } = location.state || {};

  useEffect(() => {
    console.log('Order Details:', orderDetails);
  }, [orderDetails]);


  const [products, setProducts] = useState([]);

  const orderPage = () => {
    navigate("/checkout");
  };

  return (
    <div>

      {orderDetails && (
        <>
          <div>

          </div>

          <PrintableBill orderDetails={orderDetails} />
        </>
      )}


      {products.length > 0 && (
        <div>
          <h3>Products</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button
        type="button"
        className="btn btn-outline-primary"
        onClick={orderPage}
      >
        Order Page
      </button>
    </div>
  );
};

export default Bill;
