package com.sinsaflower.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 모든 경로에 대해 CORS 허용
                .allowedOriginPatterns("*") // allowCredentials(true)와 함께 사용하려면 allowedOriginPatterns 사용
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .exposedHeaders("Authorization")
                .allowCredentials(true)
                .maxAge(3600);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 정적 리소스는 /static/** 경로에서만 처리하도록 제한
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/");
        
        // /api/** 경로는 정적 리소스 핸들러에서 제외
        // 기본 정적 리소스 핸들러를 비활성화하지 않고 명시적으로 경로 분리
    }
}