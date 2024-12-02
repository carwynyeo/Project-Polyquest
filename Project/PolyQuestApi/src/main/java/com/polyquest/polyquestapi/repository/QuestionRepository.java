package com.polyquest.polyquestapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.polyquest.polyquestapi.model.Question;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Integer> {
    // Custom queries can be defined here if needed

    // Find questions containing a keyword in the questionText
    List<Question> findByQuestionTextContaining(String keyword);
}

