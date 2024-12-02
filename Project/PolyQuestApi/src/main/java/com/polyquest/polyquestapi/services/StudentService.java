package com.polyquest.polyquestapi.services;

import com.polyquest.polyquestapi.model.Student;
import com.polyquest.polyquestapi.dto.StudentReq;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import com.polyquest.polyquestapi.repository.StudentRepository;

import java.sql.Timestamp;
import java.util.Optional;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    @Autowired
    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public Iterable<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(Integer id) {
        return studentRepository.findById(id).orElse(null);
    }

    public Student createStudent(StudentReq student) {
        Student newStudent = new Student();

        newStudent.setEmail(student.getEmail());
        newStudent.setName(student.getName());
        newStudent.setEmail(student.getEmail());
        newStudent.setPassword(student.getPassword());
        newStudent.setOauth_fb(student.getOauth_fb());
        newStudent.setOauth_google(student.getOauth_google());
        newStudent.setIsEmailPassword(student.getIsEmailPassword());
        newStudent.setAuthMethod(student.getAuthMethod());
        newStudent.setAuthAttempts(student.getAuthAttempts());
        newStudent.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        newStudent.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        return studentRepository.save(newStudent);
    }

    // Delete a student by its ID
    public boolean deleteStudent(Integer id) {
        try {
            studentRepository.deleteById(id);
            return true;
        } catch (EmptyResultDataAccessException e) {
            // This exception occurs when no entity exists for the given ID
            System.err.println("Student with ID " + id + " does not exist: " + e.getMessage());
            return false;
        } catch (Exception e) {
            // Handle other unforeseen exceptions
            System.err.println("An error occurred while trying to delete Student with ID " + id + ": " + e.getMessage());
            return false;
        }
    }

    public Student updateStudent(Integer id, Student student) {
        if (studentRepository.existsById(id)) {
            student.setId(id);
            return studentRepository.save(student);
        } else {
            return null;
        }
    }

    // New method to verify password
    public boolean verifyPassword(Integer id, String password) {
        Student student = getStudentById(id);
        if (student != null) {
            return student.getPassword().equals(password);
        }
        return false;
    }

    // New method to get authentication attempts
    public int getAuthAttempts(Integer id, String password) {
        Student student = getStudentById(id);
        if (student != null && student.getPassword().equals(password)) {
            return student.getAuthAttempts();
        }
        return -1; // Return -1 if the password is incorrect
    }

    public Optional<Student> getStudentByEmail(String email) {
        return studentRepository.findAll().stream()
                .filter(student -> student.getEmail().equals(email))
                .findFirst();
    }

}
