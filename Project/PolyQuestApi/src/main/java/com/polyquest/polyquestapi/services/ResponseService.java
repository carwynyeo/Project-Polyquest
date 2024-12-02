package com.polyquest.polyquestapi.services;

import com.polyquest.polyquestapi.dto.ResponseReq;
import com.polyquest.polyquestapi.model.*;
import com.polyquest.polyquestapi.repository.QuestionRepository;
import com.polyquest.polyquestapi.repository.ResponseRepository;
import com.polyquest.polyquestapi.repository.TestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;

@Service
public class ResponseService {

    private final ResponseRepository responseRepository;
    private final TestRepository testRepository;
    private final QuestionRepository questionRepository;

    @Autowired
    public ResponseService(ResponseRepository responseRepository, TestRepository testRepository,
                           QuestionRepository questionRepository) {
        this.responseRepository = responseRepository;
        this.testRepository = testRepository;
        this.questionRepository = questionRepository;

    }

    // Get all responses
    public List<Response> getAllResponses() {
        return responseRepository.findAll();
    }

    // Get all responses by Test ID
    public List<Response> getResponsesByTest(int testId) {
        Test test = testRepository.findById(testId).orElse(null);
        if (test == null) {
            return null;  // Return null or handle the case when Test is not found
        }
        return responseRepository.findByTest(test);  // Query by Test object
    }

    // Get a single response by its ID
    public Response getResponse(int responseId) {
        return responseRepository.findById(responseId).orElse(null);
    }

    // Create a new response for a specific test and question
    public Response createResponse( ResponseReq response,int testId, int questionId) {
        Test test = testRepository.findById(testId)
                .orElseThrow(() -> new RuntimeException("Test not found"));
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        // Link the test and question to the response
        Response newResponse = new Response();
        newResponse.setTest(test);
        newResponse.setQuestion(question);
        newResponse.setResponse(response.getResponse());
        newResponse.setCreatedAt(new Timestamp(System.currentTimeMillis()));

        return responseRepository.save(newResponse);
    }

    // Update an existing response
    public Response updateResponse(int responseId, int questionId, Response updatedResponseData) {
        return responseRepository.findById(responseId)
                .map(existingResponse -> {
                    Test test = testRepository.findById(updatedResponseData.getTest().getId()).orElse(null);
                    Question question = questionRepository.findById(questionId).orElse(null);

                    if (test != null) existingResponse.setTest(test);
                    if (question != null) existingResponse.setQuestion(question);

                    existingResponse.setResponse(updatedResponseData.getResponse());
                    existingResponse.setUpdatedAt(new Timestamp(System.currentTimeMillis()));

                    return responseRepository.save(existingResponse);
                }).orElse(null); // Return null if the response is not found
    }

    // Delete a response by its ID
    public boolean deleteResponse(int responseId) {
        try {
            responseRepository.deleteById(responseId);
            return true;
        } catch (EmptyResultDataAccessException e) {
            System.err.println("Response with ID " + responseId + " does not exist: " + e.getMessage());
            return false;
        } catch (Exception e) {
            System.err.println("An error occurred while trying to delete Response with ID " + responseId + ": " + e.getMessage());
            return false;
        }
    }
}
