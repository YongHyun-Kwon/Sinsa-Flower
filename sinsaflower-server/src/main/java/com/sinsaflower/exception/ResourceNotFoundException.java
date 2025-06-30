package com.sinsaflower.exception;

/**
 * 리소스를 찾을 수 없을 때 발생하는 예외
 * - 404 Not Found 상태 코드와 함께 사용
 * - 엔티티 조회 시 결과가 없을 때 발생
 */
public class ResourceNotFoundException extends RuntimeException {
    
    private final String resourceType;
    private final String resourceId;
    
    /**
     * 메시지만 포함한 리소스 예외
     */
    public ResourceNotFoundException(String message) {
        super(message);
        this.resourceType = null;
        this.resourceId = null;
    }
    
    /**
     * 리소스 타입과 ID를 포함한 예외
     */
    public ResourceNotFoundException(String resourceType, String resourceId) {
        super(String.format("%s를 찾을 수 없습니다. ID: %s", resourceType, resourceId));
        this.resourceType = resourceType;
        this.resourceId = resourceId;
    }
    
    /**
     * 리소스 타입과 ID, 원인을 포함한 예외
     */
    public ResourceNotFoundException(String resourceType, String resourceId, Throwable cause) {
        super(String.format("%s를 찾을 수 없습니다. ID: %s", resourceType, resourceId), cause);
        this.resourceType = resourceType;
        this.resourceId = resourceId;
    }
    
    /**
     * 메시지와 원인을 포함한 예외
     */
    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
        this.resourceType = null;
        this.resourceId = null;
    }
    
    public String getResourceType() {
        return resourceType;
    }
    
    public String getResourceId() {
        return resourceId;
    }
    
    /**
     * 사전 정의된 리소스 예외 생성 팩토리 메서드들
     */
    
    public static ResourceNotFoundException user(Long userId) {
        return new ResourceNotFoundException("사용자", userId.toString());
    }
    
    public static ResourceNotFoundException user(String userId) {
        return new ResourceNotFoundException("사용자", userId);
    }
    
    public static ResourceNotFoundException order(Long orderId) {
        return new ResourceNotFoundException("주문", orderId.toString());
    }
    
    public static ResourceNotFoundException business(Long businessId) {
        return new ResourceNotFoundException("사업체", businessId.toString());
    }
    
    public static ResourceNotFoundException member(Long memberId) {
        return new ResourceNotFoundException("회원", memberId.toString());
    }
} 