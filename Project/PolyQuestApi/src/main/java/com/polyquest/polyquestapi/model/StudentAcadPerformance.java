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
public class StudentAcadPerformance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @JsonBackReference
    private Student student;

    @OneToMany(mappedBy = "studentAcadPerformance", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<AcadPerformance> acadPerformances;

    // Store the subject names as a comma-separated list
    @Column(name = "subjectname")
    private String subjectName;

    // Update interestName as a single string from the first item in acadInterests (assuming one item only)
    public void updateSubjectName() {
            this.subjectName = acadPerformances.isEmpty() ? "" : acadPerformances.get(0).getSubjectName();
        }
    private String grade;

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
