// src/Page/Task/TaskCard/TaskCard.jsx
import React, { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTask } from '../../../ReduxToolkit/TaskSlice';
import { fetchSubmissionsByTaskId } from '../../../ReduxToolkit/SubmissionSlice';
import UserList from '../UserList';
import SubmissionList from './SubmissionList';
import EditTaskForm from './EditTaskForm';

const TaskCard = ({ task }) => {
    const dispatch = useDispatch();
    const { auth } = useSelector(store => store);
    const role = auth.user?.role || '';

    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);

    const [openUserList, setOpenUserList] = useState(false);
    const [openSubmissionList, setOpenSubmissionList] = useState(false);
    const [openUpdateTaskForm, setOpenUpdateTaskForm] = useState(false);

    // Menu handlers
    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // User list modal handlers
    const handleCloseUserList = () => {
        setOpenUserList(false);
    };

    const handleOpenUserList = () => {
        setOpenUserList(true);
        handleMenuClose();
    };

    // Submission list modal handlers
    const handleCloseSubmissionList = () => {
        setOpenSubmissionList(false);
    };

    const handleOpenSubmissionList = () => {
        setOpenSubmissionList(true);
        dispatch(fetchSubmissionsByTaskId({ taskId: task.id }));
        handleMenuClose();
    };

    // Edit task modal handlers
    const handleCloseUpdateTaskForm = () => {
        setOpenUpdateTaskForm(false);
    };

    const handleOpenUpdateTaskModel = () => {
        setOpenUpdateTaskForm(true);
        handleMenuClose();
    };

    // Delete task handler
    const handleDeleteTask = () => {
        dispatch(deleteTask(task.id));
        handleMenuClose();
    };

    return (
        <div>
            <div className='card lg:flex justify-between'>
                <div className='lg:flex gap-5 items-center space-y-2 w-[90%] lg:w-[70%]'>
                    {/* Task Image */}
                    <div className='lg:w-[7rem] lg:h-[7rem] overflow-hidden'>
                        <img
                            src={task.image || "https://via.placeholder.com/150"}
                            alt={task.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Task Details */}
                    <div className='space-y-5'>
                        <div className='space-y-2'>
                            <h1 className='font-bold text-lg'>{task.title}</h1>
                            <p className='text-gray-500 text-sm'>{task.description}</p>
                        </div>

                        {/* Task Tags */}
                        <div className='flex flex-wrap gap-2 items-center'>
                            {task.tags && task.tags.map((tag, index) => (
                                <span key={index} className='py-1 px-5 rounded-full techStack'>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Action Menu */}
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
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        {role === "ROLE_ADMIN" ? (
                            <>
                                <MenuItem onClick={handleOpenUserList}>Assign User</MenuItem>
                                <MenuItem onClick={handleOpenSubmissionList}>See Submissions</MenuItem>
                                <MenuItem onClick={handleOpenUpdateTaskModel}>Edit</MenuItem>
                                <MenuItem onClick={handleDeleteTask}>Delete</MenuItem>
                            </>
                        ) : (
                            <MenuItem onClick={handleOpenSubmissionList}>Submit Task</MenuItem>
                        )}
                    </Menu>
                </div>
            </div>

            {/* Modals */}
            <UserList
                open={openUserList}
                handleClose={handleCloseUserList}
                taskId={task.id}
            />

            <SubmissionList
                open={openSubmissionList}
                handleClose={handleCloseSubmissionList}
                taskId={task.id}
            />

            <EditTaskForm
                open={openUpdateTaskForm}
                handleClose={handleCloseUpdateTaskForm}
                task={task}
            />
        </div>
    );
};

export default TaskCard;