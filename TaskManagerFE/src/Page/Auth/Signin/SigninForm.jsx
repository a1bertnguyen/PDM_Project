// src/Page/Auth/Signin/SigninForm.jsx
import React, { useState, useEffect } from "react";
import { TextField, Button, CircularProgress, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../ReduxToolkit/AuthSlice";

const SigninForm = ({ togglePanel }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validation
    let errorText = "";
    if (name === "email") {
      errorText =
        value === ""
          ? "Email is required"
          : !/\S+@\S+\.\S+/.test(value)
            ? "Please enter a valid email address"
            : "";
    } else if (name === "password") {
      errorText = value === "" ? "Password is required" : "";
    }

    setFormErrors({ ...formErrors, [name]: errorText });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if form has errors
    if (formErrors.email || formErrors.password) {
      return;
    }

    // Dispatch login action
    dispatch(login(formData));
  };

  return (
    <div className="">
      <h1 className="text-lg font-bold text-center pb-8 textStyle">Login</h1>

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      <form className="space-y-3" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={!!formErrors.email}
          helperText={formErrors.email}
          placeholder="Enter your email"
          disabled={loading}
        />

        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={!!formErrors.password}
          helperText={formErrors.password}
          placeholder="Enter your password"
          disabled={loading}
        />

        <div>
          <Button
            sx={{ padding: ".7rem 0rem" }}
            className="customeButton"
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Login"}
          </Button>
        </div>
      </form>

      <div className="textStyle mt-5 flex items-center gap-2 py-5 justify-center">
        <span>Don't have an account?</span>
        <Button
          className=""
          onClick={togglePanel}
          color="primary"
          disabled={loading}
        >
          Sign up
        </Button>
      </div>
    </div>
  );
};

export default SigninForm;