package com.fortune.app.controller;

import com.fortune.app.dto.AnalyzeFortuneRequest;
import com.fortune.app.dto.FortuneResponse;
import com.fortune.app.service.FortuneService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/fortune")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Fortune API", description = "사주, 타로, 운세 관련 API")
public class FortuneController {

    private final FortuneService fortuneService;
    
    @PostMapping("/analyze")
    public ResponseEntity<FortuneResponse> analyzeFortune(@Valid @RequestBody AnalyzeFortuneRequest request) {
        return ResponseEntity.ok(fortuneService.analyzeFortune(request));
    }
}