package com.fortune.app.service;

import com.fortune.app.dto.AnalyzeFortuneRequest;
import com.fortune.app.dto.FortuneResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Service
@RequiredArgsConstructor
@Slf4j
public class FortuneService {
    
    private final OpenAIService openAIService;
    
    /**
     * 통합 운세 해석 서비스
     */
    public FortuneResponse analyzeFortune(AnalyzeFortuneRequest request) {
        log.info("운세 해석 요청 처리 시작 - 타입: {}, 생년월일: {}", request.getFortuneType(), request.getBirthDate());
        
        // 입력 데이터 검증
        validateBirthInfo(request);

        String fortuneResult;
        switch (request.getFortuneType()) {
            case SAJU -> fortuneResult = openAIService.getSajuFortune(request);
            case DAILY -> fortuneResult = openAIService.getDailyFortune(request);
            case TAROT -> throw new UnsupportedOperationException("타로 서비스는 준비 중입니다.");
            default -> throw new IllegalArgumentException("지원하지 않는 운세 타입입니다: " + request.getFortuneType());
        }
        
        return FortuneResponse.of(request.getFortuneType().getValue(), fortuneResult);
    }
    
    /**
     * 생년월일 및 생시 유효성 검증
     */
    private void validateBirthInfo(AnalyzeFortuneRequest request) {
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