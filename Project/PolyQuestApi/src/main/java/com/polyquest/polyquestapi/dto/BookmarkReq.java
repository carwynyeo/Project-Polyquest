package com.polyquest.polyquestapi.dto;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class BookmarkReq {
    private int studentId;
    private int courseId;
}
