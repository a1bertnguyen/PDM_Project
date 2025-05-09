import React, { useState, useEffect } from "react";
import { TextField, Button, Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../ReduxToolkit/AuthSlice";

const LoginForm = ({ togglePanel }) => {
  const dispatch = useDispatch();
  // Lấy trạng thái loading và error từ Redux store
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Kiểm tra validation trước khi gửi
    if (!errors.email && !errors.password && formData.email && formData.password) {
      dispatch(login(formData));
      console.log("Login Form Submitted ", formData);
    }
  };

  return (
    <div className="">
      <h1 className="text-lg font-bold text-center pb-8 textStyle">Login</h1>

      {/* Hiển thị thông báo lỗi đăng nhập */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Đăng nhập không thành công: Tài khoản hoặc mật khẩu không đúng
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
          disabled={loading}
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
            {loading ? "Đang đăng nhập..." : "Login"}
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