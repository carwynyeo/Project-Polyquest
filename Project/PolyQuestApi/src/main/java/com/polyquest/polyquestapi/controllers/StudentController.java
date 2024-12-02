package com.polyquest.polyquestapi.controllers;

import com.polyquest.polyquestapi.dto.StudentReq;
import com.polyquest.polyquestapi.model.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.polyquest.polyquestapi.services.StudentService;

import java.util.Optional;

@RestController
@RequestMapping("/student")
public class StudentController {

    private final StudentService studentService;

    @Autowired
    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    public Iterable<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    @GetMapping("/{id}")
    public Student getStudentById(@PathVariable Integer id) {
        return studentService.getStudentById(id);
    }

    @PostMapping(consumes = "application/json", produces = "application/json")
    public Student createStudent(@RequestBody StudentReq student) {
        return studentService.createStudent(student);
    }
    @PutMapping("/{id}")
    public Student updateStudent(@PathVariable Integer id, @RequestBody Student student) {
        return studentService.updateStudent(id, student);
    }

    @DeleteMapping("/{id}")
    public boolean deleteStudent(@PathVariable Integer id) {
        return studentService.deleteStudent(id);
    }

    // New method to verify password
    @PostMapping("/{id}/verifyPassword")
    public boolean verifyPassword(@PathVariable Integer id, @RequestParam String password) {
        return studentService.verifyPassword(id, password);
    }

    // New method to get authentication attempts
    @GetMapping("/{id}/authAttempts")
    public int getAuthAttempts(@PathVariable Integer id, @RequestParam String password) {
        return studentService.getAuthAttempts(id, password);
    }

    @GetMapping("/email")
    public Optional<Student> getStudentByEmail(@RequestParam String email) {
        return studentService.getStudentByEmail(email);
    }
}
