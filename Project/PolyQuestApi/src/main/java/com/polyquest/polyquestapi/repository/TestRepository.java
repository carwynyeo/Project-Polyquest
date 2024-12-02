package com.polyquest.polyquestapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.polyquest.polyquestapi.model.Student;
import com.polyquest.polyquestapi.model.Test;
import java.util.List;

@Repository
public interface TestRepository  extends JpaRepository<Test, Integer> {
    // Find all tests for a specific student
    List<Test> findByStudent(Student student);

    // Find the latest test for a student, ordered by creation date descending
    @Query("SELECT t FROM Test t WHERE t.student.id = :studentId AND t.createdAt = (SELECT MAX(t2.createdAt) FROM Test t2 WHERE t2.student.id = :studentId)")
    Test findLatestTestByStudent(@Param("studentId") int studentId);
}
