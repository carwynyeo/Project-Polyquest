package com.polyquest.polyquestapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.polyquest.polyquestapi.model.AcadInterest;



@Repository
public interface AcadInterestRepository extends JpaRepository<AcadInterest, Integer> {
    // Custom queries can be defined here if needed
}