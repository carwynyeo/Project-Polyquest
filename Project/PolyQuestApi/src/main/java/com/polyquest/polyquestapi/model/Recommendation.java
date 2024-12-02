package com.polyquest.polyquestapi.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;

import java.sql.Timestamp;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity

public class Recommendation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    // Add Many-to-One relationship with Test
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_id", nullable = false)  // This column will store the foreign key
    @JsonBackReference
    private Test test;

    public Integer getTestId() {
        return test != null ? test.getId() : null;
    }

    //For Machine Learning, the score will determine the relevancy of the recommendation to the student.
    private double recommendationScore;

    //Filer Threshold, so only relevant courses ( with high score is recommended)
    @Column(nullable = false, columnDefinition = "FLOAT DEFAULT 0.0") // This sets a default
    private double recommendationScoreThreshold;

    // Add Many-to-One relationship with Student
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)  // This column will store the foreign key
    @JsonBackReference
    private Student student;

    private Timestamp createdAt;

    private Timestamp updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = new Timestamp(System.currentTimeMillis());
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Timestamp(System.currentTimeMillis());
    }

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "recommended_course",  // Join table name
            joinColumns = @JoinColumn(name = "recommendation_id"),  // Foreign key for Recommendation
            inverseJoinColumns = @JoinColumn(name = "course_id") // Foreign key for Course
    )
    @JsonIgnoreProperties("recommendations")  // Ignore the recommendations list when serializing Course in Recommendation
    private List<Course> courses;

}
