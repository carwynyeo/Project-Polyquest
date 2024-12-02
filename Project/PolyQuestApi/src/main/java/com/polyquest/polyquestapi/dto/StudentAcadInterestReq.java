package com.polyquest.polyquestapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class StudentAcadInterestReq {
    private int studentId;
    private String interestName;
    // Explicit getter
    @Getter
    private boolean interested;

}
