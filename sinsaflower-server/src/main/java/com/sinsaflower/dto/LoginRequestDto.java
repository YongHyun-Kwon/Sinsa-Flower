package com.sinsaflower.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LoginRequestDto {
    private String userId;
    private String password;
} 