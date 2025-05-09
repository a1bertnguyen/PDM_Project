import React, { useEffect } from "react";
import { fetchTasks, fetchUsersTasks } from "../../ReduxToolkit/TaskSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import TaskCard from "../Task/TaskCard/TaskCard";

const TaskList = () => {
  const dispatch = useDispatch();
  // Thêm submission vào useSelector để theo dõi các thay đổi
  const { task, auth, submission } = useSelector((store) => store);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const filterValue = queryParams.get("filter");

  // Thêm submission.status vào dependency array để khi trạng thái submission thay đổi, danh sách tasks sẽ được tải lại
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
          // Thêm trạng thái loading
          <div className="text-center py-4">Loading tasks...</div>
        ) : task.tasks && task.tasks.length > 0 ? (
          // Hiển thị tasks nếu có
          task.tasks.map((item) => (
            <TaskCard key={item.id} item={item} />
          ))
        ) : (
          // Hiển thị thông báo nếu không có tasks
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