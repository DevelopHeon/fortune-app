package com.fortune.app.dto;

import com.fortune.app.enumerate.FortuneType;
import com.fortune.app.enumerate.Gender;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class AnalyzeFortuneRequest {
    
    @NotBlank(message = "생년월일은 필수입니다")
    @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "생년월일은 YYYY-MM-DD 형식이어야 합니다")
    private String birthDate;
    
    @NotBlank(message = "생시는 필수입니다")
    @Pattern(regexp = "\\d{2}:\\d{2}", message = "생시는 HH:mm 형식이어야 합니다")
    private String birthTime;
    
    @NotNull(message = "성별은 필수입니다")
    private Gender gender;
    
    @NotNull(message = "운세 타입은 필수입니다")
    private FortuneType fortuneType;
}