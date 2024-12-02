package com.polyquest.polyquestapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.polyquest.polyquestapi.model.FeedbackAnswer;

@Repository
public interface FeedbackAnswerRepository  extends JpaRepository<FeedbackAnswer, Integer> {
    // Custom queries can be defined here if needed
}
