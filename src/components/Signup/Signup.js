import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import bcrypt from 'bcryptjs'

const salt = bcrypt.genSaltSync(10)

const Signup = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [inpval, setInpval] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  // console.log("inpval", inpval);

  let user_records = [];

  const getdata = (e) => {
    const { value, name } = e.target;
    const validationErrors = { ...errors };

    if (name === "name") {
      const namePattern = /^[a-zA-Z\s]+$/;
      if (value.length < 3) {
        validationErrors.name = "Username must be at least 3 characters";
      } else if (!namePattern.test(value)) {
        validationErrors.name =
          "Name should only contain alphabetic characters";
      } else {
        delete validationErrors.name;
      }
    } else if (name === "email") {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!emailRegex.test(value)) {
        validationErrors.email = "Email is not valid";
      } else {
        // Check if the email already exists in the user list
        const emailExists = user_records.some((user) => user.email === value);
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
    } else if (name === "confirmPassword") {
      if (value !== inpval.password) {
        validationErrors.confirmPassword = "Password doesn't not match";
      } else {
        delete validationErrors.confirmPassword;
      }
    }

    setInpval({
      ...inpval,
      [name]: value,
    });

    setErrors(validationErrors);
  };

  const addData = (e) => {
    e.preventDefault();
    // const newData = [...data, inpval];
    // console.log("new", newData);
    // setData(newData);
    const { name, email, password, confirmPassword } = inpval;
    const hashedPassword = bcrypt.hashSync(password, '$2a$10$CwTycUXWue0Thq9StjUM0u')

    user_records = JSON.parse(localStorage.getItem("users"))
      ? JSON.parse(localStorage.getItem("users"))
      : [];
    if (
      user_records.some((v) => {
        return v.email === email;
      })
    ) {
      Swal.fire("Email is already in use. Please use a different email");
      // alert("Email is already in use. Please use a different email.");
      navigate("/signup");
    } else if (user_records.some((v) => v.name === name)) {
      Swal.fire("name is already taken. Please choose a different name");
      // alert(
      //   "name is already taken. Please choose a different name."
      // );
      navigate("/signup");
    } else {
      user_records.push({
        name: name,
        email: email,
        password: hashedPassword,
        // confirmPassword: confirmPassword,
      });
      const foundUser = user_records.find((v) => v.email === email);

      localStorage.setItem("users", JSON.stringify(user_records));
      localStorage.setItem("name", foundUser.name);
      // console.log("data added successfully");
      Swal.fire("Successfully Registered!");
      navigate("/slotbook");
    }
  };

  return (
    <div className="form__login">
      <div className="wrapper">
        <form onSubmit={addData}>
          {/* <form> */}
          <h1>Register</h1>
          <div className="input__box">
            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              id="exampleInputname"
              onChange={getdata}
              required
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="input__box">
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
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
              id="exampleInputPassword1"
              onChange={getdata}
              required
            />
            {errors.password && (
              <span className="error">{errors.password}</span>
            )}
          </div>

          <div className="input__box">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              id="exampleInputPassword2"
              onChange={getdata}
              required
            />
            {errors.confirmPassword && (
              <span className="error">{errors.confirmPassword}</span>
            )}
          </div>
          <button type="submit" className="btn">
            Register
          </button>
          <br />
          <br />
          <div>
            <p>
              If you already registered <Link to="/">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
