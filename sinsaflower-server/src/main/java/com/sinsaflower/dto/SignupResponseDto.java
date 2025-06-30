package com.sinsaflower.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignupResponseDto {
    private String userId;
    private String name;
    private String status;
    private String message;
} 