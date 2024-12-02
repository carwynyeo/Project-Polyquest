package com.polyquest.polyquestapi.controllers;

import com.polyquest.polyquestapi.model.Question;
import com.polyquest.polyquestapi.services.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/question")
public class QuestionController {

    private final QuestionService questionService;

    @Autowired
    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    // Create a new question
    @PostMapping
    public Question createQuestion(@RequestBody Question question) {
        return questionService.createQuestion(question);
    }

    // Get a question by its ID
    @GetMapping("/{id}")
    public Question getQuestionById(@PathVariable Integer id) {
        return questionService.getQuestionById(id);
    }

    // Get all questions
    @GetMapping
    public Iterable<Question> getAllQuestions() {
        return questionService.getAllQuestions();
    }

    // Get all questions as a list
    @GetMapping("/list")
    public List<Question> getAllQuestionsAsList() {
        return questionService.getAllQuestionsAsList();
    }

    // Update a question by its ID
    @PutMapping("/{id}")
    public Question updateQuestion(@PathVariable Integer id, @RequestBody Question updatedQuestion) {
        return questionService.updateQuestion(id, updatedQuestion);
    }

    // Delete a question by its ID
    @DeleteMapping("/{id}")
    public boolean deleteQuestion(@PathVariable Integer id) {
        return questionService.deleteQuestion(id);
    }

    // Search questions by keyword in the question text
    @GetMapping("/search")
    public List<Question> searchQuestionsByKeyword(@RequestParam String keyword) {
        return questionService.searchQuestionsByKeyword(keyword);
    }

}
