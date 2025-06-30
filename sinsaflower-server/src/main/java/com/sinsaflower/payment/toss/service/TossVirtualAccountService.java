package com.sinsaflower.payment.toss.service;

import com.sinsaflower.config.TossConfig;
import com.sinsaflower.domain.user.User;
import com.sinsaflower.payment.toss.domain.VirtualAccount;
import com.sinsaflower.payment.toss.dto.TossDepositCallbackWebhookDto;
import com.sinsaflower.payment.toss.dto.TossVirtualAccountRequest;
import com.sinsaflower.payment.toss.dto.TossVirtualAccountResponse;
import com.sinsaflower.payment.toss.repository.VirtualAccountRepository;
import com.sinsaflower.point.domain.PointLedger;
import com.sinsaflower.point.domain.SourceType;
import com.sinsaflower.point.repository.PointLedgerRepository;
import com.sinsaflower.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class TossVirtualAccountService {
    public static final String DONE = "DONE";
    public static final String TOSS_VIRTUAL_ACCOUNT_DEPOSIT = "토스가상계좌입금";
    public static final String CANCELED = "CANCELED";
    private final TossConfig tossConfig;
    private final RestTemplate restTemplate;
    private final VirtualAccountRepository virtualAccountRepository;
    private final PointLedgerRepository pointLedgerRepository;
    private final UserRepository userRepository;

    public TossVirtualAccountResponse createVirtualAccount(TossVirtualAccountRequest req) throws Exception {
        log.info("createVirtualAccount :: req {}",req);
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", getAuthKey());
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<TossVirtualAccountRequest> entity = new HttpEntity<>(req, headers);
        ResponseEntity<TossVirtualAccountResponse> response = restTemplate.exchange(
                new URI(tossConfig.getApiBaseUrl() + "/v1/virtual-accounts"),
                HttpMethod.POST,
                entity,
                TossVirtualAccountResponse.class
        );
        log.info("createVirtualAccount :: responseBody {}",response.getBody());

        if (response.getStatusCode().is2xxSuccessful()) {
            VirtualAccount virtualAccount = VirtualAccount.from(Objects.requireNonNull(response.getBody()));
            virtualAccount.setUserId(req.getAccountKey());
            virtualAccountRepository.save(virtualAccount);
            return response.getBody();
        } else {
            throw new RuntimeException("Toss API 호출 실패: " + response.getBody());
        }
    }

    private String getAuthKey() {
        return "Basic " + Base64.getEncoder().encodeToString((tossConfig.getSecretKey() + ":").getBytes(StandardCharsets.UTF_8));
    }

    @Transactional(readOnly = true)
    public VirtualAccount searchVirtualAccountBySecret(String secret) {
        return virtualAccountRepository.findBySecret(secret);
    }

    public void processDeposit (TossDepositCallbackWebhookDto dto, VirtualAccount virtualAccount) {
        String status = Objects.requireNonNull(dto.getStatus());
        virtualAccount.setStatus(status);

        if (status.equals(DONE)) {
//            confirm(virtualAccount.getUserId(), virtualAccount.getTotalAmount());
        }
        if (status.equals(CANCELED)) {
//            refund(virtualAccount.getUserId(), virtualAccount.getTotalAmount());
        }

        virtualAccountRepository.save(virtualAccount);
    }

//    @Transactional
//    public void confirm(String userId, Integer amount) {
//        Optional<User> user = userRepository.findByUserId(userId);
//        PointLedger ledger = PointLedger.earn(user.orElseThrow(), amount, TOSS_VIRTUAL_ACCOUNT_DEPOSIT);
//        ledger.setSourceType(SourceType.VIRTUAL_ACCOUNT);
//        pointLedgerRepository.save(ledger);
//    }

//    @Transactional
//    public void refund(String userId, Integer amount) {
//        Optional<User> user = userRepository.findByUserId(userId);
//        PointLedger ledger = PointLedger.refund(user.orElseThrow(), amount, TOSS_VIRTUAL_ACCOUNT_DEPOSIT);
//        ledger.setSourceType(SourceType.VIRTUAL_ACCOUNT);
//        pointLedgerRepository.save(ledger);
//    }
}
