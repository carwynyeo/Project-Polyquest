package com.polyquest.polyquestapi.dto;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentReq {
    private String name;

    private String email;

    private String password;

    private Timestamp createdAt;

    private Timestamp updatedAt;

    private String oauth_fb;

    private String oauth_google;

    private Boolean isEmailPassword;

    private String authMethod;

    private int authAttempts;

    private Timestamp lastAuthAttemptAt;
}
