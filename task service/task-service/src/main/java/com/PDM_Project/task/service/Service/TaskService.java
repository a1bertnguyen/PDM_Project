package com.PDM_Project.task.service.Service;

import com.PDM_Project.task.service.modal.Task;
import com.PDM_Project.task.service.modal.TaskStatus;

import java.util.List;

public interface TaskService {

    Task createdTask(Task task, String requesterRole) throws Exception;

    Task getTaskByID(Long id) throws Exception;

    List<Task> getAllTask(TaskStatus status, Long userId);

    Task updateTask(long id, Task updatedTask, Long userId) throws Exception;

    void deleteTask(long id) throws Exception;

    Task assignedToUser(long taskId, long userId) throws Exception;

    List<Task> assignedUsersTask(Long userId, TaskStatus status) throws Exception;

    Task completedTask(long taskId) throws Exception;

    Task getTaskByID(Long id, Long requesterId) throws Exception;

}
