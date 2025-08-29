package com.fortune.app.exception;

/**
 * OpenAI API 호출 관련 예외
 */
public class OpenAIException extends RuntimeException {
    
    public OpenAIException(String message) {
        super(message);
    }
    
    public OpenAIException(String message, Throwable cause) {
        super(message, cause);
    }
}