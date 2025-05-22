package com.sinsaflower.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {
    private String message;
    private String detail;
    private LocalDateTime timestamp;

    public ErrorResponse(String message, String detail) {
        this.message = message;
        this.detail = detail;
        this.timestamp = LocalDateTime.now();
    }
}