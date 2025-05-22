package com.sinsaflower.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
public class JwtConfig {
    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access-token-validity-in-seconds}")
    private Long expiration;

    @Value("${jwt.header}")
    private String header;

    @Value("${jwt.prefix}")
    private String prefix;
} 