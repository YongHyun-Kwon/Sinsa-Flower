package com.sinsaflower.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * 표준화된 에러 응답 객체
 * - 일관된 에러 응답 형식 제공
 * - 필드 검증 에러 포함 지원
 * - JSON 직렬화 최적화
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {
    
    /**
     * 에러 발생 시간
     */
    private LocalDateTime timestamp;
    
    /**
     * HTTP 상태 코드
     */
    private int status;
    
    /**
     * HTTP 상태 메시지
     */
    private String error;
    
    /**
     * 사용자에게 표시할 에러 메시지
     */
    private String message;
    
    /**
     * 요청 경로
     */
    private String path;
    
    /**
     * 필드 검증 에러 (유효성 검사 실패 시)
     */
    private Map<String, String> fieldErrors;
    
    /**
     * 추가 상세 정보 (디버그용, 개발 환경에서만 노출)
     */
    private String details;
    
    /**
     * 에러 추적 ID (로그 추적용)
     */
    private String traceId;

    /**
     * 간단한 에러 응답 생성자
     */
    public ErrorResponse(String message) {
        this.timestamp = LocalDateTime.now();
        this.message = message;
    }

    /**
     * 메시지와 상세 정보를 포함한 에러 응답 생성자
     */
    public ErrorResponse(String message, String details) {
        this.timestamp = LocalDateTime.now();
        this.message = message;
        this.details = details;
    }

    /**
     * HTTP 상태와 메시지를 포함한 에러 응답 생성자
     */
    public ErrorResponse(int status, String error, String message) {
        this.timestamp = LocalDateTime.now();
        this.status = status;
        this.error = error;
        this.message = message;
    }
}