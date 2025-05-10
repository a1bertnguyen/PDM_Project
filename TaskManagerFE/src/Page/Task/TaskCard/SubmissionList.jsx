import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import SubmissionCard from './SubmissionCard';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { fetchSubmissionsByTaskId } from '../../../ReduxToolkit/SubmissionSlice';
import { CircularProgress } from '@mui/material';

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

  const [loading, setLoading] = useState(false);
  const { submissions } = useSelector((store) => store.submission);

  useEffect(() => {
    if (open && taskId) {
      console.log("Loading submissions for task:", taskId);
      setLoading(true);

      dispatch(fetchSubmissionsByTaskId({ taskId }))
        .finally(() => {
          setLoading(false);
        });
    }
  }, [dispatch, taskId, open]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {loading ? (
          <div className='text-center py-4'>
            <CircularProgress color="secondary" />
            <p className='mt-2'>Loading submissions...</p>
          </div>
        ) : submissions && submissions.length > 0 ? (
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