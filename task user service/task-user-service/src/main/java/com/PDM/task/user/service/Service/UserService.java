package com.PDM.task.user.service.Service;

import com.PDM.task.user.service.model.User;

import java.util.List;

public interface UserService {
    public User getUserProfile (String jwt);

    public List<User> getAllUsers();
    List<User> searchUsers(String keyword, String jwt);


}
