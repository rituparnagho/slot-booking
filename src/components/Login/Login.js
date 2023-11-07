import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import Swal from "sweetalert2";

const Login = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [inpval, setInpval] = useState({
    email: "",
    password: "",
  });

  let user_record = [];
  const getdata = (e) => {
    const { value, name } = e.target;
    const validationErrors = { ...errors };
    if (name === "email") {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!emailRegex.test(value)) {
        validationErrors.email = "Email is not valid";
      } else {
        // Check if the email already exists in the user list
        const emailExists = user_record.some((user) => user.email === value);
        if (emailExists) {
          validationErrors.email = "Email already exists";
        } else {
          delete validationErrors.email;
        }
      }
    } else if (name === "password") {
      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
      if (value.length < 6) {
        validationErrors.password = "Password must be at least 6 characters";
      } else if (!passwordRegex.test(value)) {
        validationErrors.password = "Password should be 6 character long,password should contain at least one uppercase letter, one lowercase letter, and one number, and one special character";
      } else {
        delete validationErrors.password;
      }
    }
    setInpval(() => {
      return {
        ...inpval,
        [name]: value,
      };
    });

    setErrors(validationErrors);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const { email, password } = inpval;

    user_record = JSON.parse(localStorage.getItem("users"))
      ? JSON.parse(localStorage.getItem("users"))
      : [];

    const foundUser = user_record.find((v) => v.email === email);
    if (foundUser) {
      if (foundUser.password === password) {
        Swal.fire("Login successful");
        localStorage.setItem("name", foundUser.name);
        navigate("/slotbook");
      } else {
        Swal.fire("invalid password");
        // alert("invalid password");
      }
    }
  };
  return (
    <div className="form__login">
      <div className="wrapper">
        <form onSubmit={handleLogin}>
          <h1>Login</h1>
          <div className="input__box">
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              className="form-control"
              id="exampleInputEmail1"
              onChange={getdata}
              required
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          <div className="input__box">
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              className="form-control"
              id="exampleInputPassword1"
              onChange={getdata}
              required
            />
            {errors.password && (
              <span className="error">{errors.password}</span>
            )}
          </div>
          <button type="submit" className="btn">
            Login
          </button>
          <br />
          <br />
          <div>
            <p>
              Don't have account? <Link to="/signup">Register</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
