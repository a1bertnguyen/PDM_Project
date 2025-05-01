package com.PDM.gateway.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/fallback")
public class FallbackController {

    @GetMapping("/user")
    public ResponseEntity<Map<String, String>> userServiceFallback() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "User Service is currently unavailable. Please try again later.");
        response.put("status", "Service Unavailable");
        return new ResponseEntity<>(response, HttpStatus.SERVICE_UNAVAILABLE);
    }

    @GetMapping("/task")
    public ResponseEntity<Map<String, String>> taskServiceFallback() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Task Service is currently unavailable. Please try again later.");
        response.put("status", "Service Unavailable");
        return new ResponseEntity<>(response, HttpStatus.SERVICE_UNAVAILABLE);
    }

    @GetMapping("/submission")
    public ResponseEntity<Map<String, String>> submissionServiceFallback() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Submission Service is currently unavailable. Please try again later.");
        response.put("status", "Service Unavailable");
        return new ResponseEntity<>(response, HttpStatus.SERVICE_UNAVAILABLE);
    }
}