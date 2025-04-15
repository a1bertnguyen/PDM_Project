package com.PDM_Project.task.service.Service;

import com.PDM_Project.task.service.Repository.TaskRepository;
import com.PDM_Project.task.service.modal.Task;
import com.PDM_Project.task.service.modal.TaskStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
@Service

public class TaskServiceImplementation implements TaskService {

    @Autowired
    private TaskRepository taskRepository;


    @Override
    public Task createdTask(Task task, String requesterRole) throws Exception {
        if(!requesterRole.equals(("ROLE_ADMIN"))){
            throw new Exception("only admin can create task");
        }

        task.setStatus(TaskStatus.PENDING);
        task.setCreatedAt(LocalDateTime.now());
        return taskRepository.save(task);
    }


    @Override
    public Task getTaskByID(Long id) throws Exception {
        return taskRepository.findById(id).orElseThrow(()->new Exception("Task not found with id: " + id));
    }

    @Override
    public List<Task> getAllTask(TaskStatus status) {
        List<Task> allTask = taskRepository.findAll();

        List<Task> filteredTask = allTask.stream().filter(
                task -> status ==null || task.getStatus().name().equalsIgnoreCase(status.toString()))
                .collect(Collectors.toList());

        return filteredTask;
    }

    @Override
    public Task updateTask(long id, Task updatedTask, Long userId) throws Exception {
        Task existingTask = getTaskByID(id);

        if(updatedTask.getTitle()!=null){
            existingTask.setTitle(updatedTask.getTitle());

        }
        if(updatedTask.getDescription()!=null){
            existingTask.setDescription(updatedTask.getDescription());
        }
        if (updatedTask.getImage()!=null){
            existingTask.setImage(updatedTask.getImage());
        }
        if (updatedTask.getStatus()!=null){
            existingTask.setStatus(updatedTask.getStatus());
        }
       if(updatedTask.getDeadline()!=null){
           existingTask.setDeadline(updatedTask.getDeadline());
       }


        return taskRepository.save(existingTask);
    }

    @Override
    public void deleteTask(long id) throws Exception {

        getTaskByID(id);

        taskRepository.deleteById(id);

    }

    @Override
    public Task assignedToUser(long taskId, long userId) throws Exception {
        Task task = getTaskByID(taskId);
        task.setAssignedUserId(userId);
        task.setStatus(TaskStatus.DONE);


        return taskRepository.save(task);
    }

    @Override
    public List<Task> assignedUsersTask(Long userId, TaskStatus status) throws Exception {
        List<Task> allTask = taskRepository.findByAssignedUserId(userId);

        List<Task> filteredTask = allTask.stream().filter(
                        task -> status ==null || task.getStatus().name().equalsIgnoreCase(status.toString()))
                .collect(Collectors.toList());

        return filteredTask;
    }

    @Override
    public Task completedTask(long taskId) throws Exception {
        Task task = getTaskByID(taskId);
        task.setStatus(TaskStatus.DONE);
        return taskRepository.save(task);
    }
}
