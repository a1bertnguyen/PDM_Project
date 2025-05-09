import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import SubmissionCard from './SubmissionCard';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { fetchSubmissionsByTaskId } from '../../../ReduxToolkit/SubmissionSlice';


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

  const { submissions } = useSelector((store) => store.submission);

  React.useEffect(() => {
    if (taskId) {
      dispatch(fetchSubmissionsByTaskId({ taskId }));
    }
  }, [dispatch, taskId]);


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
              <SubmissionCard key={item.id || index} item={item} />
            ))}
          </div>
        ) : (
          <div className='text-center'>No Submission Found</div>
        )}

      </Box>
    </Modal>
  );
}
