package com.sinsaflower.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDto {
    private String userId;
    private String name;
    private String phoneNumber;
    private String role;
    private String token;
} 