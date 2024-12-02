package com.polyquest.polyquestapi.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

/**
 * The Student class represents a student entity in the system with attributes
 * like name, email, authentication details, and associated lists for tests,
 * recommendations, bookmarks, interests, performances, and feedbacks.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity

// Ignore specific properties during serialization to avoid LazyInitializationException issues with Hibernate
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "tests", "recommendations", "bookmarks", "interests", "performances", "feedbacks"})
public class Student {

    // Primary key, auto-generated for each student record
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    // Student's name
    private String name;

    // Student's email address
    private String email;

    // Encrypted password for authentication
    private String password;

    // Flag indicating whether the user logs in with email and password
    private Boolean isEmailPassword;

    // Timestamp marking the creation time of the student record
    private Timestamp createdAt;

    // Timestamp marking the last update time of the student record
    private Timestamp updatedAt;

    // The method of authentication used by the student (e.g., OAuth, email)
    private String authMethod;

    // OAuth token for Facebook authentication (if applicable)
    private String oauth_fb;

    // OAuth token for Google authentication (if applicable)
    private String oauth_google;

    // Counter for the number of failed authentication attempts
    private int authAttempts;

    // Timestamp marking the time of the last authentication attempt
    private Timestamp lastAuthAttemptAt;

    // One-to-Many relationship with the Test entity, indicating that a student can have multiple tests
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Test> tests = new ArrayList<>();

    // One-to-Many relationship with the Recommendation entity, indicating that a student can have multiple recommendations
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Recommendation> recommendations = new ArrayList<>();

    // One-to-Many relationship with the Bookmark entity, indicating that a student can have multiple bookmarks
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Bookmark> bookmarks = new ArrayList<>();

    // One-to-Many relationship with the StudentAcadInterest entity, indicating that a student can have multiple academic interests
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<StudentAcadInterest> interests = new ArrayList<>();

    // One-to-Many relationship with the StudentAcadPerformance entity, indicating that a student can have multiple academic performances
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<StudentAcadPerformance> performances = new ArrayList<>();

    // One-to-Many relationship with the Feedback entity, indicating that a student can have multiple feedbacks
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Feedback> feedbacks = new ArrayList<>();

    /**
     * Lifecycle callback to set the createdAt timestamp before the entity is persisted
     */
    @PrePersist
    protected void onCreate() {
        createdAt = new Timestamp(System.currentTimeMillis());
    }

    /**
     * Lifecycle callback to update the updatedAt timestamp before the entity is updated
     */
    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Timestamp(System.currentTimeMillis());
    }
}
