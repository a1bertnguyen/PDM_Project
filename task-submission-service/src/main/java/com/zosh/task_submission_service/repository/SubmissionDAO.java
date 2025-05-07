package com.zosh.task_submission_service.repository;

import com.zosh.task_submission_service.modal.Submission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Repository
public class SubmissionDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<Submission> submissionRowMapper = (rs, rowNum) -> {
        Submission submission = new Submission();
        submission.setId(rs.getLong("id"));
        submission.setTaskId(rs.getLong("task_id"));
        submission.setUserId(rs.getLong("user_id"));
        submission.setGithublink(rs.getString("githublink"));
        submission.setStatus(rs.getString("status"));
        submission.setSubmissionTime(rs.getTimestamp("submission_time").toLocalDateTime());
        return submission;
    };

    public Submission save(Submission submission) {
        String sql = "INSERT INTO submission (task_id, user_id, githublink, status, submission_time) VALUES (?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                submission.getTaskId(),
                submission.getUserId(),
                submission.getGithublink(),
                submission.getStatus(),
                Timestamp.valueOf(submission.getSubmissionTime())
        );
        Long id = jdbcTemplate.queryForObject("SELECT LAST_INSERT_ID()", Long.class);
        submission.setId(id);
        return submission;
    }

    public Optional<Submission> findById(Long id) {
        String sql = "SELECT * FROM submission WHERE id = ?";
        List<Submission> result = jdbcTemplate.query(sql, submissionRowMapper, id);
        return result.isEmpty() ? Optional.empty() : Optional.of(result.get(0));
    }

    public List<Submission> findAll() {
        String sql = "SELECT * FROM submission";
        return jdbcTemplate.query(sql, submissionRowMapper);
    }

    public List<Submission> findByTaskId(Long taskId) {
        String sql = "SELECT * FROM submission WHERE task_id = ?";
        return jdbcTemplate.query(sql, submissionRowMapper, taskId);
    }

    public void updateStatus(Long id, String status) {
        String sql = "UPDATE submission SET status = ? WHERE id = ?";
        jdbcTemplate.update(sql, status, id);
    }
}
