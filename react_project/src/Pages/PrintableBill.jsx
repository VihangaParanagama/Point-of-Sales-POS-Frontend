import React from 'react';

const PrintableBill = ({ orderDetails }) => {
  console.log('Order Details:', orderDetails);

  if (!orderDetails) {
    console.error('Order details not available.');
    return null;
  }

  const { billFrom, billTo, items, totalAmount } = orderDetails;


  if (!billFrom || !billTo || !items || isNaN(totalAmount)) {
    console.error('Invalid order details structure.');
    return null;
  }

  return (
    <div className="container mt-5 d-flex justify-content-center align-items-center">
      <div className="row">
        <div className="col-md-100 offset-md-1">
          <h2 className="text-center mb-4">   Invoice</h2>
          <div className="border p-4" style={{ fontSize: '18px', lineHeight: '1.6', borderWidth: '2px', width: '120%' }}>
            <div className="row mb-4">
              <div className="col-md-6">
                <p>Bill From:</p>
                <address>
                  <strong>{billFrom.companyName}</strong><br />
                  <br />
                </address>
              </div>
              <div className="col-md-6 text-md-end">
                <p>Bill To:</p>
                <address>
                  <strong>{billTo.customerName}</strong><br />
                  {billTo.streetAddress}<br />
                  {billTo.city}, <br />
                </address>
              </div>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price.toFixed(2)}</td>
                    <td>{item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="row">
              <div className="col-md-6">
                <p className="fw-bold">Total Amount:</p>
              </div>
              <div className="col-md-6 text-md-end">
                <p>{totalAmount.toFixed(2)}</p>
              </div>
            </div>
            <div className="text-end mt-4">
              <button onClick={() => window.print()}>Print</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintableBill;
