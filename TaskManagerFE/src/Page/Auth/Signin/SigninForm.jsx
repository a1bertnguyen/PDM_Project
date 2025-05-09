import React, { useState, useEffect } from "react";
import { TextField, Button, Alert, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "../../../ReduxToolkit/AuthSlice";
import axios from "axios";

const LoginForm = ({ togglePanel }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [localLoading, setLocalLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [localError, setLocalError] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  // Xóa error khi component unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear errors when typing
    setLocalError("");

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

    setErrors({ ...errors, [name]: errorText });
  };

  // Hàm đăng nhập trực tiếp qua API, không qua Redux
  const directLogin = async (email, password) => {
    setLocalLoading(true);
    try {
      console.log("Direct login attempt with:", email);

      // Gọi API trực tiếp, không qua Redux để debug
      const response = await axios.post("http://localhost:2005/auth/signin", {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("Login API response:", response);

      if (response.data && response.data.jwt) {
        // Lưu token vào localStorage
        localStorage.setItem("jwt", response.data.jwt);
        console.log("JWT saved to localStorage");

        // Đánh dấu đăng nhập thành công
        setLoginSuccess(true);
        setLocalLoading(false);

        // Chuyển hướng sau khi đăng nhập
        console.log("Login successful, reloading page...");
        setTimeout(() => {
          window.location.href = '/'; // Tải lại trang từ route gốc
        }, 500);

        return true;
      } else {
        console.error("Login response missing JWT:", response.data);
        setLocalError("Invalid response from server. Please try again.");
        setLocalLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      // Xử lý cụ thể các loại lỗi
      if (error.response) {
        if (error.response.status === 401) {
          setLocalError("Invalid email or password. Please try again.");
        } else if (error.response.status === 404) {
          setLocalError("User not found. Please check your email.");
        } else {
          setLocalError(error.response.data?.message || "Login failed. Please check your credentials.");
        }
      } else {
        setLocalError("Network error. Please check your connection and try again.");
      }

      setLocalLoading(false);
      // QUAN TRỌNG: Phải trả về false để ngăn chuyển trang
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (formData.email === "") {
      setErrors(prev => ({ ...prev, email: "Email is required" }));
      return;
    }

    if (formData.password === "") {
      setErrors(prev => ({ ...prev, password: "Password is required" }));
      return;
    }

    // Clear any existing errors
    setLocalError("");

    // Attempt direct login
    console.log("Attempting direct login...");
    const loginResult = await directLogin(formData.email, formData.password);

    // QUAN TRỌNG: Nếu đăng nhập thất bại, dừng hàm và KHÔNG tiếp tục xử lý Redux
    if (!loginResult) {
      console.log("Login failed, staying on login page");
      return; // Dừng hàm ở đây nếu đăng nhập thất bại
    }

    // Nếu code chạy đến đây, nghĩa là đăng nhập thành công
    console.log("Direct login successful");
  }

  // Hiển thị trạng thái thành công
  if (loginSuccess) {
    return (
      <div className="text-center py-10">
        <CircularProgress color="success" />
        <Alert severity="success" sx={{ mt: 2 }}>
          Login successful! Redirecting...
        </Alert>
      </div>
    );
  }

  return (
    <div className="">
      <h1 className="text-lg font-bold text-center pb-8 textStyle">Login</h1>

      {/* Hiển thị thông báo lỗi đăng nhập */}
      {(error || localError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {localError || error || "Invalid email or password. Please try again."}
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
          error={!!errors.email}
          helperText={errors.email}
          placeholder="Enter your email"
          disabled={loading || localLoading}
        />

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
            className="customeButton"
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            disabled={loading || localLoading}
          >
            {(loading || localLoading) ? (
              <span className="flex items-center justify-center">
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Signing in...
              </span>
            ) : "Login"}
          </Button>
        </div>
      </form>

      <div className="textStyle mt-5 flex items-center gap-2 py-5 justify-center">
        <span>Don't have an account?</span>
        <Button type="button" className="" onClick={togglePanel} color="primary">
          Sign up
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;