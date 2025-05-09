import React, { useEffect } from "react";
import { fetchTasks, fetchUsersTasks } from "../../ReduxToolkit/TaskSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import TaskCard from "../Task/TaskCard/TaskCard";

const TaskList = () => {
  const dispatch = useDispatch();
  const { task, auth, submission } = useSelector((store) => store);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const filterValue = queryParams.get("filter");

  // Load tasks khi component mount hoặc khi filter, role, hoặc submission status thay đổi
  useEffect(() => {
    if (auth.user?.role === "ROLE_ADMIN") {
      console.log("Loading tasks for admin with filter:", filterValue || "ALL");
      dispatch(fetchTasks({ status: filterValue }));
    } else {
      console.log("Loading tasks for user with filter:", filterValue || "ALL");
      dispatch(fetchUsersTasks({ status: filterValue }));
    }
  }, [dispatch, filterValue, auth.user?.role, submission.status]);

  return (
    <div className="w-[67vw]">
      <div className="space-y-3">
        {task.loading ? (
          <div className="text-center py-4">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
            </div>
            <p className="mt-2">Loading tasks...</p>
          </div>
        ) : task.tasks && task.tasks.length > 0 ? (
          task.tasks.map((item) => (
            <TaskCard key={item.id} item={item} />
          ))
        ) : (
          <div className="text-center py-4">
            {filterValue
              ? `No ${filterValue} tasks found`
              : "No tasks found"}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;