import React, { useEffect } from "react";
import { fetchTasks, fetchUsersTasks } from "../../ReduxToolkit/TaskSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import TaskCard from "../Task/TaskCard/TaskCard";

const TaskList = () => {
  const dispatch = useDispatch();
  const { task, auth } = useSelector((store) => store);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const filterValue = queryParams.get("filter");

  useEffect(() => {
    if (auth.user?.role === "ROLE_ADMIN") {
      dispatch(fetchTasks({ status: filterValue }));
    } else {
      dispatch(fetchUsersTasks({ status: filterValue }));
    }
  }, [dispatch, filterValue, auth.user?.role]);


  return (
    <div className="w-[67vw]">
      <div className="space-y-3">
        {task.tasks.map((item) => (
          <TaskCard key={item.id} item={item} />
        ))}

      </div>
    </div>
  );
};

export default TaskList;
