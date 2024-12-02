package com.polyquest.polyquestapi.services;

import com.polyquest.polyquestapi.model.Bookmark;
import com.polyquest.polyquestapi.model.Student;
import com.polyquest.polyquestapi.model.Course;
import com.polyquest.polyquestapi.repository.BookmarkRepository;
import com.polyquest.polyquestapi.repository.CourseRepository;
import com.polyquest.polyquestapi.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;


@Service
public class BookmarkService {
    private final BookmarkRepository bookmarkRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    @Autowired
    public BookmarkService(BookmarkRepository bookmarkRepository,
                           StudentRepository studentRepository, CourseRepository courseRepository) {
        this.bookmarkRepository = bookmarkRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;

    }

    public Bookmark createBookmark(int studentId, int courseId) {
        // Check if Student and Course exist
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));

        // Create the Bookmark
        Bookmark bookmark = new Bookmark();
        bookmark.setStudent(student);
        bookmark.setCourse(course);
        bookmark.setCreatedAt(new Timestamp(System.currentTimeMillis()));

        return bookmarkRepository.save(bookmark);
    }

    public Bookmark getBookmarkById(int id) {
        return bookmarkRepository.findById(id).orElse(null);
    }

    public boolean deleteBookmark(Integer id) {
        try {
            bookmarkRepository.deleteById(id);
            return true;
        } catch (EmptyResultDataAccessException e) {
            // This exception occurs when no entity exists for the given ID
            System.err.println("Bookmark with ID " + id + " does not exist: " + e.getMessage());
            return false;
        } catch (Exception e) {
            // Handle other unforeseen exceptions
            System.err.println("An error occurred while trying to delete Bookmark with ID " + id + ": " + e.getMessage());
            return false;
        }
    }


    public List<Bookmark> getBookmarksByStudentId(Integer studentId) {
        if (studentId == null) {
            throw new IllegalArgumentException("Student ID cannot be null");
        }
        return bookmarkRepository.findAllByStudentId(studentId);
    }

    // New Method: Delete bookmark by student ID and course ID
    public boolean deleteBookmarkByStudentIdAndCourseId(Integer studentId, Integer courseId) {
        int deletedCount = bookmarkRepository.deleteByStudentIdAndCourseId(studentId, courseId);
        return deletedCount > 0;
    }


}
