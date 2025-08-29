# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FortuneApp - 사주, 타로, 운세 서비스: 사용자의 생년월일과 생시 정보를 바탕으로 ChatGPT API를 통해 전문적인 사주 해석을 제공하는 웹 애플리케이션

## Technology Stack

### Backend
- Spring Boot 3.2+, Gradle, H2/MySQL, Spring Data JPA
- External API: OpenAI ChatGPT API
- Testing: JUnit 5, MockMvc
- Documentation: Swagger/OpenAPI 3

### Frontend
- React 18+ with TypeScript, Vite
- UI: Material-UI or Ant Design (카드 디자인, 모달 컴포넌트)
- State Management: Context API or Zustand

### Development Tools
- Docker, Docker Compose, concurrently, ESLint, Prettier

## Development Commands

```bash
# 전체 프로젝트 실행 (프론트엔드 + 백엔드 동시)
npm run dev

# 백엔드만 실행
cd server && ./gradlew bootRun

# 프론트엔드만 실행  
cd client && npm run dev

# Docker 환경 실행
docker-compose up -d

# 테스트
cd server && ./gradlew test
cd client && npm test
```

## Project Structure

```
fortune-app/
├── client/                    # React + TypeScript Frontend
│   ├── src/
│   │   ├── components/       # React Components
│   │   │   ├── cards/        # 운세 타입 카드 컴포넌트들
│   │   │   │   ├── FortuneCard.tsx      # 사주 카드
│   │   │   │   ├── TarotCard.tsx        # 타로 카드 (비활성)
│   │   │   │   └── DailyFortuneCard.tsx # 오늘의 운세 카드 (비활성)
│   │   │   ├── modals/       # 모달 컴포넌트들
│   │   │   │   └── BirthInfoModal.tsx   # 생년월일/생시 입력 모달
│   │   │   ├── results/      # 결과 표시 컴포넌트들
│   │   │   │   └── FortuneResult.tsx    # 사주 결과 표시
│   │   │   └── common/       # 공통 컴포넌트들
│   │   │       ├── Button.tsx
│   │   │       ├── Input.tsx
│   │   │       └── Modal.tsx
│   │   ├── pages/           # 페이지 컴포넌트들
│   │   │   ├── Home.tsx     # 메인 페이지 (카드 선택)
│   │   │   └── Fortune.tsx  # 사주 페이지
│   │   ├── services/        # API 서비스
│   │   │   └── fortuneService.ts # 사주 API 호출
│   │   ├── types/           # TypeScript 타입 정의
│   │   │   └── fortune.ts   # 사주 관련 타입들
│   │   ├── utils/           # 유틸리티 함수들
│   │   │   └── dateUtils.ts # 날짜 관련 유틸리티
│   │   ├── styles/          # 스타일 파일들
│   │   │   └── globals.css
│   │   └── App.tsx          # 메인 App 컴포넌트
│   └── package.json
├── server/                   # Spring Boot Backend
│   ├── src/main/java/com/fortune/app/
│   │   ├── controller/      # REST API Controllers
│   │   │   └── FortuneController.java    # 사주 API 컨트롤러
│   │   ├── service/         # Business Logic Services
│   │   │   ├── FortuneService.java       # 사주 서비스
│   │   │   └── OpenAIService.java        # ChatGPT API 서비스
│   │   ├── dto/            # Data Transfer Objects
│   │   │   ├── BirthInfoRequest.java     # 생년월일/생시 요청 DTO
│   │   │   └── FortuneResponse.java      # 사주 응답 DTO
│   │   ├── config/          # Spring Configuration
│   │   │   ├── OpenAIConfig.java         # OpenAI API 설정
│   │   │   └── CorsConfig.java           # CORS 설정
│   │   └── exception/       # Exception Handling
│   │       └── GlobalExceptionHandler.java
│   ├── src/main/resources/  # Application Properties
│   │   ├── application.yml              # 앱 설정
│   │   └── prompts/                     # ChatGPT 프롬프트 템플릿
│   │       └── saju-prompt.txt          # 사주 전문 프롬프트
│   └── build.gradle
├── docs/                    # Documentation
├── docker-compose.yml
└── package.json            # Root package.json (dev scripts)
```

## Core Features

