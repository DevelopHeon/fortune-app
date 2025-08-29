package com.fortune.app.dto;

import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FortuneResponse {
    
    private String fortuneType;
    private String result;
    private BirthInfoSummary birthInfo;
    private LocalDateTime createdAt;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BirthInfoSummary {
        private String birthDate;
        private String birthTime;
        private String gender;
    }
}