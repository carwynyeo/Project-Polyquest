package com.polyquest.polyquestapi.services;

import com.polyquest.polyquestapi.model.AcadPerformance;
import com.polyquest.polyquestapi.repository.AcadPerformanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AcadPerformanceService {

    private final AcadPerformanceRepository acadPerformanceRepository;

    @Autowired
    public AcadPerformanceService(AcadPerformanceRepository acadPerformanceRepository) {
        this.acadPerformanceRepository = acadPerformanceRepository;
    }
    public List<AcadPerformance> getAllAcadPerformances() {
        return acadPerformanceRepository.findAll();
    }

    public AcadPerformance createAcadPerformance(AcadPerformance acadPerformance) {
        return acadPerformanceRepository.save(acadPerformance);
    }

    public Optional<AcadPerformance> getAcadPerformanceById(int id) {
        return acadPerformanceRepository.findById(id);
    }
}
