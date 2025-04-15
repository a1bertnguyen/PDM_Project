package com.PDM.task.user.service.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "Users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String password;
    private String email;
    private String role;
    private String fullName;





}
