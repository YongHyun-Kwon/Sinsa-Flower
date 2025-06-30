package com.sinsaflower.payment.toss.domain;

import com.sinsaflower.domain.user.User;
import com.sinsaflower.payment.toss.dto.TossVirtualAccountResponse;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class VirtualAccount {
    @Id
    @GeneratedValue
    private Long id;

    private String userId;
    private String bankCode;
    private String accountNumber;
    private String customerName;
    private String customerEmail;
    private String customerPhone;

    private String tossTransactionKey;
    private String tossPaymentKey;

//    @Enumerated(EnumType.STRING)
//    private VirtualAccountStatus status;

    private LocalDateTime issuedAt;
    private LocalDateTime expiredAt;

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
    private String country;

    private String accountType;
    private String dueDate;
    private Boolean expired;
    private String settlementStatus;
    private String refundStatus;
    private String refundReceiveAccount;

    private String receiptUrl;
    private String checkoutUrl;

    public static VirtualAccount from(TossVirtualAccountResponse dto) {
        VirtualAccount entity = new VirtualAccount();

        entity.setMid(dto.getMid());
        entity.setLastTransactionKey(dto.getLastTransactionKey());
        entity.setPaymentKey(dto.getPaymentKey());
        entity.setOrderId(dto.getOrderId());
        entity.setOrderName(dto.getOrderName());
        entity.setTaxExemptionAmount(dto.getTaxExemptionAmount());
        entity.setStatus(dto.getStatus());
        entity.setRequestedAt(dto.getRequestedAt());
        entity.setApprovedAt(dto.getApprovedAt());
        entity.setUseEscrow(dto.getUseEscrow());
        entity.setCultureExpense(dto.getCultureExpense());
        entity.setSecret(dto.getSecret());
        entity.setType(dto.getType());
        entity.setIsPartialCancelable(dto.getIsPartialCancelable());
        entity.setCurrency(dto.getCurrency());
        entity.setTotalAmount(dto.getTotalAmount());
        entity.setBalanceAmount(dto.getBalanceAmount());
        entity.setSuppliedAmount(dto.getSuppliedAmount());
        entity.setVat(dto.getVat());
        entity.setTaxFreeAmount(dto.getTaxFreeAmount());
        entity.setMethod(dto.getMethod());
        entity.setVersion(dto.getVersion());
        entity.setCountry(dto.getCountry());

        if (dto.getVirtualAccount() != null) {
            TossVirtualAccountResponse.VirtualAccount va = dto.getVirtualAccount();
            entity.setAccountNumber(va.getAccountNumber());
            entity.setAccountType(va.getAccountType());
            entity.setBankCode(va.getBankCode());
            entity.setCustomerName(va.getCustomerName());
            entity.setDueDate(va.getDueDate());
            entity.setExpired(va.getExpired());
            entity.setSettlementStatus(va.getSettlementStatus());
            entity.setRefundStatus(va.getRefundStatus());
            entity.setRefundReceiveAccount(va.getRefundReceiveAccount());
        }

        if (dto.getReceipt() != null) {
            entity.setReceiptUrl(dto.getReceipt().getUrl());
        }

        if (dto.getCheckout() != null) {
            entity.setCheckoutUrl(dto.getCheckout().getUrl());
        }

        return entity;
    }
}
