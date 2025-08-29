package com.fortune.app.service;

import com.fortune.app.dto.BirthInfoRequest;
import com.fortune.app.dto.FortuneResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Service
@RequiredArgsConstructor
@Slf4j
public class FortuneService {
    
    private final OpenAIService openAIService;
    
    /**
     * 사주 해석 서비스
     */
    public FortuneResponse getSajuFortune(BirthInfoRequest request) {
        log.info("사주 해석 요청 처리 시작 - 생년월일: {}", request.getBirthDate());
        
        // 입력 데이터 검증
        validateBirthInfo(request);
        
        // OpenAI API 호출하여 사주 해석
        String fortuneResult = openAIService.getSajuFortune(request);
        
        // 응답 DTO 구성
        FortuneResponse response = FortuneResponse.builder()
                .fortuneType("사주")
                .result(fortuneResult)
                .birthInfo(FortuneResponse.BirthInfoSummary.builder()
                        .birthDate(request.getBirthDate())
                        .birthTime(request.getBirthTime())
                        .gender(request.getGender().getDescription())
                        .build())
                .createdAt(LocalDateTime.now())
                .build();
        
        log.info("사주 해석 요청 처리 완료 - 결과 길이: {} 글자", fortuneResult.length());
        
        return response;
    }
    
    /**
     * 생년월일 및 생시 유효성 검증
     */
    private void validateBirthInfo(BirthInfoRequest request) {
        // 생년월일 형식 및 유효성 검증
        try {
            LocalDate birthDate = LocalDate.parse(request.getBirthDate(), DateTimeFormatter.ISO_LOCAL_DATE);
            LocalDate now = LocalDate.now();
            
            if (birthDate.isAfter(now)) {
                throw new IllegalArgumentException("생년월일이 미래 날짜일 수 없습니다.");
            }
            
            if (birthDate.getYear() < 1900) {
                throw new IllegalArgumentException("1900년 이후 출생자만 해석 가능합니다.");
            }
            
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("생년월일 형식이 올바르지 않습니다. YYYY-MM-DD 형식으로 입력해주세요.");
        }
    }
}