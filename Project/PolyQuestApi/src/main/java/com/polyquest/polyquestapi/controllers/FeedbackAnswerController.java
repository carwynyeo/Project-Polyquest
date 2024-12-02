package com.polyquest.polyquestapi.controllers;

import com.polyquest.polyquestapi.dto.FeedbackAnswerReq;
import com.polyquest.polyquestapi.model.FeedbackAnswer;
import com.polyquest.polyquestapi.services.FeedbackAnswerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/feedback-answer")
public class FeedbackAnswerController {

    private final FeedbackAnswerService feedbackAnswerService;

    @Autowired
    public FeedbackAnswerController(FeedbackAnswerService feedbackAnswerService) {
        this.feedbackAnswerService = feedbackAnswerService;
    }

    @PostMapping(value = "/feedback/{feedbackId}/question/{questionId}/answer",
            consumes = {"application/json"}, produces = {"application/json"})
    public FeedbackAnswer createFeedbackAnswer(
            @PathVariable("feedbackId") Integer feedbackId,
            @PathVariable("questionId") Integer questionId,
            @RequestBody FeedbackAnswerReq answerReq) {  // Use FeedbackAnswerReq as the request body type
        return feedbackAnswerService.createFeedbackAnswer(answerReq, feedbackId, questionId);
    }

}
