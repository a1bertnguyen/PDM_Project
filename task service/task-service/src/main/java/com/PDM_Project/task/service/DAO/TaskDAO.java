package com.PDM_Project.task.service.DAO;

import com.PDM_Project.task.service.modal.Task;
import com.PDM_Project.task.service.modal.TaskStatus;

import java.sql.*;
import java.util.*;

public class TaskDAO {
    private Connection connection;

    public TaskDAO(Connection connection) {
        this.connection = connection;
    }

    public Task save(Task task) throws SQLException {
        if (task.getId() == null) {
            String sql = "INSERT INTO tasks (title, description, image, assigned_user_id, status, deadline, created_at, user_id, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            try (PreparedStatement stmt = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
                stmt.setString(1, task.getTitle());
                stmt.setString(2, task.getDescription());
                stmt.setString(3, task.getImage());
                stmt.setObject(4, task.getAssignedUserId(), Types.BIGINT);
                stmt.setString(5, task.getStatus().toString());
                stmt.setTimestamp(6, Timestamp.valueOf(task.getDeadline()));
                stmt.setTimestamp(7, Timestamp.valueOf(task.getCreatedAt()));
                stmt.setLong(8, task.getUserId());
                stmt.setLong(9, task.getCreatedBy());

                stmt.executeUpdate();

                ResultSet rs = stmt.getGeneratedKeys();
                if (rs.next()) {
                    task.setId(rs.getLong(1));
                }
            }
        } else {
            String sql = "UPDATE tasks SET title = ?, description = ?, image = ?, assigned_user_id = ?, status = ?, deadline = ?, created_at = ?, created_by = ?, user_id = ? WHERE id = ?";
            try (PreparedStatement stmt = connection.prepareStatement(sql)) {
                stmt.setString(1, task.getTitle());
                stmt.setString(2, task.getDescription());
                stmt.setString(3, task.getImage());
                stmt.setObject(4, task.getAssignedUserId(), Types.BIGINT);
                stmt.setString(5, task.getStatus().toString());
                stmt.setTimestamp(6, Timestamp.valueOf(task.getDeadline()));
                stmt.setTimestamp(7, Timestamp.valueOf(task.getCreatedAt()));
                stmt.setLong(8, task.getUserId());
                stmt.setLong(9, task.getCreatedBy());
                stmt.setLong(10, task.getId());

                stmt.executeUpdate();
            }
        }
        saveTags(task);
        return task;
    }

    public Optional<Task> findById(Long id) throws SQLException {
        String sql = "SELECT * FROM tasks WHERE id = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setLong(1, id);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                Task task = mapRowToTask(rs);
                task.setTags(getTagsByTaskId(task.getId()));
                return Optional.of(task);
            }
        }
        return Optional.empty();
    }

    public List<Task> findAll() throws SQLException {
        List<Task> tasks = new ArrayList<>();
        String sql = "SELECT * FROM tasks";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                Task task = mapRowToTask(rs);
                task.setTags(getTagsByTaskId(task.getId()));
                tasks.add(task);
            }
        }
        return tasks;
    }
    public void saveTaskInvitation(Long taskId, Long userId) throws SQLException {
        String sql = "INSERT INTO task_invitations (task_id, invited_user_id) VALUES (?, ?)";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setLong(1, taskId);
            stmt.setLong(2, userId);
            stmt.executeUpdate();
        }
    }


    public void deleteById(Long id) throws SQLException {
        String sql = "DELETE FROM tasks WHERE id = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setLong(1, id);
            stmt.executeUpdate();
        }
    }

    public List<Task> findByAssignedUserId(Long userId) throws SQLException {
        List<Task> tasks = new ArrayList<>();
        String sql = "SELECT * FROM tasks WHERE assigned_user_id = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setLong(1, userId);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                Task task = mapRowToTask(rs);
                task.setTags(getTagsByTaskId(task.getId()));
                tasks.add(task);
            }
        }
        return tasks;
    }

    private void saveTags(Task task) throws SQLException {
        String deleteSql = "DELETE FROM task_tags WHERE task_id = ?";
        try (PreparedStatement del = connection.prepareStatement(deleteSql)) {
            del.setLong(1, task.getId());
            del.executeUpdate();
        }

        String insertSql = "INSERT INTO task_tags (task_id, tag) VALUES (?, ?)";
        try (PreparedStatement ins = connection.prepareStatement(insertSql)) {
            for (String tag : task.getTags()) {
                ins.setLong(1, task.getId());
                ins.setString(2, tag);
                ins.addBatch();
            }
            ins.executeBatch();
        }
    }

    private List<String> getTagsByTaskId(Long taskId) throws SQLException {
        List<String> tags = new ArrayList<>();
        String sql = "SELECT tag FROM task_tags WHERE task_id = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setLong(1, taskId);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                tags.add(rs.getString("tag"));
            }
        }
        return tags;
    }

    private Task mapRowToTask(ResultSet rs) throws SQLException {
        Task task = new Task();
        task.setId(rs.getLong("id"));
        task.setTitle(rs.getString("title"));
        task.setDescription(rs.getString("description"));
        task.setImage(rs.getString("image"));
        task.setAssignedUserId(rs.getLong("assigned_user_id"));
        task.setStatus(TaskStatus.valueOf(rs.getString("status")));
        task.setDeadline(rs.getTimestamp("deadline").toLocalDateTime());
        task.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        task.setUserId(rs.getLong("user_id"));
        task.setCreatedBy(rs.getLong("created_by"));

        return task;
    }
}
