package com.polyquest.polyquestapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.polyquest.polyquestapi.model.FeedbackQuestion;

@Repository
public interface FeedbackQuestionRepository extends JpaRepository<FeedbackQuestion, Integer> {
    // Custom queries can be defined here if needed
}
