import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Divider from '@mui/material/Divider';
import { Avatar, ListItem, ListItemAvatar, ListItemText, CircularProgress, Alert, Snackbar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { assignedTaskToUser, fetchTasks, fetchUsersTasks } from '../../ReduxToolkit/TaskSlice';
import { getUserList } from '../../ReduxToolkit/AuthSlice';

import { useLocation } from 'react-router-dom';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  outline: "none",
  boxShadow: 24,
  p: 2,
};

export default function UserList({ handleClose, open, taskId }) {
  const dispatch = useDispatch();
  const { auth, task } = useSelector((store) => store);
  const location = useLocation();

  // Thêm state để quản lý trạng thái gán người dùng
  const [assigning, setAssigning] = React.useState(false);
  const [assignSuccess, setAssignSuccess] = React.useState(false);
  const [assignError, setAssignError] = React.useState("");

  // Lấy taskId từ props hoặc từ query params
  const getTaskId = () => {
    if (taskId) return taskId;
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get("taskId");
  };

  React.useEffect(() => {
    if (open) {
      dispatch(getUserList(localStorage.getItem("jwt")));
    }
    // Reset trạng thái khi modal mở
    setAssignSuccess(false);
    setAssignError("");
    setAssigning(false);
  }, [dispatch, open]);

  const handleAssignedTask = (user) => {
    const currentTaskId = getTaskId();
    console.log(`Assigning user ${user.id} to task ${currentTaskId}`);

    if (!currentTaskId) {
      setAssignError("Không thể xác định task ID. Vui lòng thử lại.");
      return;
    }

    setAssigning(true);
    setAssignError("");

    dispatch(assignedTaskToUser({ userId: user.id, taskId: currentTaskId }))
      .unwrap() // Sử dụng unwrap để xử lý Promise
      .then((result) => {
        console.log("Assignment successful:", result);
        setAssignSuccess(true);
        setAssigning(false);

        // Tải lại danh sách task sau khi gán thành công
        if (auth.user?.role === "ROLE_ADMIN") {
          dispatch(fetchTasks({}));
        } else {
          dispatch(fetchUsersTasks({}));
        }

        // Đóng modal sau 1.5 giây để hiển thị thông báo thành công
        setTimeout(() => {
          handleClose();
        }, 1500);
      })
      .catch((error) => {
        console.error("Error assigning task:", error);
        setAssignError(error.message || "Không thể gán người dùng. Vui lòng thử lại.");
        setAssigning(false);
      });
  };

  // Hiển thị thông báo thành công
  const handleCloseSnackbar = () => {
    setAssignSuccess(false);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {/* Hiển thị thông báo lỗi nếu có */}
        {assignError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {assignError}
          </Alert>
        )}

        {/* Hiển thị thông báo đang xử lý */}
        {assigning && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress size={24} />
            <span style={{ marginLeft: 10 }}>Đang gán người dùng...</span>
          </Box>
        )}

        {Array.isArray(auth.users) && auth.users.length > 0 ? (
          auth.users.map((user, index) => (
            user && (
              <React.Fragment key={user.id || index}>
                <div className="flex items-center justify-between w-full">
                  <div>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar src="https://example.com/default-avatar.jpg" />
                      </ListItemAvatar>
                      <ListItemText
                        primary={user.fullName || "Người dùng"}
                        secondary={`@${user.fullName ? user.fullName.split(" ").join("_").toLowerCase() : "user"}`}
                      />
                    </ListItem>
                  </div>
                  <div>
                    <Button
                      onClick={() => handleAssignedTask(user)}
                      className="customeButton"
                      disabled={assigning}
                    >
                      {assigning ? <CircularProgress size={20} /> : "Select"}
                    </Button>
                  </div>
                </div>
                {index !== auth.users.length - 1 && <Divider variant="inset" />}
              </React.Fragment>
            )
          ))
        ) : (
          <div className="text-center p-4">
            {auth.loading ? (
              <CircularProgress size={24} />
            ) : (
              "Không có người dùng nào"
            )}
          </div>
        )}

        {/* Snackbar thông báo thành công */}
        <Snackbar
          open={assignSuccess}
          autoHideDuration={1500}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            Gán người dùng thành công!
          </Alert>
        </Snackbar>
      </Box>
    </Modal>
  );
}