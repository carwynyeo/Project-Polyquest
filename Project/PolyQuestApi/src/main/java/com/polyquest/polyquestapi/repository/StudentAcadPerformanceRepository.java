package com.polyquest.polyquestapi.repository;

import com.polyquest.polyquestapi.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.polyquest.polyquestapi.model.StudentAcadPerformance;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentAcadPerformanceRepository extends JpaRepository<StudentAcadPerformance, Integer> {
    List<StudentAcadPerformance> findByStudent(Student student);
    Optional<StudentAcadPerformance> findByIdAndStudent(int acadPerformanceId, Student student);
}

