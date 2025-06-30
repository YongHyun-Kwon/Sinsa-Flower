package com.sinsaflower.config;

import com.sinsaflower.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final AuthenticationProvider authenticationProvider;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors() // WebConfig에 정의된 CORS 설정 사용
                .and()
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // localhost (127.0.0.1 또는 0:0:0:0:0:0:0:1) 로부터의 요청은 모두 허용
                        .requestMatchers(request -> {
                            String remoteAddr = request.getRemoteAddr();
                            // IPv4 (127.0.0.1) 및 IPv6 (0:0:0:0:0:0:0:1)
                            return "127.0.0.1".equals(remoteAddr) || "0:0:0:0:0:0:0:1".equals(remoteAddr);
                        }).permitAll()
                        .requestMatchers("/api/auth/**", "/auth/**").permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}