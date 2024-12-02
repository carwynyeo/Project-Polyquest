package com.polyquest.polyquestapi.controllers;

import com.polyquest.polyquestapi.model.AcadInterest;
import com.polyquest.polyquestapi.services.AcadInterestService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Controller for handling requests related to academic interests.
 * Provides endpoints to retrieve all academic interests, create a new academic interest,
 * and get details of a specific academic interest ID.
 */
@RestController
@RequestMapping("/acad-interest")
public class AcadInterestController {

    private final AcadInterestService acadInterestService;

    /**
     * Constructor to initialize AcadInterestService dependency.
     *
     * @param acadInterestService service layer for handling academic interest operations.
     */
    public AcadInterestController(AcadInterestService acadInterestService) {
        this.acadInterestService = acadInterestService;
    }

    /**
     * Endpoint to retrieve a list of all academic interests.
     *
     * @return List of AcadInterest objects representing all academic interests in the system.
     */
    @GetMapping("/get-all-acad-interests")
    public List<AcadInterest> getAllAcadInterests() {
        return acadInterestService.getAllAcadInterests();
    }

    /**
     * Endpoint to create a new academic interest.
     *
     * @param acadInterest the AcadInterest object to be created, received from the request body.
     * @return the created AcadInterest object after it has been saved in the database.
     */
    @PostMapping
    public AcadInterest createAcadInterest(@RequestBody AcadInterest acadInterest) {
        return acadInterestService.createAcadInterest(acadInterest);
    }

    /**
     * Endpoint to retrieve a specific academic interest its ID.
     *
     * @param id the ID of the academic interest to be retrieved.
     * @return an Optional containing the AcadInterest if found, or empty if not found.
     */
    @GetMapping("/{id}")
    public Optional<AcadInterest> getAcadInterestById(@PathVariable int id) {
        return acadInterestService.getAcadInterestById(id);
    }
}

