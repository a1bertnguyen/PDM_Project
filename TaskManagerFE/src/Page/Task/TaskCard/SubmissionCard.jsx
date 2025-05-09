import React from "react";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Button, IconButton } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch } from "react-redux";
import { acceptDeclineSubmission } from '../../../ReduxToolkit/SubmissionSlice';
import { completeTask, fetchTasks } from '../../../ReduxToolkit/TaskSlice'; // Thêm import này

const SubmissionCard = ({ item }) => {
  const dispatch = useDispatch();

  const handleAcceptDecline = (status) => {
    dispatch(acceptDeclineSubmission({ id: item.id, status }))
      .unwrap()
      .then(() => {
        console.log("Submission status updated to:", status);

        // Nếu status là ACCEPTED, cập nhật task sang DONE
        if (status === "ACCEPTED") {
          dispatch(completeTask(item.taskId))
            .then(() => {
              console.log("Task marked as DONE");
              // Tải lại danh sách tasks để cập nhật UI
              dispatch(fetchTasks({}));
            })
            .catch(error => {
              console.error("Error completing task:", error);
            });
        }
      })
      .catch(error => {
        console.error("Error updating submission:", error);
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
        {item.status === "PENDING" ? (
          <div className="flex gap-5">
            <IconButton color="success" onClick={() => handleAcceptDecline("ACCEPTED")}>
              <CheckIcon />
            </IconButton>
            <IconButton color="error" onClick={() => handleAcceptDecline("DECLINED")}>
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
