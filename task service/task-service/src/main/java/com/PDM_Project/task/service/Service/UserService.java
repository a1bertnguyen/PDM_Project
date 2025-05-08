// com.PDM_Project.task.service.Service.UserService.java
package com.PDM_Project.task.service.Service;

import com.PDM_Project.task.service.config.FeignConfig;
import com.PDM_Project.task.service.modal.UserDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "USER-SERVICE", url = "http://localhost:2055", configuration = FeignConfig.class)
public interface UserService {
    @GetMapping("/api/users/profile")
    public UserDto getUserProfile(@RequestHeader("Authorization") String jwt);
}