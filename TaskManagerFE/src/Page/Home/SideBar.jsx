// src/Page/Home/SideBar.jsx
import React, { useState, useEffect } from "react";
import "./SideBar.css";
import { Avatar, Box, Button, Modal } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import CreateTaskForm from "../Task/CreateTask/CreateTaskForm";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../ReduxToolkit/AuthSlice";
import { fetchTasks, fetchUsersTasks } from "../../ReduxToolkit/TaskSlice";

const SideBar = () => {
  const [activeMenu, setActiveMenu] = useState("Home");
  const dispatch = useDispatch();
  const { auth } = useSelector(store => store);
  const navigate = useNavigate();
  const location = useLocation();
  const [openCreateTaskModel, setOpenCreateTaskModel] = useState(false);

  const handleOpenCreateTaskModel = () => setOpenCreateTaskModel(true);
  const handleCloseCreateTaskModel = () => setOpenCreateTaskModel(false);

  // Define menu items based on user role
  const menu = [
    { name: "Home", value: "HOME", role: ["ROLE_ADMIN", "ROLE_CUSTOMER"] },
    { name: "DONE", value: "DONE", role: ["ROLE_ADMIN", "ROLE_CUSTOMER"] },
    { name: "ASSIGNED", value: "ASSIGNED", role: ["ROLE_ADMIN"] },
    { name: "NOT ASSIGNED", value: "PENDING", role: ["ROLE_ADMIN"] },
    { name: "Create New Task", value: "", role: ["ROLE_ADMIN"] },
    { name: "Notification", value: "NOTIFICATION", role: ["ROLE_CUSTOMER"] },
  ];

  // Set active menu based on URL parameters on page load
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const filter = searchParams.get('filter');

    if (filter) {
      const menuItem = menu.find(item => item.value === filter);
      if (menuItem) {
        setActiveMenu(menuItem.name);
      }
    } else {
      setActiveMenu("Home");
    }
  }, [location.search]);

  const handleMenuChange = (item) => {
    if (item.name === "Create New Task") {
      handleOpenCreateTaskModel();
    } else if (item.name === "Home") {
      // Clear filter
      const updatedParams = new URLSearchParams(location.search);
      updatedParams.delete("filter");
      const queryString = updatedParams.toString();
      const updatedPath = queryString
        ? `${location.pathname}?${queryString}`
        : location.pathname;

      navigate(updatedPath);

      // Fetch tasks based on role
      if (auth.user?.role === "ROLE_ADMIN") {
        dispatch(fetchTasks({}));
      } else {
        dispatch(fetchUsersTasks({}));
      }
    } else {
      // Set filter
      const updatedParams = new URLSearchParams(location.search);
      updatedParams.set("filter", item.value);
      navigate(`${location.pathname}?${updatedParams.toString()}`);

      // Fetch filtered tasks based on role
      if (auth.user?.role === "ROLE_ADMIN") {
        dispatch(fetchTasks({ status: item.value }));
      } else {
        dispatch(fetchUsersTasks({ status: item.value }));
      }
    }

    setActiveMenu(item.name);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  // Load tasks on component mount
  useEffect(() => {
    if (auth.user?.role === "ROLE_ADMIN") {
      dispatch(fetchTasks({}));
    } else {
      dispatch(fetchUsersTasks({}));
    }
  }, [auth.user, dispatch]);

  return (
    <div className="min-h-[85vh] flex flex-col justify-center card fixed w-[20vw]">
      <div className="space-y-5 h-full">
        <div className="flex justify-center">
          <Avatar
            sx={{ width: "8rem", height: "8rem" }}
            className="border-2 border-[#c24dd0]"
            src={auth.user?.profileImage || "https://res.cloudinary.com/dxoqwusir/image/upload/v1703852575/Code_With_Zosh_e0bbz7.png"}
            alt={auth.user?.fullName || "User"}
          />
        </div>

        {menu
          .filter(item => item.role.includes(auth.user?.role))
          .map((item, index) => (
            <p
              key={index}
              onClick={() => handleMenuChange(item)}
              className={`py-3 px-5 rounded-full text-center cursor-pointer ${activeMenu === item.name ? "activeMenuItem" : "menuItem"
                }`}
            >
              {item.name}
            </p>
          ))}

        <Button
          variant="outlined"
          className="logoutButton"
          fullWidth
          sx={{ padding: ".7rem", borderRadius: "2rem", color: "white" }}
          onClick={handleLogout}
        >
          {"Logout"}
        </Button>
      </div>

      <CreateTaskForm
        open={openCreateTaskModel}
        handleClose={handleCloseCreateTaskModel}
      />
    </div>
  );
};

export default SideBar;