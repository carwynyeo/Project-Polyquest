package com.polyquest.polyquestapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentAcadPerformanceReq {
    private int studentId;
    private String subjectName;
    private String grade;
}
