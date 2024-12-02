package com.polyquest.polyquestapi.services;

import com.polyquest.polyquestapi.model.FeedbackQuestion;
import com.polyquest.polyquestapi.repository.FeedbackQuestionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackQuestionService {
    protected FeedbackQuestionRepository feedbackQuestionRepository;

    public FeedbackQuestionService(FeedbackQuestionRepository feedbackQuestionRepository) {
        this.feedbackQuestionRepository = feedbackQuestionRepository;
    }

    public List<FeedbackQuestion> getQuestions() {
        return feedbackQuestionRepository.findAll();
    }

    public FeedbackQuestion getQuestion(Integer questionId) {
        return feedbackQuestionRepository.findById(questionId).orElse(null);
    }
}