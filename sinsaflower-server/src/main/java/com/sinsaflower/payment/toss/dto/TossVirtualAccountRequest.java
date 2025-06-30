package com.sinsaflower.payment.toss.dto;

import lombok.Data;

@Data
public class TossVirtualAccountRequest {
    private Integer amount;
    private String bank;
    private String customerName;
    private String orderId;
    private String orderName;
    private String accountKey;
    private String customerEmail;
    private String customerMobilePhone;
}
