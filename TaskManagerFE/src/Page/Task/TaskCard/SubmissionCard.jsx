// src/Page/Task/TaskCard/SubmissionCard.jsx
import React from "react";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Button, IconButton, Tooltip } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from "react-redux";
import { acceptDeclineSubmission } from "../../../ReduxToolkit/SubmissionSlice";
import { format } from 'date-fns';

const SubmissionCard = ({ submission, isAdmin }) => {
    const dispatch = useDispatch();
    const { status } = useSelector(store => store.submission);
    const loading = status === 'loading';

    const handleAcceptDecline = (status) => {
        dispatch(acceptDeclineSubmission({
            id: submission.id,
            status: status
        }));
    };

    // Format submission time
    const formattedDate = submission.submissionTime
        ? format(new Date(submission.submissionTime), 'MMM dd, yyyy HH:mm')
        : 'N/A';

    return (
        <div className='rounded-md bg-gray-900 p-5 flex items-center justify-between'>
            <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                    <span>GitHub: </span>
                    <div className='flex items-center gap-2 text-[#c24dd0]'>
                        <OpenInNewIcon />
                        <a
                            href={submission.githublink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                        >
                            Go To Link
                        </a>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <p>Submission Time: </p>
                    <p className="text-gray-400">{formattedDate}</p>
                </div>
                <div className="text-xs">
                    <p>Status: <span className={
                        submission.status === 'ACCEPTED'
                            ? 'text-green-500'
                            : submission.status === 'DECLINED'
                                ? 'text-red-500'
                                : 'text-yellow-500'
                    }>
                        {submission.status}
                    </span></p>
                </div>
            </div>
            <div>
                {isAdmin && submission.status === 'PENDING' ? (
                    <div className="flex gap-5">
                        <Tooltip title="Accept Submission">
                            <div className="text-green-500">
                                <IconButton
                                    color="success"
                                    onClick={() => handleAcceptDecline("ACCEPTED")}
                                    disabled={loading}
                                >
                                    <CheckIcon />
                                </IconButton>
                            </div>
                        </Tooltip>
                        <Tooltip title="Decline Submission">
                            <div className="text-red-500">
                                <IconButton
                                    color="error"
                                    onClick={() => handleAcceptDecline("DECLINED")}
                                    disabled={loading}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </div>
                        </Tooltip>
                    </div>
                ) : (
                    <Button
                        color={submission.status === 'ACCEPTED' ? "success" : "error"}
                        size="small"
                        variant="outlined"
                        disabled={true}
                    >
                        {submission.status === 'ACCEPTED' ? 'Accepted' : submission.status === 'DECLINED' ? 'Declined' : 'Pending'}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default SubmissionCard;