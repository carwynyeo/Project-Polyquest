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
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = "interestname")})

public class AcadInterest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "interestname", unique = true, nullable = false)
    private String interestName; //Each Interest's Name

    private Timestamp createdAt;

    private Timestamp updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = new Timestamp(System.currentTimeMillis());
        if (studentAcadInterest != null) {
            studentAcadInterest.updateInterestName();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Timestamp(System.currentTimeMillis());
        if (studentAcadInterest != null) {
            studentAcadInterest.updateInterestName();
        }
    }

    @PreRemove
    protected void onRemove() {
        if (studentAcadInterest != null) {
            studentAcadInterest.updateInterestName();
        }
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "studentacadinterest_id")
    private StudentAcadInterest studentAcadInterest;
}
