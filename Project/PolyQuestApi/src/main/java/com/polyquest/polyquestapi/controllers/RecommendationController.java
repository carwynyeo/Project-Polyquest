package com.polyquest.polyquestapi.controllers;

import com.polyquest.polyquestapi.model.Course;
import com.polyquest.polyquestapi.model.Recommendation;
import com.polyquest.polyquestapi.services.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/recommendation")
public class RecommendationController {

    private final RecommendationService recommendationService;

    @Autowired
    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    // Get all recommendations
    @GetMapping
    public Iterable<Recommendation> getAllRecommendations() {
        return recommendationService.getAllRecommendations();
    }

    // Get a recommendation by test ID
    @GetMapping("/test/{testId}")
    public Recommendation getRecommendationByTestId(@PathVariable int testId) {
        return recommendationService.getRecommendationByTestId(testId);
    }

    // Get recommendations by student ID, including test ID
    @GetMapping("/student/{studentId}")
    public List<Recommendation> getRecommendationsByStudentId(@PathVariable int studentId) {
        return recommendationService.getRecommendationsByStudentId(studentId);
    }


    // Create a new recommendation
    @PostMapping
    public Recommendation createRecommendation(@RequestBody Recommendation recommendation) {
        return recommendationService.createRecommendation(recommendation);
    }

    // Update an existing recommendation by ID
    @PutMapping("/{id}")
    public Recommendation updateRecommendation(@PathVariable int id, @RequestBody Recommendation updatedRecommendation) {
        return recommendationService.updateRecommendation(id, updatedRecommendation);
    }

    // Delete a recommendation by ID
    @DeleteMapping("/{id}")
    public boolean deleteRecommendation(@PathVariable int id) {
        return recommendationService.deleteRecommendation(id);
    }

    // Endpoint to get recommended courses by recommendation ID
    @GetMapping("/{recommendationId}/courses")
    public List<Course> getRecommendedCoursesByRecommendationId(@PathVariable int recommendationId) {
        return recommendationService.getRecommendedCoursesByRecommendationId(recommendationId);
    }

}
