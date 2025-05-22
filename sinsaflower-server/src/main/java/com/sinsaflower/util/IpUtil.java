package com.sinsaflower.util;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.util.StringUtils;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Arrays;
import java.util.List;

public class IpUtil {
    private static final List<String> PROXY_HEADERS = Arrays.asList(
            "X-Forwarded-For",
            "Proxy-Client-IP",
            "WL-Proxy-Client-IP",
            "HTTP_X_FORWARDED_FOR",
            "HTTP_X_FORWARDED",
            "HTTP_X_CLUSTER_CLIENT_IP",
            "HTTP_CLIENT_IP",
            "HTTP_FORWARDED_FOR",
            "HTTP_FORWARDED",
            "HTTP_VIA",
            "REMOTE_ADDR"
    );

    public static String getClientIp(HttpServletRequest request) {
        String ip = null;
        
        // 프록시 헤더를 순차적으로 확인
        for (String header : PROXY_HEADERS) {
            ip = request.getHeader(header);
            if (isValidIp(ip)) {
                break;
            }
        }

        // 헤더에서 IP를 찾지 못한 경우 remoteAddr 사용
        if (!isValidIp(ip)) {
            ip = request.getRemoteAddr();
        }

        // IPv4 형식이 아닌 경우 처리 (예: 0:0:0:0:0:0:0:1)
        if ("0:0:0:0:0:0:0:1".equals(ip)) {
            try {
                ip = InetAddress.getLocalHost().getHostAddress();
            } catch (UnknownHostException e) {
                ip = "127.0.0.1";
            }
        }

        // X-Forwarded-For 헤더에 여러 IP가 있는 경우 첫 번째 IP 사용
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }

        return ip;
    }

    private static boolean isValidIp(String ip) {
        if (!StringUtils.hasText(ip) || "unknown".equalsIgnoreCase(ip)) {
            return false;
        }

        // 간단한 IPv4 형식 검증
        String[] parts = ip.split("\\.");
        if (parts.length != 4) {
            return false;
        }

        try {
            for (String part : parts) {
                int value = Integer.parseInt(part);
                if (value < 0 || value > 255) {
                    return false;
                }
            }
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }
} 