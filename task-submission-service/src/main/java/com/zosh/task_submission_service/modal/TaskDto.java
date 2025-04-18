package com.zosh.task_submission_service.modal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data

public class TaskDto {
    private Long id;

    private String title;

    private String description;

    private String image;

    private Long assignedUserId;

    private TaskStatus status;

    private List<String> tags = new ArrayList<>();

    private LocalDateTime deadline;

    private LocalDateTime createdAt;
}
