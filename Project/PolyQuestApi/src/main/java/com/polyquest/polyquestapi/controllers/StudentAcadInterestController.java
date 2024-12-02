package com.polyquest.polyquestapi.controllers;

import com.polyquest.polyquestapi.dto.StudentAcadInterestReq;
import com.polyquest.polyquestapi.model.StudentAcadInterest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.polyquest.polyquestapi.services.StudentAcadInterestService;

import java.util.List;

@RestController
@RequestMapping("/student-acad-interest")
public class StudentAcadInterestController {
    private final StudentAcadInterestService studentAcadInterestService;

    @Autowired
    public StudentAcadInterestController(StudentAcadInterestService studentAcadInterestService) {
        this.studentAcadInterestService = studentAcadInterestService;
    }

    // Fetch all academic interests by student ID
    @GetMapping("/student/{studentId}")
    public List<StudentAcadInterest> getAllInterestByStudentId(@PathVariable int studentId) {
        return studentAcadInterestService.getAllInterestByStudentId(studentId);
    }

    // Create a new academic interest for a student
    @PostMapping(value = "/student/{studentId}", consumes = "application/json")
    public boolean createInterest(@PathVariable int studentId, @RequestBody StudentAcadInterestReq studentAcadInterestReq) {
        studentAcadInterestReq.setStudentId(studentId);
        return studentAcadInterestService.createAcadInterest(studentAcadInterestReq);
    }

    // Update an existing academic interest for student ID and interest ID
    @PutMapping("/student/{studentId}/id/{acadInterestId}")
    public boolean updateInterestByStudentIdAndInterestId(@PathVariable int studentId,
                                                          @PathVariable int acadInterestId,
                                                          @RequestBody StudentAcadInterest updatedInterest) {
        return studentAcadInterestService.updateInterestByStudentIdAndInterestId(studentId, acadInterestId, updatedInterest);
    }


    // Delete an academic interest
    @DeleteMapping("/{id}")
    public boolean deleteInterest(@PathVariable int id) {
        return studentAcadInterestService.deleteInterest(id);
    }

    @GetMapping("/{studentAcadInterestId}/interest-names")
    public String getSubjectNamesByStudentAcadInterestId(@PathVariable int studentAcadInterestId) {
        return studentAcadInterestService.getInterestNameByStudentAcadInterestId(studentAcadInterestId);
    }
}
