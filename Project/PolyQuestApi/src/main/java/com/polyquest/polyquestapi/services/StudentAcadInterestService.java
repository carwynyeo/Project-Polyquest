package com.polyquest.polyquestapi.services;

import com.polyquest.polyquestapi.dto.StudentAcadInterestReq;
import com.polyquest.polyquestapi.model.Student;
import com.polyquest.polyquestapi.model.StudentAcadInterest;
import com.polyquest.polyquestapi.repository.StudentAcadInterestRepository;
import com.polyquest.polyquestapi.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

@Service
public class StudentAcadInterestService {

    private final StudentAcadInterestRepository studentAcadInterestRepository;
    private final StudentRepository studentRepository;

    @Autowired
    public StudentAcadInterestService(StudentAcadInterestRepository studentAcadInterestRepository,
                                      StudentRepository studentRepository) {
        this.studentAcadInterestRepository = studentAcadInterestRepository;
        this.studentRepository = studentRepository;
    }

    // Fetch all interests by studentId
    public List<StudentAcadInterest> getAllInterestByStudentId(int studentId) {
        Student student = studentRepository.findById(studentId).orElse(null);
        if (student != null) {
            return studentAcadInterestRepository.findByStudent(student);
        }
        return null;  // Return null if student is not found
    }

    public boolean createAcadInterest(StudentAcadInterestReq studentAcadInterestReq) {
        Student student = studentRepository.findById(studentAcadInterestReq.getStudentId()).orElse(null);
        if (student != null) {
            StudentAcadInterest interest = new StudentAcadInterest();
            interest.setStudent(student);
            interest.setInterestName(studentAcadInterestReq.getInterestName());
            interest.setInterested(studentAcadInterestReq.isInterested());
            interest.setCreatedAt(new Timestamp(System.currentTimeMillis()));
            studentAcadInterestRepository.save(interest);
            return true;
        }
        return false;
    }

    public boolean updateInterestByStudentIdAndInterestId(int studentId, int acadInterestId, StudentAcadInterest updatedInterest) {
        Student student = studentRepository.findById(studentId).orElse(null);
        if (student != null) {
            Optional<StudentAcadInterest> existingInterestOpt = studentAcadInterestRepository.findByIdAndStudent(acadInterestId, student);
            if (existingInterestOpt.isPresent()) {
                StudentAcadInterest existingInterest = existingInterestOpt.get();
                existingInterest.setInterested(updatedInterest.isInterested());
                existingInterest.setInterestName(updatedInterest.getInterestName());
                existingInterest.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
                studentAcadInterestRepository.save(existingInterest);
                return true;
            }
        }
        return false;
    }



    // Delete an academic interest
    public boolean deleteInterest(Integer id) {
        try {
            studentAcadInterestRepository.deleteById(id);
            return true;
        } catch (EmptyResultDataAccessException e) {
            // Handle case where interest does not exist
            System.err.println("Student's Academic Interest with ID " + id + " does not exist: " + e.getMessage());
            return false;
        } catch (Exception e) {
            // Handle other unforeseen exceptions
            System.err.println("An error occurred while trying to delete Student's Academic Interest with ID " + id + ": " + e.getMessage());
            return false;
        }
    }

    public String getInterestNameByStudentAcadInterestId(int studentAcadInterestId) {
        Optional<StudentAcadInterest> studentAcadInterest = studentAcadInterestRepository.findById(studentAcadInterestId);
        return studentAcadInterest.map(StudentAcadInterest::getInterestName).orElse(null);
    }
}
