import React from "react";
import "./NavBar.css";
import { Avatar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

const Navbar = () => {
  const dispatch=useDispatch()
  const {auth}=useSelector(store=>store)
  return (
    <div className="navbar-wrapper z-10 sticky left-0 right-0 top-0 py-3 px-5 lg:px-10 flex justify-between items-center">
      <p className="font-bold text-lg">Task Manager</p>
      <div className="flex items-center gap-5">
      <p className="font-semibold text-lgx">{auth.user?.fullName || "Guest"}</p>
        <Avatar
          alt="Remy Sharp"
          src="https://cdn.leonardo.ai/users/f00fa7d2-e0c9-4e4b-9bba-4fe3d85e0c0b/generations/08d77b29-7c9d-4be4-895b-eeb39dbc8b13/AlbedoBase_XL_Ultra_Long_Exposure_Photography_High_quality_hig_3.jpg?w=512"
        />
      </div>
    </div>
  );
};

export default Navbar;