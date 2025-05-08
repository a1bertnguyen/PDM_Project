// src/Page/Auth/Auth.jsx
import React, { useState, useEffect } from "react";
import "./Auth.css";
import { useDispatch, useSelector } from "react-redux";
import SignupForm from "./Signup/SignupForm";
import SigninForm from "./Signin/SigninForm";

const Auth = () => {
  const [rotate, setRotate] = useState(false);
  const dispatch = useDispatch();
  const { error, loading } = useSelector(state => state.auth);

  const togglePanel = () => {
    setRotate(!rotate);
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <div className="box w-[80vw] md:w-[60vw] lg:w-[50vw] h-[80vh]">
        <div className={`cover relative ${rotate ? 'rotate-active' : ''}`}>
          <div className="front">
            <img
              className="h-full w-full opacity-50 z-10"
              src="https://res.cloudinary.com/dxoqwusir/image/upload/v1704006063/2_m6smux.jpg"
            />
            <div className="text">
              <span className="text-1">Task Management</span>
              <span className="text-2">Lets connect with us</span>
            </div>
          </div>
          <div className="back">
            <img
              className="h-full w-full opacity-50 z-10"
              src="https://res.cloudinary.com/dxoqwusir/image/upload/v1704006064/3_j8gggw.jpg"
            />
            <div className="text">
              <span className="text-1">Complete miles of journey </span>
              <span className="text-2">with one step</span>
            </div>
          </div>
        </div>

        <div className="form-content  h-[100%] ">
          <div className="login-form w-[90%] mx-auto mt-[30px] md:mt-[70px] md:mx-0 md:w-6/12 ">
            {rotate ? (
              <SignupForm togglePanel={togglePanel} />
            ) : (
              <SigninForm togglePanel={togglePanel} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;