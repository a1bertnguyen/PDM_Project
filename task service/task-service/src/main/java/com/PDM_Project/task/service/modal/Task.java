package com.PDM_Project.task.service.modal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Task {

    private Long id;

    private String title;

    private String description;

    private String image;

    private Long assignedUserId;

    private TaskStatus status;

    private List<String> tags = new ArrayList<>();

    private LocalDateTime deadline;

    private LocalDateTime createdAt;

    private Long userId;


    private Long createdBy;
}
