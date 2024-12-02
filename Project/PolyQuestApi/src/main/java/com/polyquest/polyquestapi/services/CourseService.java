package com.polyquest.polyquestapi.services;

import com.polyquest.polyquestapi.model.Course;
import com.polyquest.polyquestapi.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
public class CourseService {

    private final CourseRepository courseRepository;

    @Autowired
    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public List <Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course getCourseById(int id) {
        return courseRepository.findById(id).orElse(null);
    }

    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }

    public boolean deleteCourse(Integer id) {
        try {
            courseRepository.deleteById(id);
            return true;
        } catch (EmptyResultDataAccessException e) {
            // This exception occurs when no entity exists for the given ID
            System.err.println("Course with ID " + id + " does not exist: " + e.getMessage());
            return false;
        } catch (Exception e) {
            // Handle other unforeseen exceptions
            System.err.println("An error occurred while trying to delete Course with ID " + id + ": " + e.getMessage());
            return false;
        }
    }

    public Course updateCourse(int id, Course course) {
        if (courseRepository.existsById(id)) {
            course.setId(id);
            return courseRepository.save(course);
        } else {
            return null;
        }
    }

    // New method to get courses by a list of IDs
    public List<Course> getCoursesByIds(List<Integer> courseIds) {
        return courseRepository.findByIdIn(courseIds);
    }

    // New method to get courses by dynamic parameters (schoolName, courseName, or both)
    public List<Course> getCoursesByParams(String schoolName, String courseName) {
        if (schoolName != null && courseName != null) {
            return courseRepository.findBySchoolNameAndCourseName(schoolName, courseName);
        } else if (schoolName != null) {
            return courseRepository.findBySchoolName(schoolName);
        } else if (courseName != null) {
            return courseRepository.findByCourseName(courseName);
        }
        return courseRepository.findAll();
    }

}
