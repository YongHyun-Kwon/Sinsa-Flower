package com.sinsaflower.payment.toss.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TossDepositCallbackWebhookDto {

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSSSS")
    private LocalDateTime createdAt;
    private String secret;
    private String status;
    private String transactionKey;
    private String orderId;
}
