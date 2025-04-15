package com.PDM_Project.task.service.Repository;

import com.PDM_Project.task.service.modal.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import com.PDM_Project.task.service.modal.Task;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByAssignedUserId(Long userId);


}
