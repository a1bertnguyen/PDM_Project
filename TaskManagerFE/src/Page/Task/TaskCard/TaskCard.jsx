import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import UserList from "../UserList";
import SubmissionList from "./SubmissionList";
import EditTaskForm from "./EditTaskForm";
import SubmitFormModel from './SubmitFormModel';

import { deleteTask } from '../../../ReduxToolkit/TaskSlice';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const TaskCard = ({ item }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { auth } = useSelector(store => store);

  // State cho menu
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // State và handlers cho UserList (gán người dùng)
  const [OpenUserList, setOpenUserList] = useState(false);
  const handleCloseUserList = () => setOpenUserList(false);
  const handleOpenUserList = () => {
    const updatedParams = new URLSearchParams(location.search);
    updatedParams.set("taskId", item.id);
    navigate(`${location.pathname}?${updatedParams.toString()}`);
    setOpenUserList(true);
    handleMenuClose();
  };

  // State và handlers cho SubmissionList (xem bài nộp)
  const [OpenSubmissionList, setOpenSubmissionList] = useState(false);
  const handleCloseSubmissionList = () => setOpenSubmissionList(false);
  const handleOpenSubmissionList = () => {
    const updatedParams = new URLSearchParams(location.search);
    updatedParams.set("taskId", item.id);
    navigate(`${location.pathname}?${updatedParams.toString()}`);
    setOpenSubmissionList(true);
    handleMenuClose();
  };

  // State và handlers cho EditTaskForm (sửa task)
  const [OpenUpdateTaskForm, setOpenUpdateTaskForm] = useState(false);
  const handleCloseUpdateTaskForm = () => setOpenUpdateTaskForm(false);
  const handleOpenUpdateTaskModel = () => {
    const updatedParams = new URLSearchParams(location.search);
    updatedParams.set("taskId", item.id);
    navigate(`${location.pathname}?${updatedParams.toString()}`);
    setOpenUpdateTaskForm(true);
    handleMenuClose();
  };

  // State và handlers cho SubmitFormModel (nộp bài)
  const [OpenSubmitFormModel, setOpenSubmitFormModel] = useState(false);
  const handleCloseSubmitFormModel = () => setOpenSubmitFormModel(false);
  const handleOpenSubmitFormModel = () => {
    const updatedParams = new URLSearchParams(location.search);
    updatedParams.set("taskId", item.id);
    navigate(`${location.pathname}?${updatedParams.toString()}`);
    setOpenSubmitFormModel(true);
    handleMenuClose();
  };

  // Handler xóa task
  const handleDeleteTask = () => {
    dispatch(deleteTask(item.id));
    handleMenuClose();
  };

  return (
    <div>
      <div className='card lg:flex justify-between'>
        <div className='lg:flex gap-5 items-center space-y-2 w-[90%] lg:w-[70%]'>
          <div className='lg:w-[7rem] lg:h-[7rem] object-cover'>
            <img src={item.image} alt="" />
          </div>
          <div className='space-y-5'>
            <div className='space-y-2'>
              <h1 className='font-bold text-lg'>{item.title}</h1>
              <p className='text-gray-500 text-sm'>{item.description}</p>

              {/* Hiển thị trạng thái task */}
              <div className="mt-1">
                <span className={`text-xs px-2 py-1 rounded-full ${item.status === 'ASSIGNED'
                    ? 'bg-blue-900 text-blue-100'
                    : item.status === 'DONE'
                      ? 'bg-green-900 text-green-100'
                      : 'bg-purple-900 text-purple-100'
                  }`}>
                  {item.status}
                </span>
              </div>

              {/* Hiển thị người dùng đã được gán nếu có */}
              {item.assignedUserId && (
                <div className="mt-2 flex items-center">
                  <span className="text-xs font-semibold text-gray-400 mr-2">Assigned to:</span>
                  <Avatar
                    sx={{ width: 24, height: 24 }}
                    className="mr-1"
                  />
                  <span className="text-xs text-gray-300">
                    User ID: {item.assignedUserId}
                  </span>
                </div>
              )}
            </div>
            <div className='flex flex-wrap gap-2 items-center'>
              {item.tags.map((tag, i) => (
                <span key={i} className='py-1 px-5 rounded-full techStack'>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div>
          <IconButton
            id="basic-button"
            aria-controls={openMenu ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openMenu ? 'true' : undefined}
            onClick={handleMenuClick}
          >
            <MoreVertIcon />
          </IconButton>

          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            MenuListProps={{ 'aria-labelledby': 'basic-button' }}
          >
            {auth.user?.role === "ROLE_ADMIN" ? (
              <>
                <MenuItem onClick={handleOpenUserList}>Assigned User</MenuItem>
                <MenuItem onClick={handleOpenSubmissionList}>See Submissions</MenuItem>
                <MenuItem onClick={handleOpenUpdateTaskModel}>Edit</MenuItem>
                <MenuItem onClick={handleDeleteTask}>Delete</MenuItem>
              </>
            ) : (
              <MenuItem onClick={handleOpenSubmitFormModel}>Submit</MenuItem>
            )}
          </Menu>
        </div>
      </div>

      {/* Các modal component */}
      <UserList
        open={OpenUserList}
        handleClose={handleCloseUserList}
        taskId={item.id}
      />

      <SubmissionList
        open={OpenSubmissionList}
        handleClose={handleCloseSubmissionList}
      />

      <EditTaskForm
        item={item}
        open={OpenUpdateTaskForm}
        handleClose={handleCloseUpdateTaskForm}
      />

      <SubmitFormModel
        open={OpenSubmitFormModel}
        handleClose={handleCloseSubmitFormModel}
      />
    </div>
  );
};

export default TaskCard;