package com.polyquest.polyquestapi.services;

import com.polyquest.polyquestapi.dto.FeedbackReq;
import com.polyquest.polyquestapi.model.Feedback;
import com.polyquest.polyquestapi.model.Student;
import com.polyquest.polyquestapi.repository.FeedbackRepository;
import com.polyquest.polyquestapi.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.dao.EmptyResultDataAccessException;

import java.util.List;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final StudentRepository studentRepository;

    @Autowired
    public FeedbackService(FeedbackRepository feedbackRepository, StudentRepository studentRepository) {
        this.feedbackRepository = feedbackRepository;
        this.studentRepository = studentRepository;
    }

    // Create a new feedback entry for a specific student
    public Feedback createFeedback(FeedbackReq feedbackReq, int studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Feedback feedback = new Feedback();
        feedback.setStudent(student);
        feedback.setMessage(feedbackReq.getMessage());

        return feedbackRepository.save(feedback);
    }


    // Get feedback by its ID
    public Feedback getFeedback(Integer id) {
        return feedbackRepository.findById(id).orElse(null);
    }

    // Get all feedback entries by student ID
    public List<Feedback> getAllFeedbackByStudent(int studentId) {
        Student student = studentRepository.findById(studentId).orElse(null);
        if (student != null) {
            return feedbackRepository.findAllByStudent(student);
        }
        return null;  // Return null if student not found
    }

    // Delete a feedback entry by its ID
    public boolean deleteFeedback(Integer id) {
        try {
            feedbackRepository.deleteById(id);
            return true;
        } catch (EmptyResultDataAccessException e) {
            // This exception occurs when no entity exists for the given ID
            System.err.println("Feedback with ID " + id + " does not exist: " + e.getMessage());
            return false;
        } catch (Exception e) {
            // Handle other unforeseen exceptions
            System.err.println("An error occurred while trying to delete Feedback with ID " + id + ": " + e.getMessage());
            return false;
        }
    }
}