1. **Fortune Type Selection**: 메인 페이지에서 사주, 타로, 오늘의 운세 카드 선택 (1단계에서는 사주만 활성화)
2. **Birth Information Input**: 생년월일, 생시, 성별 입력을 위한 모달 인터페이스
3. **AI-Powered Fortune Reading**: ChatGPT API를 통한 전문적인 사주 해석
4. **Professional Fortune Analysis**: 사주 전문 프롬프트를 활용한 정확하고 상세한 해석
5. **Responsive Design**: 모바일 친화적인 카드 기반 UI 디자인

## API Endpoints

- **Fortune**: `/api/fortune/saju` (사주 해석 요청)
- **Health**: `/api/health` (서버 상태 확인)

## User Flow

1. 메인 페이지 진입 → 3개 카드 중 사주 카드만 활성화 상태
2. 사주 카드 클릭 → 생년월일/생시 입력 모달 표시
3. 정보 입력 완료 → ChatGPT API 호출하여 사주 해석
4. 전문적인 사주 결과 표시

## ChatGPT Integration

### 전문 사주 프롬프트 구성

사주 해석의 전문성을 위해 다음 요소들을 포함한 프롬프트를 사용:

1. **전문가 역할 설정**: "당신은 30년 경력의 전문 사주명리학자입니다"
2. **해석 체계**: 천간지지, 오행, 십신 등 전통 사주 이론 기반
3. **상세 분석**: 성격, 건강, 직업운, 재물운, 인간관계, 연애운 등 포함
4. **실용적 조언**: 구체적이고 실행 가능한 개선 방안 제시

### API 호출 플로우

```
사용자 입력 (생년월일, 생시, 성별)
    ↓
Spring Boot Backend
    ↓
ChatGPT API 호출 (전문 프롬프트 + 사용자 정보)
    ↓
AI 사주 해석 결과 수신
    ↓
프론트엔드로 결과 전송
    ↓
사용자에게 사주 결과 표시
```

## Development Guidelines

### Backend
- OpenAI API 키 보안 관리 (환경변수 사용)
- ChatGPT API 호출 에러 처리 및 재시도 로직
- 사용자 입력 검증 (생년월일 형식, 생시 범위 등)
- API 응답 시간 최적화 (비동기 처리)
- CORS 설정으로 프론트엔드와 연동

### Frontend
- **Component 기반 설계**: 카드, 모달, 결과 표시 등 재사용 가능한 컴포넌트
- **TypeScript 타입 안정성**: 사주 관련 타입 정의 및 API 응답 타입 검증
- **반응형 디자인**: 모바일 우선 카드 레이아웃
- **사용자 경험**: 로딩 상태, 에러 처리, 직관적인 UI/UX
- **상태 관리**: Context API 또는 Zustand로 모달 상태, API 호출 상태 관리

# FortuneApp 개발 체크리스트

## Phase 1: 프로젝트 초기 설정

### 1. 프로젝트 구조 설정
- [x] 루트 디렉토리 구성 (client/, server/, docs/)
- [x] 루트 package.json 생성 (개발 스크립트용)
- [x] .gitignore 파일 설정
- [ ] README.md 수정 (Fortune App 내용으로)
- [x] docker-compose.yml 설정

### 2. 백엔드 프로젝트 설정 (Spring Boot)
- [x] Spring Initializr로 프로젝트 생성
- [ ] build.gradle 의존성 수정
  - [x] Spring Boot Web
  - [ ] OpenAI API 클라이언트 의존성
  - [ ] Validation 의존성
  - [ ] Swagger 의존성
  - [ ] H2 의존성 (개발용)
- [ ] 패키지 구조 수정 (com.fortune.app)
  - [ ] controller/ (FortuneController)
  - [ ] service/ (FortuneService, OpenAIService)
  - [ ] dto/ (BirthInfoRequest, FortuneResponse)
  - [ ] config/ (OpenAIConfig, CorsConfig)
  - [ ] exception/ (GlobalExceptionHandler)
- [ ] application.yml 설정 (OpenAI API 키 등)

### 3. 프론트엔드 프로젝트 설정 (React + TypeScript)
- [ ] Vite로 React TypeScript 프로젝트 생성
- [ ] 의존성 추가
  - [ ] React Router (페이지 라우팅용)
  - [ ] Material-UI 또는 Ant Design (카드, 모달 UI)
  - [ ] Axios (API 호출)
  - [ ] date-fns (날짜 처리)
