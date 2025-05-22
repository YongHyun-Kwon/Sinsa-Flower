package com.sinsaflower.dto;

import com.sinsaflower.domain.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSummaryDto {
    private Long id;
    private String userId;
    private String name;
    private String phone;
    private String userType;
    private LocalDateTime registrationDate;
    private String status;

    public static UserSummaryDto fromEntity(User user) {
        return UserSummaryDto.builder()
                .id(user.getId())
                .userId(user.getUserId())
                .name(user.getName())
                .phone(user.getPhone())
                .userType(user.getUserType())
                .registrationDate(user.getRegistrationDate())
                .status(user.getStatus().name())
                .build();
    }
} 