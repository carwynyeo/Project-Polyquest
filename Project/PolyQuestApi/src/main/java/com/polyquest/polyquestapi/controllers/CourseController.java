package com.polyquest.polyquestapi.controllers;

import com.polyquest.polyquestapi.model.Course;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.polyquest.polyquestapi.services.CourseService;
import java.util.List;

@RestController
@RequestMapping("/course")
public class CourseController {
    private final CourseService courseService;

    @Autowired
    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }

    @GetMapping("/{id}")
    public Course getCourseById(@PathVariable Integer id) {
        return courseService.getCourseById(id);
    }

    @PostMapping
    public Course createCourse(@RequestBody Course course) {
        return courseService.createCourse(course);
    }

    @PutMapping("/{id}")
    public Course updateCourse(@PathVariable Integer id, @RequestBody Course course) {
        return courseService.updateCourse(id, course);
    }

    @DeleteMapping("/{id}")
    public boolean deleteCourse(@PathVariable Integer id) {
        return courseService.deleteCourse(id);
    }

    // New endpoint to get courses by list of IDs
    @GetMapping("/by-ids")
    public List<Course> getCoursesByIds(@RequestParam List<Integer> courseIds) {
        return courseService.getCoursesByIds(courseIds);
    }

    // New endpoint to get courses by schoolName and/or courseName
    @GetMapping("/search")
    public List<Course> getCoursesByParams(
            @RequestParam(required = false) String schoolName,
            @RequestParam(required = false) String courseName) {
        return courseService.getCoursesByParams(schoolName, courseName);
    }
}
