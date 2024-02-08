import './App.scss';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Product from './Pages/Product';
import Home from './Pages/Home';
import SingleProduct from './Pages/SingleProduct';
import Checkout from './Pages/Checkout';
import Register from './Pages/Auth/Register';
import Login from './Pages/Auth/Login';
import ProtectedRoutes from './Utils/ProtectedRoutes';
import ManageProducts from './Pages/ManageProduct';
import Customer from './Pages/Customer';
import Summary from './Pages/Summary';
import Bill from './Pages/Bill';
import Category from './Pages/Category';
import ManageCategory from './Pages/ManageCategory';


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route
          path="/"
          element={<ProtectedRoutes />}
        >
          <Route index element={<Home />} />
          <Route path="/product" element={<Product />} />
          <Route path="/SingleProduct/:id" element={<SingleProduct />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/home" element={<Home />} />
          <Route path="/manageproducts" element={<ManageProducts />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/category" element={<Category />} />
          <Route path="/managecategory" element={<ManageCategory />} />
          <Route path="/bill" element={<Bill />} />
        </Route>

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;