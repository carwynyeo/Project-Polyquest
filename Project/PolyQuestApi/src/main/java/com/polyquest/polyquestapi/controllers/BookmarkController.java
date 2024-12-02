package com.polyquest.polyquestapi.controllers;

import com.polyquest.polyquestapi.dto.BookmarkReq;
import com.polyquest.polyquestapi.model.Bookmark;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.polyquest.polyquestapi.services.BookmarkService;

import java.util.List;

@RestController
@RequestMapping("/bookmark")

public class BookmarkController {
    private final BookmarkService bookmarkService;

    @Autowired
    public BookmarkController(BookmarkService bookmarkService) {
        this.bookmarkService = bookmarkService;
    }

    @GetMapping("/{id}")
    public Bookmark getBookmarkById(@PathVariable Integer id) {
        return bookmarkService.getBookmarkById(id);
    }

    @PostMapping(consumes = "application/json", produces = "application/json")
    public Bookmark createBookmark(@RequestBody BookmarkReq bookmarkReq) {
        // Extract studentId and courseId from BookmarkReq DTO
        int studentId = bookmarkReq.getStudentId();
        int courseId = bookmarkReq.getCourseId();

        return bookmarkService.createBookmark(studentId, courseId);
    }

    @DeleteMapping("/{id}")
    public boolean deleteBookmark(@PathVariable Integer id) {
        // Use the path variable 'id' to delete the bookmark
        return bookmarkService.deleteBookmark(id);
    }

    @GetMapping("/student/{studentId}")
    public List<Bookmark> getBookmarksByStudentId(@PathVariable Integer studentId) {
        return bookmarkService.getBookmarksByStudentId(studentId);
    }

    @DeleteMapping("/student/{studentId}/course/{courseId}")
    public boolean deleteBookmarkByStudentIdAndCourseId(@PathVariable Integer studentId, @PathVariable Integer courseId) {
        return bookmarkService.deleteBookmarkByStudentIdAndCourseId(studentId, courseId);
    }

}
