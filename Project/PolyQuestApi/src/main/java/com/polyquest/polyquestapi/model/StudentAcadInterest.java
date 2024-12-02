package com.polyquest.polyquestapi.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
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

public class StudentAcadInterest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    // Change student_id to a ManyToOne relationship with Student
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)  // Foreign key in the Test table
    @JsonBackReference
    private Student student;

    @OneToMany(mappedBy = "studentAcadInterest", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<AcadInterest> acadInterests;

    // Store the subject names as a comma-separated list
    @Column(name = "interestname")
    private String interestName;

    // Update interestName as a single string from the first item in acadInterests (assuming one item only)
    public void updateInterestName() {
        this.interestName = acadInterests.isEmpty() ? "" : acadInterests.get(0).getInterestName();
    }

    private boolean interested;

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

}
