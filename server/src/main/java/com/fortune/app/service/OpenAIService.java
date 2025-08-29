package com.fortune.app.service;

import com.fortune.app.dto.BirthInfoRequest;
import com.fortune.app.exception.OpenAIException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class OpenAIService {
    
    private final ChatModel chatModel;
    
    @Value("classpath:/prompts/saju-prompt.txt")
    private Resource sajuPromptResource;
    
    /**
     * 사주 해석 요청을 ChatGPT API로 전송
     */
    @Retryable(value = {OpenAIException.class}, maxAttempts = 3, backoff = @Backoff(delay = 1000))
    public String getSajuFortune(BirthInfoRequest birthInfo) {
        try {
            String promptTemplate = loadPromptTemplate();
            
            Map<String, Object> variables = Map.of(
                    "gender", birthInfo.getGender().getDescription(),
                    "birthDate", birthInfo.getBirthDate().toString(),
                    "birthTime", formatBirthTime(birthInfo.getBirthTime())
            );
            
            PromptTemplate template = new PromptTemplate(promptTemplate, variables);
            Prompt prompt = template.create();
            
            log.info("사주 해석 요청 - 생년월일: {}, 성별: {}", 
                     birthInfo.getBirthDate(), birthInfo.getGender());
            
            ChatResponse response = chatModel.call(prompt);
            
            if (response == null || response.getResult() == null || 
                response.getResult().getOutput() == null) {
                throw new OpenAIException("OpenAI API에서 유효하지 않은 응답을 받았습니다");
            }
            
            String result = response.getResult().getOutput().getContent();
            
            if (result == null || result.trim().isEmpty()) {
                throw new OpenAIException("OpenAI API에서 빈 응답을 받았습니다");
            }
            
            log.info("사주 해석 응답 수신 완료 - 길이: {} 글자", result.length());
            
            return result;
            
        } catch (OpenAIException e) {
            log.error("OpenAI API 호출 중 오류 발생", e);
            throw e;
        } catch (Exception e) {
            log.error("사주 해석 중 예상치 못한 오류 발생", e);
            throw new OpenAIException("사주 해석 서비스 오류: " + e.getMessage(), e);
        }
    }
    
    /**
     * 프롬프트 템플릿 파일 로드
     */
    private String loadPromptTemplate() throws IOException {
        try {
            return sajuPromptResource.getContentAsString(StandardCharsets.UTF_8);
        } catch (IOException e) {
            log.error("사주 프롬프트 템플릿 로드 실패", e);
            throw new OpenAIException("프롬프트 템플릿을 로드할 수 없습니다", e);
        }
    }
    
    /**
     * 생시 정보를 포맷팅
     */
    private String formatBirthTime(String birthTime) {
        if (birthTime == null || birthTime.trim().isEmpty()) {
            return "시간 미상";
        }
        
        // HH:mm 형식으로 변환
        try {
            if (birthTime.contains(":")) {
                String[] parts = birthTime.split(":");
                int hour = Integer.parseInt(parts[0].trim());
                int minute = parts.length > 1 ? Integer.parseInt(parts[1].trim()) : 0;
                
                return String.format("%02d시 %02d분", hour, minute);
            } else {
                // 숫자만 있는 경우 시간으로 간주
                int hour = Integer.parseInt(birthTime.trim());
                return String.format("%02d시 00분", hour);
            }
        } catch (NumberFormatException e) {
            log.warn("생시 포맷 변환 실패: {}", birthTime);
            return birthTime; // 원본 반환
        }
    }
}