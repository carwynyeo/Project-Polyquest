package com.polyquest.polyquestapi.controllers;

import com.polyquest.polyquestapi.dto.FeedbackReq;
import com.polyquest.polyquestapi.model.Feedback;
import com.polyquest.polyquestapi.services.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    @Autowired
    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    // Get all feedback entries by student ID
    @GetMapping("/student/{studentId}")
    public List<Feedback> getAllFeedbackByStudent(@PathVariable int studentId) {
        return feedbackService.getAllFeedbackByStudent(studentId);
    }

    // Get feedback by its ID
    @GetMapping("/{id}")
    public Feedback getFeedbackById(@PathVariable Integer id) {
        return feedbackService.getFeedback(id);
    }

    // Create a new feedback entry for a specific student
    @PostMapping(value = "/student/{studentId}", consumes = {"application/json"}, produces = {"application/json"})
    public Feedback createFeedback(@PathVariable int studentId, @RequestBody FeedbackReq feedbackReq) {
        return feedbackService.createFeedback(feedbackReq, studentId);
    }

    // Delete a feedback entry by its ID
    @DeleteMapping("/{id}")
    public boolean deleteFeedback(@PathVariable Integer id) {
        return feedbackService.deleteFeedback(id);
    }
}
