package com.fortune.app.controller;

import com.fortune.app.dto.BirthInfoRequest;
import com.fortune.app.dto.FortuneResponse;
import com.fortune.app.service.FortuneService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/fortune")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Fortune API", description = "사주, 타로, 운세 관련 API")
public class FortuneController {
    
    private final FortuneService fortuneService;
    
    @PostMapping("/saju")
    @Operation(summary = "사주 해석", description = "생년월일, 생시, 성별 정보를 바탕으로 사주를 해석합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "사주 해석 성공",
                content = @Content(schema = @Schema(implementation = FortuneResponse.class))),
        @ApiResponse(responseCode = "400", description = "잘못된 요청 데이터"),
        @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<FortuneResponse> getSajuFortune(@Valid @RequestBody BirthInfoRequest request) {
        
        log.info("사주 해석 요청 - 생년월일: {}, 성별: {}", 
                request.getBirthDate(), request.getGender());
        
        FortuneResponse response = fortuneService.getSajuFortune(request);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/health")
    @Operation(summary = "서비스 상태 확인", description = "API 서버의 상태를 확인합니다.")
    @ApiResponse(responseCode = "200", description = "서비스 정상")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "OK",
                "service", "Fortune API",
                "message", "서비스가 정상적으로 작동 중입니다."
        ));
    }
    
    @GetMapping("/types")
    @Operation(summary = "지원하는 운세 타입", description = "현재 지원하는 운세 타입 목록을 조회합니다.")
    public ResponseEntity<Map<String, Object>> getFortuneTypes() {
        return ResponseEntity.ok(Map.of(
                "types", Map.of(
                        "saju", Map.of(
                                "name", "사주",
                                "description", "전통 사주명리학 기반 종합 운세 해석",
                                "enabled", true
                        ),
                        "tarot", Map.of(
                                "name", "타로",
                                "description", "타로카드를 통한 운세 해석",
                                "enabled", false,
                                "comingSoon", true
                        ),
                        "daily", Map.of(
                                "name", "오늘의 운세",
                                "description", "오늘 하루 운세 해석",
                                "enabled", false,
                                "comingSoon", true
                        )
                )
        ));
    }
}