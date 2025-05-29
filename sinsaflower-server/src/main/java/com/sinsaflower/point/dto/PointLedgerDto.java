package com.sinsaflower.point.dto;

import com.sinsaflower.point.domain.PointLedger;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PointLedgerDto {
    private int amount;
    private String type;
    private String memo;
    private String sourceType;
    private LocalDateTime createdAt;

    public static PointLedgerDto from(PointLedger l) {
        PointLedgerDto dto = new PointLedgerDto();
        dto.amount = l.getAmount();
        dto.type = l.getType().name();
        dto.memo = l.getMemo();
        dto.sourceType = l.getSourceType() != null ? l.getSourceType().name() : null;
        return dto;
    }
}
