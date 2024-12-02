package com.polyquest.polyquestapi.controllers;

import com.polyquest.polyquestapi.model.FeedbackQuestion;
import com.polyquest.polyquestapi.services.FeedbackQuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/feedback-question")
public class FeedbackQuestionController {
    private final FeedbackQuestionService feedbackQuestionService;

    @Autowired
    public FeedbackQuestionController(FeedbackQuestionService feedbackQuestionService) {
        this.feedbackQuestionService = feedbackQuestionService;
    }

    @GetMapping
    public List<FeedbackQuestion> getQuestions() {
        return feedbackQuestionService.getQuestions();
    }

    @GetMapping("/{questionId}")
    public FeedbackQuestion getQuestion(@PathVariable Integer questionId) {
        return feedbackQuestionService.getQuestion(questionId);
    }

}
