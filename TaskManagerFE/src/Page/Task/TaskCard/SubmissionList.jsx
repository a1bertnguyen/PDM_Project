// src/Page/Task/TaskCard/SubmissionList.jsx
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { CircularProgress, TextField, Alert } from '@mui/material';
import SubmissionCard from './SubmissionCard';
import { useDispatch, useSelector } from 'react-redux';
import { submitTask } from '../../../ReduxToolkit/SubmissionSlice';

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

export default function SubmissionList({ handleClose, open, taskId }) {
  const dispatch = useDispatch();
  const { auth } = useSelector(store => store);
  const { submissions, status, error } = useSelector(store => store.submission);
  const loading = status === 'loading';
  const isAdmin = auth.user?.role === 'ROLE_ADMIN';

  // State for submission form
  const [githubLink, setGithubLink] = useState('');
  const [linkError, setLinkError] = useState('');

  // Handle input change
  const handleLinkChange = (e) => {
    setGithubLink(e.target.value);

    // Simple validation - can be enhanced
    if (!e.target.value) {
      setLinkError('GitHub link is required');
    } else if (!e.target.value.includes('github.com')) {
      setLinkError('Please enter a valid GitHub URL');
    } else {
      setLinkError('');
    }
  };

  // Handle submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!githubLink || linkError) {
      return;
    }

    dispatch(submitTask({
      taskId,
      githubLink,
    }))
      .unwrap()
      .then(() => {
        setGithubLink('');
        // Keep modal open to show the submission added to the list
      });
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h6" component="h2" className="mb-4 text-center">
            {isAdmin ? 'Task Submissions' : 'Submit Your Work'}
          </Typography>

          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}

          {/* Show submission form for regular users */}
          {!isAdmin && (
            <form onSubmit={handleSubmit} className="mb-6">
              <TextField
                fullWidth
                label="GitHub Link"
                value={githubLink}
                onChange={handleLinkChange}
                error={!!linkError}
                helperText={linkError}
                disabled={loading}
                placeholder="https://github.com/yourusername/repository"
                className="mb-4"
              />

              <Button
                fullWidth
                className="customeButton"
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Submit"}
              </Button>
            </form>
          )}

          {/* Submission list */}
          <div>
            {submissions && submissions.length > 0 ? (
              <div className='space-y-2'>
                {submissions.map((item) => (
                  <SubmissionCard
                    key={item.id}
                    submission={item}
                    isAdmin={isAdmin}
                  />
                ))}
              </div>
            ) : (
              <div className='text-center'>
                <div className='text-gray-500'>No Submissions Found</div>
              </div>
            )}
          </div>
        </Box>
      </Modal>
    </div>
  );
}