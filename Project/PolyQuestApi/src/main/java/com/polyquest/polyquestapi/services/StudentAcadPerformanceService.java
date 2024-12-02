package com.polyquest.polyquestapi.services;

import com.polyquest.polyquestapi.dto.StudentAcadPerformanceReq;
import com.polyquest.polyquestapi.model.*;
import com.polyquest.polyquestapi.repository.StudentAcadPerformanceRepository;
import com.polyquest.polyquestapi.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Service
public class StudentAcadPerformanceService {

    private final StudentAcadPerformanceRepository studentAcadPerformanceRepository;
    private final StudentRepository studentRepository;

    @Autowired
    public StudentAcadPerformanceService(StudentAcadPerformanceRepository studentAcadPerformanceRepository,
                                         StudentRepository studentRepository) {
        this.studentAcadPerformanceRepository = studentAcadPerformanceRepository;
        this.studentRepository = studentRepository;
    }

    public boolean createAcadPerformance(StudentAcadPerformanceReq studentAcadPerformanceReq) {
        Student student = studentRepository.findById(studentAcadPerformanceReq.getStudentId()).orElse(null);
        if (student != null) {
            StudentAcadPerformance performance = new StudentAcadPerformance();
            performance.setStudent(student);
            performance.setSubjectName(studentAcadPerformanceReq.getSubjectName());
            performance.setGrade(studentAcadPerformanceReq.getGrade());
            performance.setCreatedAt(new Timestamp(System.currentTimeMillis()));
            studentAcadPerformanceRepository.save(performance);
            return true;
        }
        return false;
    }


    // Fetch all interests by studentId
    public List<StudentAcadPerformance> getAllPerformanceByStudentId(int studentId) {
        Student student = studentRepository.findById(studentId).orElse(null);
        if (student != null) {
            return studentAcadPerformanceRepository.findByStudent(student);
        }
        return null;  // Return null if student is not found
    }

    public boolean updateAcadPerformanceByStudentIdAndPerformanceId(int studentId, int acadPerformanceId, StudentAcadPerformance updatedPerformance) {
        Student student = studentRepository.findById(studentId).orElse(null);
        if (student != null) {
            Optional<StudentAcadPerformance> existingPerformanceOpt = studentAcadPerformanceRepository.findByIdAndStudent(acadPerformanceId, student);
            if (existingPerformanceOpt.isPresent()) {
                StudentAcadPerformance existingPerformance = existingPerformanceOpt.get();
                existingPerformance.setGrade(updatedPerformance.getGrade());
                existingPerformance.setSubjectName(updatedPerformance.getSubjectName());
                existingPerformance.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
                studentAcadPerformanceRepository.save(existingPerformance);
                return true;
            }
        }
        return false;
    }



    public boolean deleteStudentAcadPerformance(int id) {
        try {
            studentAcadPerformanceRepository.deleteById(id); // Convert to Long
            return true;
        } catch (EmptyResultDataAccessException e) {
            System.err.println("Academic Result with ID " + id + " does not exist: " + e.getMessage());
            return false;
        } catch (Exception e) {
            System.err.println("An error occurred while trying to delete Academic Result with ID " + id + ": " + e.getMessage());
            return false;
        }
    }

    // New service method to retrieve subject names
    public String getSubjectNameByStudentAcadPerformanceId(int studentAcadPerformanceId) {
        Optional<StudentAcadPerformance> studentAcadPerformance = studentAcadPerformanceRepository.findById(studentAcadPerformanceId);
        return studentAcadPerformance.map(StudentAcadPerformance::getSubjectName).orElse(null);
    }
}