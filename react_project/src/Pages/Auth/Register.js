import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [fullName, setFullname] = useState("");

  const navigate = useNavigate();

  const handleUsername = (event) => {
    setUsername(event.target.value);
  }

  const handlePassword = (event) => {
    setPassword(event.target.value);
  }

  const handleEmail = (event) => {
    setEmail(event.target.value);
  }

  const handleFullName = (event) => {
    const value = event.target.value;
    if (/^[a-zA-Z\s]+$/.test(value) || value === "") {
      setFullname(value);
    } else {
      alert("Invalid characters in Full Name. Only letters and spaces are allowed.");
    }
  };

  const handleAddress = (event) => {
    setAddress(event.target.value);
  }

  const handleMobile = (event) => {
    const value = event.target.value;
    if (/^\d{0,10}$/.test(value) || value === "") {
      setMobile(value);
    } else {
      alert("Invalid characters in Mobile. Only digits are allowed.");
    }
  };



  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.get(`http://localhost:8080/auth/check-existence?username=${username}&email=${email}`);
      console.log(response.data);

      if (response.data.usernameExists || response.data.emailExists) {
        if (response.data.usernameExists) {
          alert("change usernamw");
        } if (response.data.emailExists)
          alert("change email");
      }
      else {
        const data = {
          username: username,
          password: password,
          email: email,
          mobile: mobile,
          address: address,
          fullName: fullName,

        };
        const response1 = await axios.post(`http://localhost:8080/auth/register`, data);
        console.log(response1.data)
        navigate("/login");
      }

    } catch (error) {
      if (error.response && error.response.status === 401) {

        navigate("/login");
      } else {
        console.error("Error:", error.message);

      }
    }
  };


  return (
    <div className="card">
      <div className="card-body">
        <div className="login-box">
          <div className="text-center mb-5">
            <h1>User Register</h1>
          </div>
          <form onSubmit={handleRegister}>
            <div className="form-group mb-3">
              <label htmlFor="fullname">Full Name</label>
              <input
                type="text"
                id="fullname"
                className="form-control"
                onChange={handleFullName}
                placeholder="Full Name"
                required
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                className="form-control"
                onChange={handleEmail}
                placeholder="Email Address"
                required
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                className="form-control"
                onChange={handleAddress}
                placeholder="Address"
                required
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="mobile">Mobile Number</label>
              <input
                type="tel"
                id="mobile"
                className="form-control"
                onChange={handleMobile}
                placeholder="Mobile Number"
                required
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                className="form-control"
                onChange={handleUsername}
                placeholder="Username"
                required
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="form-control"
                onChange={handlePassword}
                placeholder="Password"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>

  );



}

export default Register;