package com.polyquest.polyquestapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.polyquest.polyquestapi.model.Feedback;
import com.polyquest.polyquestapi.model.Student;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {
    // Find all feedback entries by student ID
    List<Feedback> findAllByStudent(Student student);
}

