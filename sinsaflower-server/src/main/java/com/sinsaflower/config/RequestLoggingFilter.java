package com.sinsaflower.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class RequestLoggingFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        String method = httpRequest.getMethod();
        String uri = httpRequest.getRequestURI();
        String queryString = httpRequest.getQueryString();
        
        System.out.println("=== 요청 로그 ===");
        System.out.println("Method: " + method);
        System.out.println("URI: " + uri);
        System.out.println("Query: " + (queryString != null ? queryString : "없음"));
        System.out.println("Content-Type: " + httpRequest.getContentType());
        System.out.println("Origin: " + httpRequest.getHeader("Origin"));
        
        // 요청 처리
        chain.doFilter(request, response);
        
        System.out.println("Response Status: " + httpResponse.getStatus());
        System.out.println("=================");
    }
} 