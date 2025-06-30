package com.sinsaflower.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * 비즈니스 로직 예외
 * - 업무 규칙 위반 시 발생
 * - HTTP 상태 코드와 함께 에러 정보 제공
 * - 사용자 친화적인 에러 메시지 지원
 */
@Getter
public class BusinessException extends RuntimeException {
    
    private final HttpStatus status;
    private final String errorCode;
    
    /**
     * 메시지만 포함한 비즈니스 예외 (기본 상태: BAD_REQUEST)
     */
    public BusinessException(String message) {
        super(message);
        this.status = HttpStatus.BAD_REQUEST;
        this.errorCode = "BUSINESS_ERROR";
    }
    
    /**
     * 메시지와 HTTP 상태를 포함한 비즈니스 예외
     */
    public BusinessException(String message, HttpStatus status) {
        super(message);
        this.status = status;
        this.errorCode = "BUSINESS_ERROR";
    }
    
    /**
     * 메시지, HTTP 상태, 에러 코드를 포함한 비즈니스 예외
     */
    public BusinessException(String message, HttpStatus status, String errorCode) {
        super(message);
        this.status = status;
        this.errorCode = errorCode;
    }
    
    /**
     * 원인 예외를 포함한 비즈니스 예외
     */
    public BusinessException(String message, HttpStatus status, Throwable cause) {
        super(message, cause);
        this.status = status;
        this.errorCode = "BUSINESS_ERROR";
    }
    
    /**
     * 모든 정보를 포함한 비즈니스 예외
     */
    public BusinessException(String message, HttpStatus status, String errorCode, Throwable cause) {
        super(message, cause);
        this.status = status;
        this.errorCode = errorCode;
    }
    
    /**
     * 사전 정의된 비즈니스 예외 생성 팩토리 메서드들
     */
    
    public static BusinessException badRequest(String message) {
        return new BusinessException(message, HttpStatus.BAD_REQUEST);
    }
    
    public static BusinessException notFound(String message) {
        return new BusinessException(message, HttpStatus.NOT_FOUND);
    }
    
    public static BusinessException conflict(String message) {
        return new BusinessException(message, HttpStatus.CONFLICT);
    }
    
    public static BusinessException forbidden(String message) {
        return new BusinessException(message, HttpStatus.FORBIDDEN);
    }
    
    public static BusinessException unauthorized(String message) {
        return new BusinessException(message, HttpStatus.UNAUTHORIZED);
    }
    
    public static BusinessException internalServerError(String message) {
        return new BusinessException(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    public static BusinessException unprocessableEntity(String message) {
        return new BusinessException(message, HttpStatus.UNPROCESSABLE_ENTITY);
    }
} 