package com.zosh.task_submission_service.service;

import com.zosh.task_submission_service.modal.Submission;
import java.util.List;

public interface SubmissionService {
    Submission submitTask(Long taskId, String githubLink, Long userID, String jwt) throws Exception;

    Submission getTaskSubmissionById(Long submissionId) throws Exception;

    List<Submission> getAllTaskSubmission();

    List<Submission> getTaskSubmissionByTaskId(Long taskId);

    Submission acceptDeclineSubmission(Long id, String status,String jwt) throws Exception;

}
