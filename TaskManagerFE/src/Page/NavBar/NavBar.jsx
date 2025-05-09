import React, { useEffect, useState } from "react";
import "./NavBar.css";
import { Avatar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../../ReduxToolkit/AuthSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const { auth } = useSelector(store => store);
  const [userName, setUserName] = useState("Guest");

  // Đảm bảo có thông tin người dùng
  useEffect(() => {
    // Nếu chưa có thông tin user nhưng có JWT token
    if (!auth.user && localStorage.getItem("jwt")) {
      console.log("Navbar: Fetching user profile with stored JWT");
      dispatch(getUserProfile(localStorage.getItem("jwt")));
    }

    // Cập nhật tên hiển thị
    if (auth.user?.fullName) {
      setUserName(auth.user.fullName);
    } else if (auth.user?.email) {
      // Nếu không có fullName, dùng email
      setUserName(auth.user.email);
    }
  }, [auth.user, dispatch]);

  // Log để debug
  useEffect(() => {
    console.log("Navbar rendered with auth state:", {
      user: auth.user ? `${auth.user.fullName || auth.user.email}` : "NULL",
      loggedIn: auth.loggedIn
    });
  }, [auth.user, auth.loggedIn]);

  return (
    <div className="navbar-wrapper z-10 sticky left-0 right-0 top-0 py-3 px-5 lg:px-10 flex justify-between items-center">
      <p className="font-bold text-lg">Task Manager</p>
      <div className="flex items-center gap-5">
        <p className="font-semibold text-lgx">{userName}</p>
        <Avatar
          alt={userName}
          src="https://cdn.leonardo.ai/users/f00fa7d2-e0c9-4e4b-9bba-4fe3d85e0c0b/generations/08d77b29-7c9d-4be4-895b-eeb39dbc8b13/AlbedoBase_XL_Ultra_Long_Exposure_Photography_High_quality_hig_3.jpg?w=512"
        />
      </div>
    </div>
  );
};

export default Navbar;