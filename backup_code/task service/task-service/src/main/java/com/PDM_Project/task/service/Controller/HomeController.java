package com.PDM_Project.task.service.Controller;

import com.PDM_Project.task.service.modal.Task;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/task")
    public ResponseEntity<String> getAssignedTask(){

        return new ResponseEntity<>("Welcome to task service", HttpStatus.OK);
    }
}
