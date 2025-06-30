package com.sinsaflower.payment.toss.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sinsaflower.payment.common.entity.DepositHookLog;
import com.sinsaflower.payment.common.service.HookLogService;
import com.sinsaflower.payment.toss.domain.VirtualAccount;
import com.sinsaflower.payment.toss.dto.TossDepositCallbackWebhookDto;
import com.sinsaflower.payment.toss.dto.TossVirtualAccountRequest;
import com.sinsaflower.payment.toss.service.TossVirtualAccountService;
import com.sinsaflower.payment.toss.service.strategy.processor.DepositWebhookProcessor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/payments")
public class TossPaymentsController {
    private final ObjectMapper objectMapper;
    private final TossVirtualAccountService tossVirtualAccountService;
    private final HookLogService hookLogService;
    private final DepositWebhookProcessor webhookProcessor;

    @PostMapping("/virtual-account")
    public ResponseEntity<?> createVirtualAccount(@RequestBody TossVirtualAccountRequest req) throws Exception {
        return ResponseEntity.ok(tossVirtualAccountService.createVirtualAccount(req));
    }

    @PostMapping("/callback/deposit")
    public ResponseEntity<?> webhookDeposit(@RequestBody TossDepositCallbackWebhookDto dto) throws JsonProcessingException {
        try {
            VirtualAccount virtualAccount = tossVirtualAccountService.searchVirtualAccountBySecret(dto.getSecret());
            if (virtualAccount == null) {
                log.warn("In deposit callback method :: NOT VALID DTO :: {} ",dto);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            // 정상 처리
            webhookProcessor.handle(dto, virtualAccount);
            log.info("Valid webhook received: {}", dto.getOrderId());
            log.info("CALLBACK DTO :: {}",dto);
            logWebhook(dto, true, null);
            return ResponseEntity.ok("OK");
        } catch (Exception e)  {
            logWebhook(dto, false, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    private void logWebhook(TossDepositCallbackWebhookDto request, boolean success, String errorMessage) throws JsonProcessingException {
        DepositHookLog log = new DepositHookLog();
        log.setOrderId(request.getOrderId());
        log.setTransactionKey(request.getTransactionKey());
        log.setStatus(success ? "SUCCESS" : "FAILURE");
        log.setRequestBody(objectMapper.writeValueAsString(request));
        log.setErrorMessage(errorMessage);
        log.setEventType("deposit webhook");
        hookLogService.saveHookLog(log);
    }
}
