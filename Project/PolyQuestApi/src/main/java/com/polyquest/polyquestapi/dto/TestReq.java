package com.polyquest.polyquestapi.dto;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor


public class TestReq {

    private int id;
    private boolean isTestComplete;
    private Timestamp createdAt;
    private Timestamp updatedAt;

}



