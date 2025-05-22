package com.sinsaflower.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;

@Aspect
@Component
public class SecurityLoggingAspect {
    private static final Logger logger = LoggerFactory.getLogger(SecurityLoggingAspect.class);

    @Around("execution(* com.sinsalflower.controller.UserController.login(..)) || " +
            "execution(* com.sinsalflower.controller.UserController.logout(..))")
    public Object logSecurityEvent(ProceedingJoinPoint joinPoint) throws Throwable {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        String methodName = joinPoint.getSignature().getName();
        String clientIp = getClientIp(request);
        String userId = request.getParameter("userId");

        logger.info("보안 이벤트 발생 - 시간: {}, 이벤트: {}, 사용자: {}, IP: {}",
                LocalDateTime.now(), methodName, userId, clientIp);

        try {
            Object result = joinPoint.proceed();
            logger.info("보안 이벤트 성공 - 시간: {}, 이벤트: {}, 사용자: {}, IP: {}",
                    LocalDateTime.now(), methodName, userId, clientIp);
            return result;
        } catch (Exception e) {
            logger.error("보안 이벤트 실패 - 시간: {}, 이벤트: {}, 사용자: {}, IP: {}, 오류: {}",
                    LocalDateTime.now(), methodName, userId, clientIp, e.getMessage());
            throw e;
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0];
        }
        return request.getRemoteAddr();
    }
} 