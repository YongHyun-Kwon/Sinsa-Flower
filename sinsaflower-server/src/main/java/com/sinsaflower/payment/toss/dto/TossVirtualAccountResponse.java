package com.sinsaflower.payment.toss.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class TossVirtualAccountResponse {

    @JsonProperty("mId")
    private String mid;
    private String lastTransactionKey;
    private String paymentKey;
    private String orderId;
    private String orderName;
    private Integer taxExemptionAmount;
    private String status;
    private String requestedAt;
    private String approvedAt;
    private Boolean useEscrow;
    private Boolean cultureExpense;
    private VirtualAccount virtualAccount;
    private String secret;
    private String type;
    private Boolean isPartialCancelable;
    private String currency;
    private Integer totalAmount;
    private Integer balanceAmount;
    private Integer suppliedAmount;
    private Integer vat;
    private Integer taxFreeAmount;
    private String method;
    private String version;
    private Receipt receipt;
    private Checkout checkout;
    private String country;

    @Data
    public static class VirtualAccount {
        private String accountNumber;
        private String accountType;
        private String bankCode;
        private String customerName;
        private String dueDate;
        private Boolean expired;
        private String settlementStatus;
        private String refundStatus;
        private String refundReceiveAccount;
    }

    @Data
    public static class Receipt {
        private String url;
    }

    @Data
    public static class Checkout {
        private String url;
    }
}
