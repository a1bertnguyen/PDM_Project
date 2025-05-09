import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import SubmissionCard from './SubmissionCard';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { fetchSubmissionsByTaskId } from '../../../ReduxToolkit/SubmissionSlice';
import { fetchTasks, fetchUsersTasks } from '../../../ReduxToolkit/TaskSlice';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function SubmissionList({ handleClose, open }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get("taskId");

  // Lấy thông tin submissions từ Redux store
  const { submissions } = useSelector((store) => store.submission);
  // Lấy thông tin người dùng để biết role
  const { auth } = useSelector((store) => store);

  // Effect để tải submissions khi mở modal và khi taskId thay đổi
  React.useEffect(() => {
    if (open && taskId) {
      console.log("Loading submissions for task:", taskId);
      dispatch(fetchSubmissionsByTaskId({ taskId }));
    }
  }, [dispatch, taskId, open]);

  // Effect riêng để reload tasks khi có thay đổi về submissions
  React.useEffect(() => {
    if (submissions && submissions.some(sub => sub.status === "ACCEPTED")) {
      console.log("Found accepted submission, reloading tasks");

      // Tải lại tasks dựa trên role
      if (auth?.user?.role === "ROLE_ADMIN") {
        dispatch(fetchTasks({}));
      } else {
        dispatch(fetchUsersTasks({}));
      }
    }
  }, [submissions, dispatch, auth?.user?.role]);

  // Hàm để reload danh sách task (truyền xuống SubmissionCard)
  const reloadTasks = () => {
    if (auth?.user?.role === "ROLE_ADMIN") {
      dispatch(fetchTasks({}));
    } else {
      dispatch(fetchUsersTasks({}));
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {submissions && submissions.length > 0 ? (
          <div className='space-y-2'>
            {submissions.map((item, index) => (
              <SubmissionCard
                key={item.id || index}
                item={item}
                onStatusChange={reloadTasks} // Truyền hàm reload xuống component con
              />
            ))}
          </div>
        ) : (
          <div className='text-center'>No Submission Found</div>
        )}
      </Box>
    </Modal>
  );
}