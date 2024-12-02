package com.polyquest.polyquestapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.polyquest.polyquestapi.model.Course;
import java.util.List;

@Repository
public interface CourseRepository  extends JpaRepository<Course, Integer> {
    // Fetch courses by their IDs
    List<Course> findByIdIn(List<Integer> ids);

    // Fetch courses by school name and/or course name
    List<Course> findBySchoolNameAndCourseName(String schoolName, String courseName);

    // Fetch courses by only school name
    List<Course> findBySchoolName(String schoolName);

    // Fetch courses by only course name
    List<Course> findByCourseName(String courseName);

}
