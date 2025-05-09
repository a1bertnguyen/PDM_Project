package com.PDM.task.user.service.Service;

import com.PDM.task.user.service.config.JwtProvider;
import com.PDM.task.user.service.dao.UserDAO;
import com.PDM.task.user.service.model.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImplementation implements UserService {
    private final UserDAO userDAO = new UserDAO();

    @Override
    public User getUserProfile(String jwt){
        String email = JwtProvider.getEmailFromJwtToken(jwt);
        return userDAO.findByEmail(email);
    }
    @Override
    public List<User> searchUsers(String keyword, String jwt) {
        String email = JwtProvider.getEmailFromJwtToken(jwt);
        return userDAO.searchUsersByName(keyword, email);
    }


    @Override
    public List<User> getAllUsers() {
        return userDAO.findAll();
    }
}

