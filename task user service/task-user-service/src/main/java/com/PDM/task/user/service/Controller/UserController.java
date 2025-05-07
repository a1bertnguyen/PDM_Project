package com.PDM.task.user.service.Controller;

import com.PDM.task.user.service.Service.UserService;
import com.PDM.task.user.service.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<User>getUserProfile(@RequestHeader("Authorization")String jwt){
        User user = userService.getUserProfile(jwt);
        return new ResponseEntity<>(user,HttpStatus.OK);
    }
    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam("q") String query,
                                                  @RequestHeader("Authorization") String jwt) {
        List<User> users = userService.searchUsers(query, jwt);
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping()
    public ResponseEntity<List<User>>getUsers(@RequestHeader("Authorization")String jwt){
        List <User> users = userService.getAllUsers();
        return new ResponseEntity<>(users,HttpStatus.OK);
    }
}
