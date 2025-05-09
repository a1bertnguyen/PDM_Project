import React, { useState } from "react";
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Alert, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../../ReduxToolkit/AuthSlice";
import axios from "axios";

const SignupForm = ({ togglePanel }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
  });

  const [localLoading, setLocalLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [localError, setLocalError] = useState("");

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Xóa lỗi khi người dùng nhập liệu
    setLocalError("");

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
    } else if (name === "role") {
      errorText = value === "" ? "Role is required" : "";
    }

    setErrors({ ...errors, [name]: errorText });
  };

  // Hàm đăng ký trực tiếp qua API, không qua Redux
  const directRegister = async (userData) => {
    setLocalLoading(true);
    try {
      console.log("Direct register attempt with:", {
        ...userData,
        password: "[HIDDEN]"
      });

      // Gọi API trực tiếp để đăng ký
      const response = await axios.post("http://localhost:2005/auth/signup", userData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("Register API response:", response);

      if (response.data && response.data.jwt) {
        // Lưu token vào localStorage
        localStorage.setItem("jwt", response.data.jwt);
        console.log("JWT saved to localStorage after registration");

        // Đánh dấu đăng ký thành công
        setRegisterSuccess(true);
        setLocalLoading(false);

        // Chuyển hướng sau khi đăng ký thành công
        console.log("Registration successful, reloading page...");
        setTimeout(() => {
          window.location.href = '/'; // Tải lại trang từ route gốc
        }, 1000);

        return true;
      } else {
        console.error("Register response missing JWT:", response.data);
        setLocalError("Invalid response from server. Please try again.");
        setLocalLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Register error:", error);
      setLocalError(
        error.response?.data?.message ||
        "Registration failed. Email may already be in use or server error occurred."
      );
      setLocalLoading(false);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate tất cả trường dữ liệu
    let hasError = false;
    const newErrors = { ...errors };

    if (!formData.fullName) {
      newErrors.fullName = "Full Name is required";
      hasError = true;
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      hasError = true;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      hasError = true;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      hasError = true;
    }

    if (!formData.role) {
      newErrors.role = "Role is required";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    // Xóa lỗi trước đó
    setLocalError("");

    // Thử đăng ký trực tiếp
    console.log("Attempting direct registration...");
    const registerResult = await directRegister(formData);

    // Nếu đăng ký trực tiếp thành công, không cần dùng Redux
    if (registerResult) {
      console.log("Direct registration successful");
      return;
    }

    // Fallback to Redux registration if direct method fails
    console.log("Direct registration failed, falling back to Redux");
    dispatch(register(formData));
  };

  // Hiển thị thành công
  if (registerSuccess) {
    return (
      <div className="text-center py-10">
        <CircularProgress color="success" />
        <Alert severity="success" sx={{ mt: 2 }}>
          Registration successful! Redirecting to dashboard...
        </Alert>
      </div>
    );
  }

  return (
    <div className="">
      <h1 className="text-lg font-bold text-center pb-8 textStyle">Signup</h1>

      {/* Hiển thị lỗi */}
      {(error || localError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {localError || error || "Registration failed. Please check your information."}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <TextField
          fullWidth
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          error={!!errors.fullName}
          helperText={errors.fullName}
          placeholder="Enter your full name"
          disabled={loading || localLoading}
        />

        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          placeholder="Enter your email"
          disabled={loading || localLoading}
        />

        <FormControl fullWidth error={!!errors.role}>
          <InputLabel htmlFor="role">Role</InputLabel>
          <Select
            label="Role"
            name="role"
            id="role"
            value={formData.role}
            onChange={handleChange}
            disabled={loading || localLoading}
          >
            <MenuItem value="ROLE_CUSTOMER">USER</MenuItem>
            <MenuItem value="ROLE_ADMIN">ADMIN</MenuItem>
          </Select>
          {errors.role && <div style={{ color: 'red', fontSize: '0.75rem', marginTop: '3px', marginLeft: '14px' }}>{errors.role}</div>}
        </FormControl>

        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
          placeholder="Enter your password"
          disabled={loading || localLoading}
        />

        <div>
          <Button
            sx={{ padding: ".7rem 0rem" }}
            className="customButton"
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            disabled={loading || localLoading}
          >
            {(loading || localLoading) ? (
              <span className="flex items-center justify-center">
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Registering...
              </span>
            ) : "Register"}
          </Button>
        </div>
      </form>

      <div className="textStyle flex items-center gap-2 mt-9 justify-center">
        <span>Already have an account?</span>
        <Button className="btn" onClick={togglePanel} color="primary">
          Sign In
        </Button>
      </div>
    </div>
  );
};

export default SignupForm;