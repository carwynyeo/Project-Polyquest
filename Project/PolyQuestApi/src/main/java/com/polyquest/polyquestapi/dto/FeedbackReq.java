package com.polyquest.polyquestapi.dto;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FeedbackReq {
    private String message; // Feedback message
}
