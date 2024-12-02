package com.polyquest.polyquestapi.services;

import com.polyquest.polyquestapi.dto.FeedbackAnswerReq;
import com.polyquest.polyquestapi.model.Feedback;
import com.polyquest.polyquestapi.model.FeedbackAnswer;
import com.polyquest.polyquestapi.model.FeedbackQuestion;
import com.polyquest.polyquestapi.repository.FeedbackAnswerRepository;
import com.polyquest.polyquestapi.repository.FeedbackQuestionRepository;
import com.polyquest.polyquestapi.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;

@Service
public class FeedbackAnswerService {

    private final FeedbackAnswerRepository feedbackAnswerRepository;
    private final FeedbackQuestionRepository feedbackQuestionRepository;
    private final FeedbackRepository feedbackRepository;

    @Autowired
    public FeedbackAnswerService(FeedbackAnswerRepository feedbackAnswerRepository,
                                 FeedbackQuestionRepository feedbackQuestionRepository,
                                 FeedbackRepository feedbackRepository) {
        this.feedbackAnswerRepository = feedbackAnswerRepository;
        this.feedbackQuestionRepository = feedbackQuestionRepository;
        this.feedbackRepository = feedbackRepository;
    }

    public FeedbackAnswer createFeedbackAnswer(FeedbackAnswerReq answer, Integer feedbackId, Integer questionId) {
        // Fetch the Feedback by feedbackId
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));

        // Fetch the FeedbackQuestion by questionId
        FeedbackQuestion feedbackQuestion = feedbackQuestionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        // Set both the feedback and feedbackQuestion in FeedbackAnswer
        // Create new answer in FeedbackAnswer
        FeedbackAnswer feedbackAnswer = new FeedbackAnswer();
        feedbackAnswer.setFeedback(feedback);
        feedbackAnswer.setFeedbackQuestion(feedbackQuestion);
        feedbackAnswer.setAnswer(answer.getAnswer());
        feedbackAnswer.setCreatedAt(new Timestamp(System.currentTimeMillis()));

        // Save the answer in the repository
        return feedbackAnswerRepository.save(feedbackAnswer);
    }
}
