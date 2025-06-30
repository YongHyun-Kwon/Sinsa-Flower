package com.sinsaflower.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.List;

@Configuration
public class RestTemplateConfig {

    @Bean
    public RestTemplate restTemplate() {
        RestTemplate restTemplate = new RestTemplate();

        // String 응답 → UTF-8 처리
        StringHttpMessageConverter stringConverter = new StringHttpMessageConverter(StandardCharsets.UTF_8);

        // JSON 응답 → UTF-8 + application/json
        MappingJackson2HttpMessageConverter jsonConverter = new MappingJackson2HttpMessageConverter();
        jsonConverter.setDefaultCharset(StandardCharsets.UTF_8);
        jsonConverter.setSupportedMediaTypes(List.of(MediaType.APPLICATION_JSON));

        // 기존 컨버터 교체 또는 추가
        restTemplate.setMessageConverters(List.of(jsonConverter, stringConverter));

        return restTemplate;
    }
}
