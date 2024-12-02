package com.polyquest.polyquestapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.polyquest.polyquestapi.model.Recommendation;
import com.polyquest.polyquestapi.model.Student;
import com.polyquest.polyquestapi.model.Test;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecommendationRepository  extends JpaRepository<Recommendation, Integer> {
    // Custom query to find recommendation by test ID
    Optional<Recommendation> findByTest(Test test);

    List<Recommendation> findByStudent(Student student); // Return list of recommendations by student
}
