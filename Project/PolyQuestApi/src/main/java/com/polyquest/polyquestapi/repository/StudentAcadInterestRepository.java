package com.polyquest.polyquestapi.repository;

import com.polyquest.polyquestapi.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.polyquest.polyquestapi.model.StudentAcadInterest;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentAcadInterestRepository  extends JpaRepository<StudentAcadInterest, Integer> {
    List<StudentAcadInterest> findByStudent(Student student);
    // Custom queries can be defined here if needed
    // Custom method to find by both acadInterestId and student
    Optional<StudentAcadInterest> findByIdAndStudent(int acadInterestId, Student student);
}
