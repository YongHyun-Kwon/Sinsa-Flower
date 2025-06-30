package com.sinsaflower.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Getter
@Configuration
public class TossConfig {
    @Value("${payments.toss.base-url}")
    private String apiBaseUrl;

    @Value("${payments.toss.client-key}")
    private String clientKey;

    @Value("${payments.toss.secret-key}")
    private String secretKey;

}
