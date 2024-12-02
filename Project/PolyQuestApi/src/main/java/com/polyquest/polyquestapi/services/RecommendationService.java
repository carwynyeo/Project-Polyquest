package com.polyquest.polyquestapi.services;

import com.polyquest.polyquestapi.model.Course;
import com.polyquest.polyquestapi.model.Recommendation;
import com.polyquest.polyquestapi.model.Student;
import com.polyquest.polyquestapi.model.Test;
/*
import com.polyquest.polyquestapi.model.Course;
import com.polyquest.polyquestapi.repository.CourseRepository;
 */
import com.polyquest.polyquestapi.repository.RecommendationRepository;
import com.polyquest.polyquestapi.repository.StudentRepository;
import com.polyquest.polyquestapi.repository.TestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class RecommendationService {

    private final RecommendationRepository recommendationRepository;
    private final StudentRepository studentRepository;
    private final TestRepository testRepository;

    @Autowired
    public RecommendationService(RecommendationRepository recommendationRepository,
                                 StudentRepository studentRepository,
                                 TestRepository testRepository) {
        this.recommendationRepository = recommendationRepository;
        this.studentRepository = studentRepository;
        this.testRepository = testRepository;

    }

    // Get all recommendations
    public Iterable<Recommendation> getAllRecommendations() {
        return recommendationRepository.findAll();
    }

    // Get recommendation by test ID
    public Recommendation getRecommendationByTestId(int testId) {
        Test test = testRepository.findById(testId).orElse(null);
        if (test != null) {
            return recommendationRepository.findByTest(test).orElse(null);
        }
        return null;
    }

    public List<Recommendation> getRecommendationsByStudentId(int studentId) {
        Student student = studentRepository.findById(studentId).orElse(null);
        if (student != null) {
            return recommendationRepository.findByStudent(student); // Returns List<Recommendation>
        }
        return Collections.emptyList(); // Return an empty list if student is not found
    }

    // Update a recommendation
    public Recommendation updateRecommendation(Integer recommendationId, Recommendation updatedRecommendation) {
        return recommendationRepository.findById(recommendationId)
                .map(recommendation -> {
                    recommendation.setRecommendationScore(updatedRecommendation.getRecommendationScore());
                    recommendation.setCourses(updatedRecommendation.getCourses()); // Update the list of courses
                    recommendation.setUpdatedAt(new Timestamp(System.currentTimeMillis())); // Manually update timestamp
                    return recommendationRepository.save(recommendation);
                })
                .orElse(null);  // Return null if the recommendation is not found
    }

    // Delete a recommendation by ID
    public boolean deleteRecommendation(Integer id) {
        try {
            recommendationRepository.deleteById(id);
            return true;
        } catch (EmptyResultDataAccessException e) {
            // This exception occurs when no entity exists for the given ID
            System.err.println("Recommendation with ID " + id + " does not exist: " + e.getMessage());
            return false;
        } catch (Exception e) {
            // Handle other unforeseen exceptions
            System.err.println("An error occurred while trying to delete Recommendation with ID " + id + ": " + e.getMessage());
            return false;
        }
    }

    // Create a recommendation
    public Recommendation createRecommendation(Recommendation recommendation) {
        return recommendationRepository.save(recommendation);
    }


    // Retrieve recommended courses by recommendation ID
    public List<Course> getRecommendedCoursesByRecommendationId(int recommendationId) {
        Optional<Recommendation> recommendationOpt = recommendationRepository.findById(recommendationId);
        if (recommendationOpt.isPresent()) {
            return recommendationOpt.get().getCourses();
        } else {
            throw new IllegalArgumentException("Recommendation not found for ID: " + recommendationId);
        }

    }
}

