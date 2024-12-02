package com.polyquest.polyquestapi.controllers;

import com.polyquest.polyquestapi.model.AcadPerformance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.polyquest.polyquestapi.services.AcadPerformanceService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/acad-performance")
public class AcadPerformanceController {

    private final AcadPerformanceService acadPerformanceService;

    @Autowired
    public AcadPerformanceController(AcadPerformanceService acadPerformanceService) {
        this.acadPerformanceService = acadPerformanceService;
    }

    @GetMapping("/get-all-acad-performances")
    public List<AcadPerformance> getAllAcadPerformances() {
        return acadPerformanceService.getAllAcadPerformances();
    }
    @PostMapping
    public AcadPerformance createAcadPerformance(@RequestBody AcadPerformance acadperformance) {
        return acadPerformanceService.createAcadPerformance(acadperformance);
    }
    // New endpoint to get an individual subject by ID
    @GetMapping("/{id}")
    public Optional<AcadPerformance> getAcadPerformanceById(@PathVariable int id) {
        return acadPerformanceService.getAcadPerformanceById(id);
    }
}
