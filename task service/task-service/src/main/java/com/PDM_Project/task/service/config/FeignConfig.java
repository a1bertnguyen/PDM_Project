// com.PDM_Project.task.service.config.FeignConfig.java
package com.PDM_Project.task.service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import feign.RequestInterceptor;

@Configuration
public class FeignConfig {
    @Bean
    public RequestInterceptor requestInterceptor() {
        return requestTemplate -> {
            // Bảo toàn header Authorization đúng cách
            requestTemplate.header("Authorization",
                    requestTemplate.headers().get("Authorization").stream().findFirst().orElse(null));
        };
    }
}