- [ ] TypeScript 설정 (strict mode)
- [ ] ESLint, Prettier 설정
- [ ] 컴포넌트 폴더 구조 생성
  - [ ] components/cards/ (Fortune, Tarot, Daily 카드)
  - [ ] components/modals/ (BirthInfoModal)
  - [ ] components/results/ (FortuneResult)
  - [ ] components/common/ (Button, Input, Modal)
  - [ ] pages/ (Home, Fortune)
  - [ ] services/ (fortuneService)
  - [ ] types/ (fortune 타입들)
  - [ ] utils/ (dateUtils)

## Phase 2: 백엔드 개발

### 1. OpenAI API 연동 설정
- [ ] OpenAI API 클라이언트 라이브러리 설정
- [ ] OpenAIConfig 클래스 생성 (API 키 관리)
- [ ] application.yml에 OpenAI API 키 설정
- [ ] API 호출 테스트용 간단한 서비스 구현

### 2. DTO 클래스 생성
- [ ] BirthInfoRequest DTO (생년월일, 생시, 성별)
  - [ ] 입력 검증 어노테이션 추가 (@NotNull, @Valid 등)
- [ ] FortuneResponse DTO (사주 해석 결과)
- [ ] ErrorResponse DTO (에러 응답용)

### 3. 사주 전문 프롬프트 작성
- [ ] prompts/saju-prompt.txt 파일 생성
- [ ] 전문 사주명리학자 역할 설정
- [ ] 천간지지, 오행, 십신 기반 해석 체계 포함
- [ ] 성격, 건강, 운세, 조언 등 종합적 분석 템플릿

### 4. Service 레이어
- [ ] OpenAIService 구현
  - [ ] ChatGPT API 호출 메서드
  - [ ] 프롬프트 템플릿 로딩
  - [ ] API 에러 처리 및 재시도 로직
- [ ] FortuneService 구현
  - [ ] 생년월일 검증 로직
  - [ ] OpenAI API 결과 후처리
  - [ ] 사주 해석 결과 포매팅

### 5. Controller 레이어
- [ ] FortuneController 구현
  - [ ] POST /api/fortune/saju 엔드포인트
  - [ ] GET /api/health 헬스체크 엔드포인트
  - [ ] 요청/응답 검증
  - [ ] 에러 핸들링

### 6. 예외 처리 및 설정
- [ ] GlobalExceptionHandler 구현
  - [ ] OpenAI API 에러 처리
  - [ ] 입력 검증 에러 처리
  - [ ] 일반적인 서버 에러 처리
- [ ] CorsConfig 설정 (프론트엔드 연동용)
- [ ] Swagger 설정 (API 문서화)

## Phase 3: 프론트엔드 개발

### 1. 공통 컴포넌트 개발
- [ ] components/common/Button.tsx
  - [ ] 기본 스타일링, 로딩 상태 지원
- [ ] components/common/Modal.tsx
  - [ ] 모달 베이스 컴포넌트, 오버레이 처리
- [ ] components/common/Input.tsx
  - [ ] 날짜/시간 입력 지원, 검증 스타일링

### 2. 카드 컴포넌트 개발
- [ ] components/cards/FortuneCard.tsx
  - [ ] 사주 카드 디자인 (활성 상태)
  - [ ] 클릭 이벤트 처리
- [ ] components/cards/TarotCard.tsx
  - [ ] 타로 카드 디자인 (비활성 상태)
  - [ ] "준비중" 표시
- [ ] components/cards/DailyFortuneCard.tsx
  - [ ] 오늘의 운세 카드 (비활성 상태)
  - [ ] "준비중" 표시

### 3. 모달 컴포넌트 개발
- [ ] components/modals/BirthInfoModal.tsx
  - [ ] 생년월일 입력 필드 (DatePicker)
  - [ ] 생시 입력 필드 (시/분 선택)
  - [ ] 성별 선택 라디오 버튼
  - [ ] 입력 검증 및 에러 처리
  - [ ] 제출 버튼과 로딩 상태

### 4. 결과 표시 컴포넌트
- [ ] components/results/FortuneResult.tsx
  - [ ] 사주 해석 결과 표시
  - [ ] 섹션별 정리 (성격, 운세, 조언 등)
  - [ ] 스크롤 가능한 긴 텍스트 처리
  - [ ] 공유 기능 (선택사항)

