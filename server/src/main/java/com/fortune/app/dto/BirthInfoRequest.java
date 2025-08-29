package com.fortune.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.Getter;

@Data
public class BirthInfoRequest {
    
    @NotBlank(message = "생년월일은 필수입니다")
    @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "생년월일은 YYYY-MM-DD 형식이어야 합니다")
    private String birthDate;
    
    @NotBlank(message = "생시는 필수입니다")
    @Pattern(regexp = "\\d{2}:\\d{2}", message = "생시는 HH:mm 형식이어야 합니다")
    private String birthTime;
    
    @NotNull(message = "성별은 필수입니다")
    private Gender gender;

    @Getter
    public enum Gender {
        MALE("남성"),
        FEMALE("여성");
        
        private final String description;
        
        Gender(String description) {
            this.description = description;
        }
    }
}