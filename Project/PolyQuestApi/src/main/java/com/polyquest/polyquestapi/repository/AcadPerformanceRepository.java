package com.polyquest.polyquestapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.polyquest.polyquestapi.model.AcadPerformance;

@Repository
public interface AcadPerformanceRepository extends JpaRepository<AcadPerformance, Integer> {

}
