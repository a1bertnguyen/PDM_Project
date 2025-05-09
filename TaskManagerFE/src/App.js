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
  const dispatch=useDispatch()
  const {task,auth}=useSelector(store=>store)
  
  useEffect(()=>{
    dispatch(getUserProfile(localStorage.getItem("jwt")))
    
  },[auth.jwt])

  useEffect(()=>{
    if(auth.user?.role==="ROLE_ADMIN"){
      dispatch(fetchTasks({})) // truyền object rỗng nếu không lọc
    }
    else{
      dispatch(fetchUsersTasks({}))
    }
  },[auth.user])
  
  return (
    <ThemeProvider theme={darkTheme}>
      
      {auth.user?<div>
      <Navbar/>
      <Home />
      </div>:<Auth/> }
 {/*      <Navbar/>
      <Home /> */}
      
    </ThemeProvider>
  );
}

export default App;