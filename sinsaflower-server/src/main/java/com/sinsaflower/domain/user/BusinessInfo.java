package com.sinsaflower.domain.user;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "business_info")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BusinessInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // id

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // user_id

    @Column(length = 40)
    private String businessRegistrationNum; // business_registration_num

    @Column(length = 255)
    private String corporationName; // corporation_name

    @Column(length = 40)
    private String ceoName; // ceo_name

    @Column(length = 40)
    private String businessType; // business_type

    @Column(length = 255)
    private String businessAddress; // business_address

    @Column(length = 255)
    private String businessRegistrationCert; // business_registration_cert

    @Column(length = 40)
    private String faxNumber; // fax_number

    @Column(length = 255)
    private String faxSettings; // fax_settings

    @Column(length = 255)
    private String smsSettings; // sms_settings

    @Column(length = 255)
    private String businessHours; // business_hours

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt; // created_at

    @Column(nullable = false)
    private LocalDateTime updatedAt; // updated_at
} 