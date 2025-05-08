// src/Page/Task/UserList.jsx
import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider, CircularProgress, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getUserList } from '../../ReduxToolkit/AuthSlice';
import { assignedTaskToUser } from '../../ReduxToolkit/TaskSlice';

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
  maxHeight: '80vh',
  overflow: 'auto'
};

export default function UserList({ handleClose, open, taskId }) {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector(state => state.auth);
  const { loading: taskLoading } = useSelector(state => state.task);

  // Fetch users when modal opens
  useEffect(() => {
    if (open) {
      dispatch(getUserList());
    }
  }, [open, dispatch]);

  // Handle assignment of task to user
  const handleAssignUser = (userId) => {
    dispatch(assignedTaskToUser({ userId, taskId }))
      .unwrap()
      .then(() => {
        handleClose();
      });
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="user-list-modal-title"
      >
        <Box sx={style}>
          <Typography variant="h6" component="h2" className="text-center mb-4">
            Assign Task to User
          </Typography>

          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}

          {loading ? (
            <div className="flex justify-center p-4">
              <CircularProgress />
            </div>
          ) : (
            <List sx={{ width: '100%' }}>
              {users && users.length > 0 ? (
                users.map((user, index) => (
                  <React.Fragment key={user.id}>
                    <div className='flex items-center justify-between w-full'>
                      <div>
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random`} />
                          </ListItemAvatar>
                          <ListItemText
                            primary={user.fullName}
                            secondary={`@${user.email.split('@')[0]}`}
                          />
                        </ListItem>
                      </div>
                      <div>
                        <Button
                          className="customeButton"
                          onClick={() => handleAssignUser(user.id)}
                          disabled={taskLoading}
                        >
                          {taskLoading ? <CircularProgress size={24} /> : "Assign"}
                        </Button>
                      </div>
                    </div>
                    {index !== users.length - 1 && <Divider variant='inset' />}
                  </React.Fragment>
                ))
              ) : (
                <div className="text-center p-4">No users found</div>
              )}
            </List>
          )}
        </Box>
      </Modal>
    </div>
  );
}