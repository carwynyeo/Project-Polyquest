package com.polyquest.polyquestapi.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String courseName;

    private String schoolName;

    private String facultyName;

    private String courseDescription;

    private Integer Intake;

    @ElementCollection
    private List<String> careerProspect;

    @ElementCollection
    private List<String> keySkills;

    private Timestamp createdAt;

    private Timestamp updatedAt;

    // Many-to-Many relationship with Recommendation
    @ManyToMany(mappedBy = "courses", fetch = FetchType.LAZY)
    @JsonIgnore  // Avoids circular dependency by not serializing this field
    private List<Recommendation> recommendations;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference  // Serializes this side of the relationship
    private List<Bookmark> bookmarks;

    @PrePersist
    protected void onCreate() {
        createdAt = new Timestamp(System.currentTimeMillis());
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Timestamp(System.currentTimeMillis());
    }
}

