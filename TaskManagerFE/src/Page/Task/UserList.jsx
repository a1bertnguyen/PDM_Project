import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Divider from '@mui/material/Divider';
import { Avatar, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { assignedTaskToUser } from '../../ReduxToolkit/TaskSlice';
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

export default function UserList({ handleClose, open }) {
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get("taskId");

  React.useEffect(() => {
    dispatch(getUserList(localStorage.getItem("jwt")));
  }, [dispatch]);

  const handleAssignedTask = (user) => {
    dispatch(assignedTaskToUser({ userId: user.id, taskId }));
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {auth.users.map((user, index) => (
          <React.Fragment key={user.id}>
            <div className="flex items-center justify-between w-full">
              <div>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar src="https://example.com/default-avatar.jpg" />
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.fullName}
                    secondary={`@${user.fullName.split(" ").join("_").toLowerCase()}`}
                  />
                </ListItem>
              </div>
              <div>
                <Button onClick={() => handleAssignedTask(user)} className="customeButton">
                  Select
                </Button>
              </div>
            </div>
            {index !== auth.users.length - 1 && <Divider variant="inset" />}
          </React.Fragment>
        ))}

      </Box>
    </Modal>
  );
}
