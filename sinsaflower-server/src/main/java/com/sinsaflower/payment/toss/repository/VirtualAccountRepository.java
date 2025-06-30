package com.sinsaflower.payment.toss.repository;

import com.sinsaflower.payment.toss.domain.VirtualAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VirtualAccountRepository extends JpaRepository<VirtualAccount, Long> {
    VirtualAccount findBySecret(String secret);
}
