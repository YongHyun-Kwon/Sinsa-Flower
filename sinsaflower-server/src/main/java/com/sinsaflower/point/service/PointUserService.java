package com.sinsaflower.point.service;

import com.sinsaflower.domain.user.User;
import com.sinsaflower.point.domain.PointLedger;
import com.sinsaflower.point.dto.PointLedgerDto;
import com.sinsaflower.point.repository.PointLedgerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PointUserService {

    private final PointLedgerRepository pointLedgerRepository;

    public int getAvailablePoint(User user) {
        return pointLedgerRepository.getAvailablePoint(user);
    }

    public List<PointLedgerDto> getHistory(User user) {
        List<PointLedger> ledgers = pointLedgerRepository.findByUserOrderByCreatedAtDesc(user);
        return ledgers.stream().map(PointLedgerDto::from).collect(Collectors.toList());
    }
}
