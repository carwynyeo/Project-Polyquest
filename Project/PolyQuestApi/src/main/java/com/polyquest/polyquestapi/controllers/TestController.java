package com.polyquest.polyquestapi.controllers;

import com.polyquest.polyquestapi.dto.TestReq;
import com.polyquest.polyquestapi.model.Recommendation;
import com.polyquest.polyquestapi.model.Response;
import com.polyquest.polyquestapi.model.Test;
import com.polyquest.polyquestapi.services.TestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/test")
public class TestController {

    private final TestService testService;

    @Autowired
    public TestController(TestService testService) {
        this.testService = testService;
    }

    // Get all tests by student ID
    @GetMapping("/student/{studentId}")
    public Iterable<Test> getAllTestsByStudent(@PathVariable int studentId) {
        return testService.getAllTestsByStudent(studentId);
    }

    // Get the latest test for a student as TestDTO
    @GetMapping("/student/{studentId}/latest")
    public TestReq getLatestTest(@PathVariable int studentId) {
        return testService.getLatestTest(studentId);
    }

    // Create a new test for a student
    @PostMapping("/student/{studentId}")
    public Test createTest(@PathVariable int studentId) {
        return testService.createTest(studentId);
    }

    // Update a test by test ID
    @PutMapping("/{testId}")
    public Test updateTest(@PathVariable int testId, @RequestBody Test updatedTest) {
        return testService.updateTest(testId, updatedTest);
    }

    // Delete a test by test ID
    @DeleteMapping("/{testId}")
    public boolean deleteTest(@PathVariable int testId) {
        return testService.deleteTest(testId);
    }

    // Save responses for a test
    @PostMapping("/{testId}/responses")
    public boolean saveResponses(@PathVariable int testId, @RequestBody List<Response> responses) {
        return testService.saveResponses(testId,responses);
    }

    // Set a test as complete
    @PutMapping("/{testId}/complete")
    public boolean completeTest(@PathVariable int testId) {
        return testService.setTestComplete(testId);  // Call the service method
    }

    // Check if a test is complete
    @GetMapping("/{testId}/isComplete")
    public boolean isTestComplete(@PathVariable int testId) {
        return testService.isTestComplete(testId);
    }

    // Generate a recommendation based on a test
    @GetMapping("/{testId}/recommendation")
    public Recommendation generateRecommendation(@PathVariable int testId) {
        return testService.generateRecommendation(testId);
    }

}
