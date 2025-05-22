package com.sinsaflower.service;

import com.sinsaflower.domain.user.AccountInfo;
import com.sinsaflower.domain.user.User;
import com.sinsaflower.dto.SignupRequestDto;
import com.sinsaflower.repository.AccountInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AccountInfoService {
    private final AccountInfoRepository accountInfoRepository;

    /**
     * AccountInfo 저장
     */
    public void createAccountInfo(User user, SignupRequestDto dto) {
        AccountInfo accountInfo = AccountInfo.builder()
                .user(user)
                .accountNumber(dto.getAccountNumber())
                .virtualAccount(dto.getVirtualAccount())
                .bankAccountCopy(dto.getBankAccountCopy())
                .createdAt(java.time.LocalDateTime.now())
                .updatedAt(java.time.LocalDateTime.now())
                .build();
        accountInfoRepository.save(accountInfo);
    }
} 