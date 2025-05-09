package com.PDM_Project.task.service.Controller;

import com.PDM_Project.task.service.Service.TaskService;
import com.PDM_Project.task.service.Service.UserService;
import com.PDM_Project.task.service.modal.Task;
import com.PDM_Project.task.service.modal.TaskStatus;
import com.PDM_Project.task.service.modal.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task,
                                           @RequestHeader("Authorization") String jwt) throws Exception {
        UserDto user = userService.getUserProfile(jwt);
        task.setCreatedBy(user.getId());
        task.setUserId(user.getId());

        Task createdTask = taskService.createdTask(task, user.getRole());
        return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable long id,
                                            @RequestHeader("Authorization") String jwt) throws Exception {
        UserDto user = userService.getUserProfile(jwt);
        Task task = taskService.getTaskByID(id, user.getId());
        return new ResponseEntity<>(task, HttpStatus.OK);
    }


    // com.PDM_Project.task.service.Controller.TaskController.java
    @GetMapping
    public ResponseEntity<List<Task>> getAllTask(
            @RequestParam(required = false) TaskStatus status,
            @RequestHeader("Authorization") String jwt) throws Exception {
        // Đảm bảo jwt có đúng định dạng "Bearer ..."
        if (jwt != null && !jwt.startsWith("Bearer ")) {
            jwt = "Bearer " + jwt;
        }
        UserDto user = userService.getUserProfile(jwt);
        List<Task> tasks = taskService.getAllTask(status, user.getId());
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    @GetMapping("/user")
    public ResponseEntity<List<Task>> getAssignedUsersTask(
            @RequestParam(required = false) TaskStatus status,
            @RequestHeader("Authorization") String jwt) throws Exception {
        UserDto user = userService.getUserProfile(jwt);
        List<Task> tasks = taskService.assignedUsersTask(user.getId(), status);
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    @PutMapping("/{id}/user/{userid}/assign")
    public ResponseEntity<Task> assignTaskToUser(
            @PathVariable long id,
            @PathVariable long userid,
            @RequestHeader("Authorization") String jwt) throws Exception {
        userService.getUserProfile(jwt);
        Task task = taskService.assignedToUser(id, userid);
        return new ResponseEntity<>(task, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(
            @PathVariable long id,
            @RequestBody Task request,
            @RequestHeader("Authorization") String jwt) throws Exception {
        UserDto user = userService.getUserProfile(jwt);
        Task updatedTask = taskService.updateTask(id, request, user.getId());
        return new ResponseEntity<>(updatedTask, HttpStatus.OK);
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<Task> completeTask(
            @PathVariable long id,
            @RequestHeader("Authorization") String jwt) throws Exception {
        userService.getUserProfile(jwt);
        Task task = taskService.completedTask(id);
        return new ResponseEntity<>(task, HttpStatus.OK);
    }





    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable long id,
            @RequestHeader("Authorization") String jwt) throws Exception {
        userService.getUserProfile(jwt);
        taskService.deleteTask(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
