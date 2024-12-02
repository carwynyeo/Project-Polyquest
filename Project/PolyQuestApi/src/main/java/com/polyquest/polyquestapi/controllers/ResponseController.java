package com.polyquest.polyquestapi.controllers;

import com.polyquest.polyquestapi.dto.ResponseReq;
import com.polyquest.polyquestapi.model.Response;
import com.polyquest.polyquestapi.services.ResponseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/response")
public class ResponseController {

    private final ResponseService responseService;

    @Autowired
    public ResponseController(ResponseService responseService) {
        this.responseService = responseService;
    }

    // Create a new response for a specific test and question
    @PostMapping(value = "/test/{testId}/question/{questionId}/response",
            consumes = {"application/json"}, produces = {"application/json"})
    public Response createResponse(@PathVariable ("testId") Integer testId,
                                   @PathVariable ("questionId") Integer questionId,
                                   @Valid @RequestBody ResponseReq responseReq) {
        return responseService.createResponse(responseReq,testId, questionId);
    }

    @GetMapping("/{id}")
    public Response getResponse(@PathVariable int id) {
        return responseService.getResponse(id);
    }

    // Update an existing response for a specific question
    @PutMapping("/{id}/question/{questionId}")
    public Response updateResponse(@PathVariable int id,
                                   @PathVariable int questionId,
                                   @Valid @RequestBody Response updatedResponse) {
        return responseService.updateResponse(id, questionId, updatedResponse);
    }

    @GetMapping
    public List<Response> getAllResponses() {
        return responseService.getAllResponses();
    }

    @GetMapping("/test/{testId}")
    public List<Response> getResponsesByTest(@PathVariable int testId) {
        return responseService.getResponsesByTest(testId);
    }

    @DeleteMapping("/{id}")
    public boolean deleteResponse(@PathVariable int id) {
        return responseService.deleteResponse(id);
    }
}
