package com.polyquest.polyquestapi.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = "subjectname")})

public class AcadPerformance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "subjectname", unique = true, nullable = false)
    private String subjectName; // Each subject’s name

    private Timestamp createdAt;

    private Timestamp updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = new Timestamp(System.currentTimeMillis());
        if (studentAcadPerformance != null) {
            studentAcadPerformance.updateSubjectName();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Timestamp(System.currentTimeMillis());
        if (studentAcadPerformance != null) {
            studentAcadPerformance.updateSubjectName();
        }
    }

    @PreRemove
    protected void onRemove() {
        if (studentAcadPerformance != null) {
            studentAcadPerformance.updateSubjectName();
        }
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "studentacadperformance_id")
    private StudentAcadPerformance studentAcadPerformance;
}
