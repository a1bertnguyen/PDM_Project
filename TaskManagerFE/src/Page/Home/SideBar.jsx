import React, { useState } from "react";
import "./SideBar.css";
import { Avatar, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import CreateNewTaskForm from "../Task/CreateTask";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../ReduxToolkit/AuthSlice";

const menu = [
  { name: "Home", value: "HOME", role: ["ROLE_ADMIN", "ROLE_CUSTOMER"] },
  { name: "DONE", value: "DONE", role: ["ROLE_ADMIN", "ROLE_CUSTOMER"] },
  { name: "ASSIGNED", value: "ASSIGNED", role: ["ROLE_ADMIN"] },
  { name: "NOT ASSIGNED", value: "PENDING", role: ["ROLE_ADMIN"] },
  { name: "Create New Task", value: "", role: ["ROLE_ADMIN"] },
  { name: "Notification", value: "NOTIFICATION", role: ["ROLE_CUSTOMER"] },
];

const SideBar = () => {
  const [activeMenu, setActiveMenu] = useState("");
  const [openCreateTaskModel, setOpenCreateTaskModel] = useState(false);

  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);
  const navigate = useNavigate();
  const location = useLocation();

  const handleOpenCreateTaskModel = () => setOpenCreateTaskModel(true);
  const handleCloseCreateTaskModel = () => setOpenCreateTaskModel(false);

  const handleMenuChange = (item) => {
    const params = new URLSearchParams(location.search);

    if (item.name === "Create New Task") {
      handleOpenCreateTaskModel();
    } else {
      if (item.name === "Home") {
        params.delete("filter");
      } else {
        params.set("filter", item.value);
      }
      const query = params.toString();
      navigate(`${location.pathname}${query ? `?${query}` : ""}`);
    }

    setActiveMenu(item.name);
  };

  const handleLogout = () => {
    dispatch(logout());
    console.log("handle logout");
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center card lg:fixed w-[20vw]">
      <div className="space-y-5 h-full">
        <div className="flex justify-center">
          <Avatar
            sx={{ width: "8rem", height: "8rem" }}
            className="border-2 border-[#c24dd0]"
            src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fstock.adobe.com%2Fsearch%3Fk%3Dcat&psig=AOvVaw25jnLAnpW_Y-wHDcH3Tpah&ust=1746815248703000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCMDynIXAlI0DFQAAAAAdAAAAABAE"
            alt=""
          />
        </div>

        {menu
          .filter((item) => item.role.includes(auth.user?.role))
          .map((item) => (
            <p
              key={item.name}
              onClick={() => handleMenuChange(item)}
              className={`py-3 px-5 rounded-full text-center cursor-pointer ${
                activeMenu === item.name ? "activeMenuItem" : "menuItem"
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
          Logout
        </Button>
      </div>

      <CreateNewTaskForm
        open={openCreateTaskModel}
        handleClose={handleCloseCreateTaskModel}
      />
    </div>
  );
};

export default SideBar;
