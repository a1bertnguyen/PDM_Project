// src/Page/TaskList/TaskList.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress, Alert } from "@mui/material";
import TaskCard from "../Task/TaskCard/TaskCard";
import { fetchTasks, fetchUsersTasks } from "../../ReduxToolkit/TaskSlice";
import { useLocation } from "react-router-dom";

const TaskList = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { tasks, loading, error } = useSelector(state => state.task);
    const { user } = useSelector(state => state.auth);

    // Parse URL search params to get filter
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const filter = searchParams.get('filter');

        if (user?.role === "ROLE_ADMIN") {
            dispatch(fetchTasks({ status: filter }));
        } else {
            dispatch(fetchUsersTasks({ status: filter }));
        }
    }, [location.search, user?.role, dispatch]);

    return (
        <div className='w-[67vw]'>
            {error && (
                <Alert severity="error" className="mb-4">
                    {error}
                </Alert>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <CircularProgress />
                </div>
            ) : (
                <div className='space-y-4'>
                    {tasks && tasks.length > 0 ? (
                        tasks.map((task) => (
                            <TaskCard key={task.id} task={task} />
                        ))
                    ) : (
                        <div className="flex justify-center items-center h-64">
                            <Alert severity="info">No tasks found</Alert>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TaskList;