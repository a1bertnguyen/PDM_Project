package com.PDM_Project.task.service.Service;

import com.PDM_Project.task.service.DAO.TaskDAO;
import com.PDM_Project.task.service.modal.Task;
import com.PDM_Project.task.service.modal.TaskStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskServiceImplementation implements TaskService {

    @Autowired
    private DataSource dataSource;

    @Override
    public Task createdTask(Task task, String requesterRole) throws Exception {
        if (!requesterRole.equals("ROLE_ADMIN")) {
            throw new Exception("only admin can create task");
        }
        task.setStatus(TaskStatus.PENDING);
        task.setCreatedAt(LocalDateTime.now());

        try (Connection conn = dataSource.getConnection()) {
            TaskDAO dao = new TaskDAO(conn);
            return dao.save(task);
        }
    }

    @Override
    public Task getTaskByID(Long id) throws Exception {
        try (Connection conn = dataSource.getConnection()) {
            TaskDAO dao = new TaskDAO(conn);
            return dao.findById(id).orElseThrow(() -> new Exception("Task not found with id: " + id));
        }
    }

    @Override
    public List<Task> getAllTask(TaskStatus status, Long userId) {
        try (Connection conn = dataSource.getConnection()) {
            TaskDAO dao = new TaskDAO(conn);

            List<Task> allTasks = dao.findAll();

            return allTasks.stream()
                    .filter(task -> task.getCreatedBy().equals(userId))
                    .filter(task -> status == null || task.getStatus().name().equalsIgnoreCase(status.toString()))
                    .collect(Collectors.toList());
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Task updateTask(long id, Task updatedTask, Long userId) throws Exception {
        try (Connection conn = dataSource.getConnection()) {
            TaskDAO dao = new TaskDAO(conn);
            Task existingTask = dao.findById(id).orElseThrow(() -> new Exception("Task not found with id: " + id));

            if (updatedTask.getTitle() != null) {
                existingTask.setTitle(updatedTask.getTitle());
            }
            if (updatedTask.getDescription() != null) {
                existingTask.setDescription(updatedTask.getDescription());
            }
            if (updatedTask.getImage() != null) {
                existingTask.setImage(updatedTask.getImage());
            }
            if (updatedTask.getStatus() != null) {
                existingTask.setStatus(updatedTask.getStatus());
            }
            if (updatedTask.getDeadline() != null) {
                existingTask.setDeadline(updatedTask.getDeadline());
            }
            if (updatedTask.getTags() != null) {
                existingTask.setTags(updatedTask.getTags());
            }

            return dao.save(existingTask); // save() handles both insert & update
        }
    }

    @Override
    public void deleteTask(long id) throws Exception {
        try (Connection conn = dataSource.getConnection()) {
            TaskDAO dao = new TaskDAO(conn);
            Task task = dao.findById(id).orElseThrow(() -> new Exception("Task not found with id: " + id));
            dao.deleteById(id);
        }
    }

    @Override
    public Task assignedToUser(long taskId, long userId) throws Exception {
        try (Connection conn = dataSource.getConnection()) {
            TaskDAO dao = new TaskDAO(conn);
            Task task = dao.findById(taskId).orElseThrow(() -> new Exception("Task not found with id: " + taskId));

            task.setAssignedUserId(userId);
            task.setStatus(TaskStatus.DONE);
            Task updatedTask = dao.save(task);

            dao.saveTaskInvitation(taskId, userId);

            return updatedTask;
        }
    }

    @Override
    public List<Task> assignedUsersTask(Long userId, TaskStatus status) throws Exception {
        try (Connection conn = dataSource.getConnection()) {
            TaskDAO dao = new TaskDAO(conn);
            List<Task> allTask = dao.findByAssignedUserId(userId);
            return allTask.stream()
                    .filter(task -> status == null || task.getStatus().name().equalsIgnoreCase(status.toString()))
                    .collect(Collectors.toList());
        }
    }

    @Override
    public Task completedTask(long taskId) throws Exception {
        try (Connection conn = dataSource.getConnection()) {
            TaskDAO dao = new TaskDAO(conn);
            Task task = dao.findById(taskId).orElseThrow(() -> new Exception("Task not found with id: " + taskId));
            task.setStatus(TaskStatus.DONE);
            return dao.save(task);
        }
    }

    @Override
    public Task getTaskByID(Long id, Long requesterId) throws Exception {
        try (Connection conn = dataSource.getConnection()) {
            TaskDAO dao = new TaskDAO(conn);
            Task task = dao.findById(id).orElseThrow(() -> new Exception("Task not found with id: " + id));

            boolean isOwner = task.getCreatedBy().equals(requesterId);
            if (!isOwner) {
                throw new Exception("Access denied: You are not allowed to access this task.");
            }

            return task;
        }
    }

}
