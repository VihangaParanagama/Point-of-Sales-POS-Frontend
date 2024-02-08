import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
  }, []);

  const handleUsername = (event) => {
    setUsername(event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const data = {
      username: username,
      password: password,
    };

    try {
      const response = await axios.post("http://localhost:8080/auth/login", data);

      if (response.status === 200) {

        localStorage.setItem("token", response.data);
        console.log(response.data);

        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data}`;

        const response2 = await axios.get(`http://localhost:8080/users/${username}`);
        console.log(response2.data);

        localStorage.setItem('user', response2.data.fullName);
        localStorage.setItem('userId', response2.data.id);


        navigate("/");
      }
    } catch (error) {

      console.log("Login error:", error);
      alert('Username or Password Incorrect');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 mx-auto" style={{ maxWidth: "400px" }}>
        <div className="text-center mb-4">
          <h1>User Login</h1>
        </div>
        <form onSubmit={handleLogin}>

          <div className="mb-3">

            <input
              type="text"
              className="form-control"
              onChange={handleUsername}
              placeholder="Username"
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              onChange={handlePassword}
              placeholder="Password"
              required
            />
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </div>
        </form>
        <div className="text-center">
          <p>
            Don't have an account? <a href="/register">Register</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
