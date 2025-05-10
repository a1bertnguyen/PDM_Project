import React, { useState } from "react";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Button, IconButton, CircularProgress } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch } from "react-redux";
import { acceptDeclineSubmission } from '../../../ReduxToolkit/SubmissionSlice';
import { completeTask, fetchTasks } from '../../../ReduxToolkit/TaskSlice';

const SubmissionCard = ({ item }) => {
  const dispatch = useDispatch();
  const [processing, setProcessing] = useState(false);

  const handleAcceptDecline = (status) => {
    setProcessing(true);

    dispatch(acceptDeclineSubmission({ id: item.id, status }))
      .then((result) => {
        console.log("Submission status updated to:", status, result);

        // Nếu status là ACCEPTED, update task sang DONE
        if (status === "ACCEPTED") {
          console.log("Marking task as DONE:", item.taskId);

          // Completes the task
          return dispatch(completeTask(item.taskId))
            .then((completeResult) => {
              console.log("Task marked as DONE:", completeResult);

              // Tải lại danh sách task để cập nhật UI
              return dispatch(fetchTasks({}));
            });
        }

        return Promise.resolve();
      })
      .finally(() => {
        setProcessing(false);
      })
      .catch(error => {
        console.error("Error handling submission:", error);
        setProcessing(false);
      });
  };

  return (
    <div className='rounded-md bg-black p-5 flex items-center justify-between'>
      <div className='space-y-2'>
        <div className='flex items-center gap-2'>
          <span>GitHub:</span>
          <div className='flex items-center gap-2 text-[#c24dd0]'>
            <OpenInNewIcon />
            <a href={item.githubLink} target="_blank" rel="noopener noreferrer">
              Go To Link
            </a>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <p>Submission Time:</p>
          <p className="text-gray-400">{item.submissionTime}</p>
        </div>
      </div>

      <div>
        {processing ? (
          <CircularProgress color="secondary" size={24} />
        ) : item.status === "PENDING" ? (
          <div className="flex gap-5">
            <IconButton color="success" onClick={() => handleAcceptDecline("ACCEPTED")} disabled={processing}>
              <CheckIcon />
            </IconButton>
            <IconButton color="error" onClick={() => handleAcceptDecline("DECLINED")} disabled={processing}>
              <CloseIcon />
            </IconButton>
          </div>
        ) : (
          <Button
            color={item.status === "ACCEPTED" ? "success" : "error"}
            size="small"
            variant="outlined"
          >
            {item.status}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SubmissionCard;