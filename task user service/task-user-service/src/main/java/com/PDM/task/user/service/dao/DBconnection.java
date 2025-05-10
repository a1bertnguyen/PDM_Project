package com.PDM.task.user.service.dao;

import java.sql.Connection;
import java.sql.DriverManager;

public class DBconnection {
    // DBConnection.java
    public class DBConnection {
        private static final String URL = "jdbc:mysql://localhost:3307/ pdm_project";
        private static final String USER = "root";
        private static final String PASSWORD = "Qu@ngminh80";

        public static Connection getConnection() throws Exception {
            Class.forName("com.mysql.cj.jdbc.Driver");
            return DriverManager.getConnection(URL, USER, PASSWORD);
        }
    }

}
