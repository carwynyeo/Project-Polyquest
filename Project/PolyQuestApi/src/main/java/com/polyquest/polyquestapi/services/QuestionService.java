package com.polyquest.polyquestapi.services;

import com.polyquest.polyquestapi.model.Question;
import com.polyquest.polyquestapi.repository.QuestionRepository;
import java.sql.Timestamp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;

    @Autowired
    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    // Create a new question
    public Question createQuestion(Question question) {
        question.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        return questionRepository.save(question);
    }

    // Get a question by its ID
    public Question getQuestionById(Integer id) {
        return questionRepository.findById(id).orElse(null);
    }

    // Get all questions (Iterable)
    public Iterable<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    // Get all questions (List)
    public List<Question> getAllQuestionsAsList() {
        return questionRepository.findAll();  // JpaRepository returns List by default
    }

    // Update an existing question by ID
    public Question updateQuestion(Integer id, Question updatedQuestion) {
        return questionRepository.findById(id)
                .map(question -> {
                    question.setQuestionText(updatedQuestion.getQuestionText());
                    question.setUpdatedAt(new java.sql.Timestamp(System.currentTimeMillis()));
                    return questionRepository.save(question);
                })
                .orElse(null);  // Return null if the question with the provided ID doesn't exist
    }

    // Delete a question by its ID
    public boolean deleteQuestion(Integer id) {
        try {
            questionRepository.deleteById(id);
            return true;
        } catch (EmptyResultDataAccessException e) {
            System.err.println("Question with ID " + id + " does not exist: " + e.getMessage());
            return false;
        } catch (Exception e) {
            System.err.println("An error occurred while trying to delete Question with ID " + id + ": " + e.getMessage());
            return false;
        }
    }

    // Search questions by keyword in the question text
    public List<Question> searchQuestionsByKeyword(String keyword) {
        return questionRepository.findByQuestionTextContaining(keyword);
    }
}