### 5. 페이지 구성
- [ ] pages/Home.tsx
  - [ ] 3개 카드 그리드 레이아웃
  - [ ] 카드 상태 관리 (활성/비활성)
  - [ ] 모달 상태 관리
- [ ] pages/Fortune.tsx
  - [ ] 사주 결과 페이지
  - [ ] 뒤로가기 버튼
  - [ ] 새로운 사주 보기 버튼

### 6. 서비스 및 타입
- [ ] services/fortuneService.ts
  - [ ] API 호출 함수들
  - [ ] 에러 처리 및 재시도 로직
- [ ] types/fortune.ts
  - [ ] BirthInfo, FortuneResult 등 타입 정의
- [ ] utils/dateUtils.ts
  - [ ] 날짜 검증, 포매팅 유틸리티

### 7. 라우팅 및 상태 관리
- [ ] App.tsx 라우터 설정
- [ ] Context 또는 Zustand로 전역 상태 관리
- [ ] 로딩, 에러 상태 관리

## Phase 4: 통합 및 테스트

### 1. 백엔드 테스트
- [ ] OpenAI API 연동 테스트
- [ ] 입력 검증 테스트 (잘못된 생년월일, 생시 등)
- [ ] 에러 처리 테스트 (API 실패, 타임아웃 등)
- [ ] Controller 레이어 통합 테스트

### 2. 프론트엔드 테스트
- [ ] 카드 컴포넌트 렌더링 테스트
- [ ] 모달 상태 관리 테스트
- [ ] 사용자 입력 검증 테스트
- [ ] API 호출 및 에러 처리 테스트

### 3. 전체 시스템 통합 테스트
- [ ] 사주 카드 클릭 → 모달 열기 → 정보 입력 → 결과 표시 플로우 테스트
- [ ] API 응답 시간 측정 (ChatGPT API 호출 시간)
- [ ] 다양한 생년월일/생시 조합으로 테스트

## Phase 5: 배포 및 최적화

### 1. 환경 설정
- [ ] 개발/운영 환경별 설정 분리
- [ ] OpenAI API 키 보안 관리
- [ ] CORS 설정으로 프론트엔드 연동

### 2. 성능 최적화
- [ ] ChatGPT API 호출 최적화 (타임아웃, 재시도)
- [ ] 프론트엔드 번들 사이즈 최적화
- [ ] 이미지 최적화 (카드 아이콘 등)

### 3. 사용자 경험 개선
- [ ] 로딩 상태 처리 (AI 응답 대기 중)
- [ ] 에러 메시지 사용자 친화적으로 개선
- [ ] 반응형 디자인 완성 (모바일 우선)
- [ ] 접근성 개선 (키보드 탐색, 스크린 리더)

## 성공 기준 체크리스트

### 기능적 요구사항
- [ ] 메인 페이지에서 사주 카드만 활성화 상태로 표시
- [ ] 사주 카드 클릭 시 생년월일/생시 입력 모달 정상 작동
- [ ] ChatGPT API 통해 전문적인 사주 해석 결과 표시
- [ ] 타로/오늘의 운세 카드는 "준비중" 상태로 비활성화
- [ ] 모든 사용자 입력 검증 및 에러 처리 완료

### 비기능적 요구사항
- [ ] 모바일 기기에서 카드 레이아웃 정상 작동 (반응형)
- [ ] ChatGPT API 응답 시간 30초 이내 (타임아웃 처리)
- [ ] 직관적인 UI/UX (모달, 카드 인터랙션)
- [ ] API 에러 상황 적절히 처리 및 사용자 안내
- [ ] OpenAI API 키 보안 관리

### 개발 품질
- [ ] TypeScript 타입 안정성 확보
- [ ] ESLint/Prettier 규칙 준수
- [ ] 컴포넌트 재사용성 고려
- [ ] Git 커밋 메시지 컨벤션 따르기
- [ ] README 문서 Fortune App 내용으로 업데이트

## 확장 기능 (Phase 2)
- [ ] 사용자 계정 시스템 (로그인/회원가입)
- [ ] 사주 기록 저장 및 조회 기능
- [ ] 타로 카드 해석 기능 추가
- [ ] 오늘의 운세 기능 추가
- [ ] 사주 결과 공유 기능 (SNS, 링크 공유)
- [ ] 프리미엄 기능 (더 상세한 해석, 궁합 등)