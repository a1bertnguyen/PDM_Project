// src/Page/Home/Home.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../../ReduxToolkit/AuthSlice";
import SideBar from "./SideBar";
import TaskList from "../TaskList/TaskList";

const Home = () => {
  const dispatch = useDispatch();
  const { user, jwt } = useSelector(state => state.auth);

  // Load user profile on component mount if JWT exists but user is null
  useEffect(() => {
    if (jwt && !user) {
      dispatch(getUserProfile());
    }
  }, [jwt, user, dispatch]);

  return (
    <div className="flex">
      {/* Left Sidebar */}
      <div className="w-1/5">
        <SideBar />
      </div>

      {/* Main Content */}
      <div className="w-4/5 p-4 ml-[20vw]">
        <TaskList />
      </div>
    </div>
  );
};

export default Home;