package com.polyquest.polyquestapi.controllers;

import com.polyquest.polyquestapi.dto.StudentAcadPerformanceReq;
import com.polyquest.polyquestapi.model.StudentAcadPerformance;
import com.polyquest.polyquestapi.services.StudentAcadPerformanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/student-acad-performance")
public class StudentAcadPerformanceController {

    private final StudentAcadPerformanceService studentAcadPerformanceService;

    @Autowired
    public StudentAcadPerformanceController(StudentAcadPerformanceService studentAcadPerformanceService) {
        this.studentAcadPerformanceService = studentAcadPerformanceService;
    }

    // Fetch all academic performance by student ID
    @GetMapping("/student/{studentId}")
    public List<StudentAcadPerformance> getAllPerformanceByStudentId(@PathVariable int studentId) {
        return studentAcadPerformanceService.getAllPerformanceByStudentId(studentId);
    }

    // Create a new academic performance for a student
    @PostMapping(value = "/student/{studentId}", consumes = "application/json")
    public boolean createPerformance(@PathVariable int studentId, @RequestBody StudentAcadPerformanceReq studentAcadPerformanceReq) {
        studentAcadPerformanceReq.setStudentId(studentId);
        return studentAcadPerformanceService.createAcadPerformance(studentAcadPerformanceReq);
    }
    // Update an existing academic performance by student ID and performance ID
    @PutMapping("/student/{studentId}/id/{acadPerformanceId}")
    public boolean updatePerformanceByStudentIdAndPerformanceId(@PathVariable int studentId,
                                                                @PathVariable int acadPerformanceId,
                                                                @RequestBody StudentAcadPerformance updatedAcadPerformance) {
        return studentAcadPerformanceService.updateAcadPerformanceByStudentIdAndPerformanceId(studentId, acadPerformanceId, updatedAcadPerformance);
    }


    // Delete an academic performance
    @DeleteMapping("/{id}")
    public boolean deletePerformance(@PathVariable int id) {
        return studentAcadPerformanceService.deleteStudentAcadPerformance(id);
    }

    @GetMapping("/{studentAcadPerformanceId}/subject-names")
    public String getSubjectNamesByStudentAcadPerformanceId(@PathVariable int studentAcadPerformanceId) {
        return studentAcadPerformanceService.getSubjectNameByStudentAcadPerformanceId(studentAcadPerformanceId);
    }
}