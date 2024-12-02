package com.polyquest.polyquestapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.polyquest.polyquestapi.model.Response;
import com.polyquest.polyquestapi.model.Test;

import java.util.List;

@Repository
public interface ResponseRepository extends JpaRepository<Response, Integer> {
    // Find all responses related to a specific Test object
    List<Response> findByTest(Test test);
}
