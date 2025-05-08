// src/Page/Auth/Signup/SignupForm.jsx
import React, { useState } from "react";
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, CircularProgress, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../../ReduxToolkit/AuthSlice";

const SignupForm = ({ togglePanel }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "ROLE_CUSTOMER",
  });

  const [formErrors, setFormErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validation
    let errorText = "";
    if (name === "fullName") {
      errorText = value === "" ? "Full Name is required" : "";
    } else if (name === "email") {
      errorText =
        value === ""
          ? "Email is required"
          : !/\S+@\S+\.\S+/.test(value)
            ? "Please enter a valid email address"
            : "";
    } else if (name === "password") {
      errorText =
        value === ""
          ? "Password is required"
          : value.length < 6
            ? "Password must be at least 6 characters"
            : "";
    }

    setFormErrors({ ...formErrors, [name]: errorText });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if form has errors
    if (formErrors.fullName || formErrors.email || formErrors.password) {
      return;
    }

    // Dispatch register action
    dispatch(register(formData));
  };

  return (
    <div className="">
      <h1 className="text-lg font-bold text-center pb-8 textStyle">Signup</h1>

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <TextField
          fullWidth
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          error={!!formErrors.fullName}
          helperText={formErrors.fullName}
          placeholder="Enter your full name"
          disabled={loading}
        />

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

        <FormControl fullWidth>
          <InputLabel id="role-label">Role</InputLabel>
          <Select
            labelId="role-label"
            label="Role"
            name="role"
            id="role"
            value={formData.role}
            onChange={handleChange}
            error={!!formErrors.role}
            disabled={loading}
          >
            <MenuItem value="ROLE_CUSTOMER">USER</MenuItem>
            <MenuItem value="ROLE_ADMIN">ADMIN</MenuItem>
          </Select>
          {formErrors.role && <div style={{ color: 'red' }}>{formErrors.role}</div>}
        </FormControl>

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
            {loading ? <CircularProgress size={24} /> : "Register"}
          </Button>
        </div>
      </form>

      <div className="textStyle flex items-center gap-2 mt-9 justify-center">
        <span>Already have an account?</span>
        <Button
          className="btn"
          onClick={togglePanel}
          color="primary"
          disabled={loading}
        >
          Sign in
        </Button>
      </div>
    </div>
  );
};