package com.zosh.task_submission_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.zosh.task_submission_service.modal.Submission;

import java.util.List;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    List<Submission> findByTaskId(Long taskId);
}
