package com.sinsaflower.point.service;

import com.sinsaflower.domain.user.User;
import com.sinsaflower.point.domain.PointChargeRequest;
import com.sinsaflower.point.domain.PointLedger;
import com.sinsaflower.point.domain.SourceType;
import com.sinsaflower.point.dto.ChargeRequestDto;
import com.sinsaflower.point.repository.PointLedgerRepository;
import com.sinsaflower.point.repository.PointRequestChargeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class PointAdminService {
    private final PointRequestChargeRepository pointRequestChargeRepository;
    private final PointLedgerRepository pointLedgerRepository;

    @Transactional(readOnly = true)
    public List<ChargeRequestDto> getByStatus(String statusStr) {
        PointChargeRequest.RequestStatus status = PointChargeRequest.RequestStatus.valueOf(statusStr.toUpperCase());
        List<PointChargeRequest> requests = pointRequestChargeRepository.findByStatus(status);
        return requests.stream().map(ChargeRequestDto::from).collect(Collectors.toList());
    }

    @Transactional
    public void confirm(Long id) {
        PointChargeRequest request = pointRequestChargeRepository.findById(id).orElseThrow();
        request.confirm();

        PointLedger ledger = PointLedger.charge(request.getUser(), request.getRequestedAmount(), "충전 요청 승인");
        ledger.setSourceType(SourceType.CHARGE_REQUEST);
        pointLedgerRepository.save(ledger);
    }

    @Transactional
    public void reject(Long id) {
        pointRequestChargeRepository.findById(id).orElseThrow().reject();
    }
}
