package com.polyquest.polyquestapi.services;

import com.polyquest.polyquestapi.model.AcadInterest;
import com.polyquest.polyquestapi.repository.AcadInterestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service layer for handling operations related to academic interests.
 * Provides methods for retrieving, creating, and fetching academic interests by ID.
 */
@Service
public class AcadInterestService {

    private final AcadInterestRepository acadInterestRepository;

    /**
     * Constructor to initialize the AcadInterestRepository dependency.
     *
     * @param acadInterestRepository repository for performing CRUD operations on AcadInterest entities.
     */
    @Autowired
    public AcadInterestService(AcadInterestRepository acadInterestRepository) {
        this.acadInterestRepository = acadInterestRepository;
    }

    /**
     * Retrieves a list of all academic interests.
     *
     * @return a List of AcadInterest objects representing all academic interests in the database.
     */
    public List<AcadInterest> getAllAcadInterests() {
        return acadInterestRepository.findAll();
    }

    /**
     * Creates a new academic interest.
     *
     * @param acadInterest the AcadInterest object to be saved in the database.
     * @return the created AcadInterest object after being saved.
     */
    public AcadInterest createAcadInterest(AcadInterest acadInterest) {
        return acadInterestRepository.save(acadInterest);
    }

    /**
     * Retrieves an academic interest its ID.
     *
     * @param id the unique identifier of the academic interest to retrieve.
     * @return an Optional containing the AcadInterest if found, or empty if not found.
     */
    public Optional<AcadInterest> getAcadInterestById(int id) {
        return acadInterestRepository.findById(id);
    }
}
