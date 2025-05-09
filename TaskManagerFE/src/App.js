import { ThemeProvider } from "@mui/material";
import "./App.css";
import React from 'react';

import Home from "./Page/Home/Home";
import { darkTheme } from "./theme/darkTheme";
import Navbar from "./Page/NavBar/NavBar";
import Auth from "./Page/Auth/Auth";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUserProfile } from "./ReduxToolkit/AuthSlice";
import { fetchTasks, fetchUsersTasks } from "./ReduxToolkit/TaskSlice";


function App() {
  const dispatch = useDispatch()
  const { task, auth } = useSelector(store => store)

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      dispatch(getUserProfile(token))
    }
  }, [dispatch])

  useEffect(() => {
    if (auth.user?.role === "ROLE_ADMIN" && auth.loggedIn) {
      dispatch(fetchTasks({}))
    }
    else if (auth.user && auth.loggedIn) {
      dispatch(fetchUsersTasks({}))
    }
  }, [auth.user, auth.loggedIn, dispatch])

  return (
    <ThemeProvider theme={darkTheme}>
      {/* Thay đổi điều kiện để kiểm tra cả user và loggedIn */}
      {(auth.user && auth.loggedIn) ? (
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