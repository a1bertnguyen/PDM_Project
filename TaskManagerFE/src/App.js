import { ThemeProvider } from "@mui/material";
import "./App.css";
import React, { useState, useEffect } from 'react';
import Home from "./Page/Home/Home";
import { darkTheme } from "./theme/darkTheme";
import Navbar from "./Page/NavBar/NavBar";
import Auth from "./Page/Auth/Auth";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "./ReduxToolkit/AuthSlice";
import { fetchTasks, fetchUsersTasks } from "./ReduxToolkit/TaskSlice";

function App() {
  const dispatch = useDispatch();
  const { task, auth } = useSelector(store => store);
  const [authChecked, setAuthChecked] = useState(false);

  // Kiểm tra token khi component mount - ƯU TIÊN LOCALSTORAGE
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("jwt");
      console.log("App.js: Checking auth token:", token ? "EXISTS" : "NULL");

      if (token) {
        console.log("JWT token found, loading user profile");
        try {
          // Tải thông tin người dùng nếu có token
          dispatch(getUserProfile(token));
        } catch (err) {
          console.error("Error loading profile:", err);
        }
      }

      // Đánh dấu đã kiểm tra xong
      setAuthChecked(true);
    };

    checkAuth();
  }, [dispatch]);

  // Tải tasks khi người dùng đã đăng nhập
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token && auth.user) {
      if (auth.user.role === "ROLE_ADMIN") {
        console.log("Loading admin tasks");
        dispatch(fetchTasks({}));
      } else {
        console.log("Loading user tasks");
        dispatch(fetchUsersTasks({}));
      }
    }
  }, [auth.user, dispatch]);

  // Kiểm tra trạng thái đăng nhập đơn giản, ưu tiên localStorage
  const isAuthenticated = () => {
    const token = localStorage.getItem("jwt");
    return !!token;
  };

  // Log trạng thái hiện tại
  console.log("Rendering App with:", {
    hasToken: isAuthenticated(),
    authUser: auth.user ? "EXISTS" : "NULL",
    authChecked,
    authError: auth.error || "NONE"
  });

  // Render phần giao diện
  return (
    <ThemeProvider theme={darkTheme}>
      {isAuthenticated() ? (
        <div>
          <Navbar />
          <Home />
        </div>
      ) : (
        <Auth />
      )}
    </ThemeProvider>
  );
}

export default App;