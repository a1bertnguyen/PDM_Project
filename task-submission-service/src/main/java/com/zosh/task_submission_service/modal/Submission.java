package com.zosh.task_submission_service.modal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class Submission {
    private Long id;
    private Long taskId;
    private String githublink;
    private Long userId;
    private String status = "PENDING";
    private LocalDateTime submissionTime;
}
