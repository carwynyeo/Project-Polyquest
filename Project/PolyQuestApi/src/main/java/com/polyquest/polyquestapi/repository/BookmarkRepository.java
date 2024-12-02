package com.polyquest.polyquestapi.repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.polyquest.polyquestapi.model.Bookmark;

import java.util.List;

@Repository
public interface BookmarkRepository  extends JpaRepository<Bookmark, Integer> {
    // Custom queries can be defined here if needed
    // To Find bookmarks by student ID
    List<Bookmark> findAllByStudentId(Integer studentId);

    @Transactional
    @Modifying
    @Query("DELETE FROM Bookmark b WHERE b.student.id = :studentId AND b.course.id = :courseId")
    int deleteByStudentIdAndCourseId(Integer studentId, Integer courseId);

}
