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
    private LocalDateTime createdAt;

    public static FortuneResponse of(String fortuneTypeName, String fortuneResult) {
        return FortuneResponse.builder()
                .fortuneType(fortuneTypeName)
                .result(fortuneResult)
                .createdAt(LocalDateTime.now())
                .build();
    }
}