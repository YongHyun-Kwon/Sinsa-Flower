package com.sinsaflower.point.dto;

import com.sinsaflower.point.domain.PointChargeRequest;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ChargeRequestDto {
    private Long id;
    private String userEmail;
    private int requestedAmount;
    private String bankName;
    private String depositorName;
    private String status;
    private LocalDateTime requestedAt;

    public static ChargeRequestDto from(PointChargeRequest r) {
        ChargeRequestDto dto = new ChargeRequestDto();
        dto.id = r.getId();
        dto.requestedAmount = r.getRequestedAmount();
        dto.bankName = r.getBankName();
        dto.depositorName = r.getDepositorName();
        dto.status = r.getStatus().name();
        dto.requestedAt = r.getRequestedAt();
        return dto;
    }
}
