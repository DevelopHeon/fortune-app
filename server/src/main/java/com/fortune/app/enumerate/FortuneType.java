package com.fortune.app.enumerate;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum FortuneType {
    SAJU("사주"),
    TAROT("타로"),
    DAILY("오늘의 운세");

    private final String value;
}