# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FitnessTracker - 개인 운동 기록 관리 시스템: 개인의 운동 기록을 체계적으로 관리하고 진행률을 시각화하여 운동 목표 달성을 돕는 풀스택 웹 애플리케이션

## Technology Stack

### Backend
- Spring Boot 3.2+, Gradle, H2/MySQL, Spring Data JPA, Spring Security + JWT
- Testing: JUnit 5, MockMvc
- Documentation: Swagger/OpenAPI 3

### Frontend
- React 18+ with TypeScript, Vite, React Query + Zustand
- UI: Material-UI or Ant Design
- Charts: Chart.js with react-chartjs-2

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
fitness-tracker/
├── client/                    # React + TypeScript Frontend (FSD Architecture)
│   ├── src/
│   │   ├── app/              # App Layer - 앱 설정 및 초기화
│   │   │   ├── providers/    # React Context, React Query, Router providers
│   │   │   ├── store/        # Global state store (Zustand)
│   │   │   ├── styles/       # Global styles, theme
│   │   │   └── App.tsx       # App component
│   │   ├── pages/            # Pages Layer - 라우팅 페이지
│   │   │   ├── auth/         # 인증 페이지 (login, register)
│   │   │   ├── dashboard/    # 대시보드 페이지
│   │   │   ├── workouts/     # 운동 관련 페이지
│   │   │   ├── goals/        # 목표 관리 페이지
│   │   │   ├── statistics/   # 통계 페이지
│   │   │   └── profile/      # 프로필 페이지
│   │   ├── widgets/          # Widgets Layer - 독립적인 UI 블록
│   │   │   ├── workout-form/ # 운동 입력 폼 위젯
│   │   │   ├── goal-progress/# 목표 진행률 위젯
│   │   │   ├── charts/       # 차트 위젯들
│   │   │   └── navigation/   # 네비게이션 위젯
│   │   ├── features/         # Features Layer - 비즈니스 로직과 UI
│   │   │   ├── auth/         # 인증 기능 (login, register, logout)
│   │   │   ├── workout/      # 운동 관리 기능
│   │   │   ├── exercise/     # 운동 종목 관리 기능
│   │   │   ├── goal/         # 목표 관리 기능
│   │   │   ├── statistics/   # 통계 기능
│   │   │   └── profile/      # 프로필 관리 기능
│   │   ├── entities/         # Entities Layer - 비즈니스 엔티티
│   │   │   ├── user/         # User 엔티티 (model, api, types)
│   │   │   ├── workout/      # Workout 엔티티
│   │   │   ├── exercise/     # Exercise 엔티티
│   │   │   ├── goal/         # Goal 엔티티
│   │   │   └── statistics/   # Statistics 엔티티
│   │   └── shared/           # Shared Layer - 공통 코드
│   │       ├── api/          # API 설정 (axios instance, interceptors)
│   │       ├── config/       # 앱 설정 (constants, env)
│   │       ├── lib/          # 외부 라이브러리 설정 (react-query, chart.js)
│   │       ├── ui/           # 공통 UI 컴포넌트 (Button, Input, Modal 등)
│   │       └── utils/        # 공통 유틸리티 함수
│   └── package.json
├── server/                   # Spring Boot Backend
│   ├── src/main/java/com/fitness/tracker/
│   │   ├── controller/      # REST API Controllers
│   │   ├── service/         # Business Logic Services
│   │   ├── repository/      # Data Access Layer
│   │   ├── entity/          # JPA Entities
│   │   ├── dto/            # Data Transfer Objects (request/response)
│   │   ├── security/        # JWT Security Configuration
│   │   ├── exception/       # Exception Handling
│   │   └── config/          # Spring Configuration
│   ├── src/main/resources/  # Application Properties, SQL Scripts
│   └── build.gradle
├── docs/                    # Documentation
├── docker-compose.yml
└── package.json            # Root package.json (dev scripts)
```

## Core Features

1. **Authentication**: JWT 기반 회원가입/로그인/프로필 관리
2. **Exercise Management**: 운동 종목 관리, 운동 세션 생성, 운동 기록 입력/조회
3. **Goal Tracking**: 다양한 목표 유형 설정, 목표 진행률 추적 및 시각화
4. **Data Visualization**: 운동량/근력 진행/체성분 변화 차트
5. **Analytics**: 운동 패턴 분석, 성과 리포트, 비교 분석

## API Endpoints

- **Auth**: `/api/auth/*` (register, login, refresh, logout)
- **Users**: `/api/users/*` (profile management)
- **Exercises**: `/api/exercises/*` (exercise CRUD)
- **Workouts**: `/api/workouts/*` (workout sessions and records)
- **Goals**: `/api/goals/*` (goal setting and tracking)  
- **Statistics**: `/api/statistics/*` (analytics and reports)
- **Body Composition**: `/api/body-composition/*` (body metrics)

## Test Users

- Email: test@example.com
- Password: password123

## Frontend Architecture: Feature-Sliced Design (FSD)

FSD는 프론트엔드 프로젝트를 계층과 슬라이스로 구조화하는 아키텍처 방법론입니다.

### FSD 계층 구조 (상위 → 하위)

1. **app/** - 앱 설정 및 초기화
   - 전역 providers, 라우터, 스토어 설정
   - 전역 스타일 및 테마

2. **pages/** - 라우팅 페이지 
   - 각 라우트에 대응하는 페이지 컴포넌트
   - URL과 1:1 매칭되는 구조

3. **widgets/** - 독립적인 UI 블록
   - 여러 features를 조합한 복합 UI 컴포넌트
   - 재사용 가능한 위젯들

4. **features/** - 비즈니스 기능
   - 사용자 행동과 연결된 기능 단위
   - UI + 로직이 함께 있는 완전한 기능

5. **entities/** - 비즈니스 엔티티
   - 도메인 모델과 관련된 코드
   - API 호출, 타입 정의, 비즈니스 로직

6. **shared/** - 공통 코드
   - 프로젝트 전반에서 사용하는 공통 요소
   - UI 컴포넌트, 유틸리티, 설정

### 계층별 Import 규칙

- **상위 계층은 하위 계층만 import 가능**
- **같은 계층 내에서는 import 금지**
- **shared는 모든 계층에서 import 가능**

### 슬라이스 내부 구조 (Segment)

각 슬라이스는 다음과 같은 세그먼트로 구성:

```
feature/auth/
├── ui/           # UI 컴포넌트
├── model/        # 상태 관리, 비즈니스 로직
├── api/          # API 호출 함수
├── lib/          # 해당 기능 전용 유틸리티
├── config/       # 설정 파일
└── index.ts      # Public API (외부 노출 인터페이스)
```

## Development Guidelines

### Backend
- Follow Spring Boot conventions for backend development
- Implement proper error handling and validation
- Follow security best practices (JWT, CORS, input validation)
- Write unit tests for services and controllers

### Frontend (FSD Architecture)
- **Import 규칙**: 상위 계층만 하위 계층을 import
- **Public API**: 각 슬라이스는 index.ts를 통해서만 외부 노출
- **Segment 분리**: UI, model, api, lib를 명확히 분리
- **TypeScript strict mode** 사용
- **Shared UI 컴포넌트** 일관성 있게 사용
- **Features는 독립적**으로 개발 (다른 feature 직접 참조 금지)

# FitnessTracker 개발 체크리스트

## Phase 1: 프로젝트 초기 설정

### 1. 프로젝트 구조 설정
- [x] 루트 디렉토리 구성 (client/, server/, docs/)
- [x] 루트 package.json 생성 (개발 스크립트용)
- [x] .gitignore 파일 설정
- [x] README.md 작성
- [x] docker-compose.yml 설정

### 2. 백엔드 프로젝트 설정 (Spring Boot)
- [x] Spring Initializr로 프로젝트 생성
- [x] build.gradle 의존성 추가
  - [x] Spring Boot Web
  - [x] Spring Data JPA
  - [x] Spring Security
  - [x] JWT 의존성
  - [x] H2/MySQL 의존성
  - [x] Validation 의존성
  - [x] Swagger 의존성
- [x] 패키지 구조 생성 (controller, service, repository, entity, dto, config, security, exception)
- [x] application.yml 설정 (dev, prod 프로필)

### 3. 프론트엔드 프로젝트 설정 (React + TypeScript + FSD)
- [ ] Vite로 React TypeScript 프로젝트 생성
- [ ] 의존성 추가
  - [ ] React Router
  - [ ] React Query
  - [ ] Zustand
  - [ ] Material-UI 또는 Ant Design
  - [ ] Chart.js + react-chartjs-2
  - [ ] Axios
  - [ ] date-fns
- [ ] TypeScript 설정 (strict mode)
- [ ] ESLint, Prettier 설정 + FSD import 규칙
- [ ] FSD 폴더 구조 생성
  - [ ] app/ (providers, store, styles)
  - [ ] pages/ (auth, dashboard, workouts, goals, statistics, profile)
  - [ ] widgets/ (workout-form, goal-progress, charts, navigation)
  - [ ] features/ (auth, workout, exercise, goal, statistics, profile)
  - [ ] entities/ (user, workout, exercise, goal, statistics)
  - [ ] shared/ (api, config, lib, ui, utils)

## Phase 2: 백엔드 개발

### 1. 데이터베이스 설계
- [ ] BaseEntity 생성 (공통 필드)
- [ ] User 엔티티 생성
- [ ] Exercise 엔티티 생성
- [ ] WorkoutSession 엔티티 생성
- [ ] WorkoutRecord 엔티티 생성
- [ ] Goal 엔티티 생성
- [ ] BodyComposition 엔티티 생성
- [ ] 엔티티 관계 설정 (JPA 연관관계)
- [ ] 데이터베이스 스키마 생성 및 검증

### 2. 보안 설정
- [ ] JWT 설정 클래스 생성
- [ ] JwtTokenProvider 구현
- [ ] JwtAuthenticationFilter 구현
- [ ] UserDetailsService 구현
- [ ] SecurityConfig 설정
- [ ] CORS 설정
- [ ] 비밀번호 암호화 설정

### 3. Repository 레이어
- [ ] UserRepository 생성
- [ ] ExerciseRepository 생성
- [ ] WorkoutSessionRepository 생성
- [ ] WorkoutRecordRepository 생성
- [ ] GoalRepository 생성
- [ ] BodyCompositionRepository 생성
- [ ] 커스텀 쿼리 메서드 작성

### 4. DTO 클래스
- [ ] Request DTO 생성 (AuthRequest, RegisterRequest, WorkoutSessionRequest 등)
- [ ] Response DTO 생성 (AuthResponse, UserResponse, WorkoutSessionResponse 등)
- [ ] DTO 검증 어노테이션 추가

### 5. Service 레이어
- [ ] UserService 구현
- [ ] AuthService 구현
- [ ] ExerciseService 구현
- [ ] WorkoutService 구현
- [ ] GoalService 구현
- [ ] StatisticsService 구현
- [ ] BodyCompositionService 구현

### 6. Controller 레이어
- [ ] AuthController 구현
- [ ] UserController 구현
- [ ] ExerciseController 구현
- [ ] WorkoutController 구현
- [ ] GoalController 구현
- [ ] StatisticsController 구현
- [ ] BodyCompositionController 구현

### 7. 예외 처리 및 설정
- [ ] GlobalExceptionHandler 구현
- [ ] 커스텀 예외 클래스 생성
- [ ] Swagger 설정
- [ ] 초기 데이터 설정 (data.sql)

## Phase 3: 프론트엔드 개발 (FSD Architecture)

### 1. Shared Layer 구성
- [ ] shared/api - Axios 인스턴스 설정 (interceptor 포함)
- [ ] shared/config - 앱 설정 (constants, env)
- [ ] shared/lib - 외부 라이브러리 설정 (react-query, chart.js)
- [ ] shared/ui - 공통 UI 컴포넌트 (Button, Input, Modal, Card 등)
- [ ] shared/utils - 공통 유틸리티 함수 (date, validation 등)

### 2. Entities Layer 구성  
- [ ] entities/user - User 엔티티 (model, api, types)
- [ ] entities/workout - Workout 엔티티 (model, api, types)
- [ ] entities/exercise - Exercise 엔티티 (model, api, types)
- [ ] entities/goal - Goal 엔티티 (model, api, types)
- [ ] entities/statistics - Statistics 엔티티 (model, api, types)

### 3. Features Layer 구성
- [ ] features/auth - 인증 기능 (login, register, logout)
  - [ ] ui/ - LoginForm, RegisterForm 컴포넌트
  - [ ] model/ - 인증 상태 관리 (Zustand)
  - [ ] api/ - 인증 API 함수들
- [ ] features/workout - 운동 관리 기능
  - [ ] ui/ - WorkoutForm, WorkoutList, WorkoutCard
  - [ ] model/ - 운동 상태 관리
- [ ] features/exercise - 운동 종목 관리 기능
  - [ ] ui/ - ExerciseSelector, ExerciseList
- [ ] features/goal - 목표 관리 기능
  - [ ] ui/ - GoalForm, GoalList, GoalProgress
- [ ] features/statistics - 통계 기능
  - [ ] ui/ - Chart 컴포넌트들
- [ ] features/profile - 프로필 관리 기능
  - [ ] ui/ - Profile, ProfileEdit

### 4. Widgets Layer 구성
- [ ] widgets/workout-form - 운동 입력 폼 위젯 (features/workout + features/exercise 조합)
- [ ] widgets/goal-progress - 목표 진행률 위젯 (features/goal + entities/statistics)
- [ ] widgets/charts - 차트 위젯들 (features/statistics 활용)
  - [ ] WorkoutVolumeChart
  - [ ] StrengthProgressChart  
  - [ ] BodyCompositionChart
- [ ] widgets/navigation - 네비게이션 위젯 (Header, Sidebar)

### 5. Pages Layer 구성
- [ ] pages/auth - 인증 페이지들 (features/auth 활용)
- [ ] pages/dashboard - 대시보드 페이지 (여러 widgets 조합)
- [ ] pages/workouts - 운동 관련 페이지들
- [ ] pages/goals - 목표 관리 페이지들
- [ ] pages/statistics - 통계 페이지
- [ ] pages/profile - 프로필 페이지

### 6. App Layer 구성
- [ ] app/providers - React Context, React Query, Router providers
- [ ] app/store - 전역 상태 스토어 설정
- [ ] app/styles - 전역 스타일, 테마 설정
- [ ] App.tsx - 메인 App 컴포넌트

## Phase 4: 통합 및 테스트

### 1. 백엔드 테스트
- [ ] 단위 테스트 (Service 레이어)
- [ ] 통합 테스트 (Controller 레이어)
- [ ] Repository 테스트
- [ ] 보안 테스트

### 2. 프론트엔드 테스트
- [ ] 컴포넌트 단위 테스트
- [ ] API 통합 테스트
- [ ] E2E 테스트 기본 시나리오

### 3. API 통합 테스트
- [ ] 인증 API 테스트
- [ ] 운동 관리 API 테스트
- [ ] 목표 관리 API 테스트
- [ ] 통계 API 테스트

## Phase 5: 배포 및 최적화

### 1. Docker 설정
- [ ] 백엔드 Dockerfile
- [ ] 프론트엔드 Dockerfile
- [ ] docker-compose 운영 버전
- [ ] 환경 변수 설정

### 2. 성능 최적화
- [ ] JPA N+1 문제 해결
- [ ] 데이터베이스 인덱스 최적화
- [ ] React 컴포넌트 최적화 (memo, useMemo, useCallback)
- [ ] API 응답 캐싱

### 3. 보안 강화
- [ ] HTTPS 설정
- [ ] 입력 검증 강화
- [ ] SQL Injection 방지 확인
- [ ] XSS 방지 확인

### 4. 사용자 경험 개선
- [ ] 로딩 상태 처리
- [ ] 에러 상태 처리
- [ ] 반응형 디자인 확인
- [ ] 접근성 개선

## Phase 6: 문서화 및 최종 검토

### 1. API 문서화
- [ ] Swagger UI 확인
- [ ] API 사용 가이드 작성
- [ ] Postman 컬렉션 생성

### 2. 개발 문서화
- [ ] 설치 및 실행 가이드
- [ ] 개발 환경 설정 가이드
- [ ] 코드 컨벤션 문서
- [ ] 트러블슈팅 가이드

### 3. 최종 검토
- [ ] 모든 기능 요구사항 구현 확인
- [ ] 코드 품질 검토 (ESLint, SonarQube)
- [ ] 보안 취약점 점검
- [ ] 성능 테스트 수행

## 성공 기준 체크리스트

### 기능적 요구사항
- [ ] 사용자 회원가입/로그인이 정상 동작한다
- [ ] 운동 기록을 입력하고 조회할 수 있다
- [ ] 목표를 설정하고 진행률을 확인할 수 있다
- [ ] 운동 데이터가 차트로 시각화된다
- [ ] 모든 CRUD 작업이 정상 동작한다

### 비기능적 요구사항
- [ ] 모바일 기기에서 정상 동작한다 (반응형)
- [ ] API 응답 시간이 500ms 이내이다
- [ ] 사용자 인터페이스가 직관적이다
- [ ] 에러 상황이 적절히 처리된다
- [ ] 보안 취약점이 없다

### 개발 품질
- [ ] 코드 커버리지 80% 이상
- [ ] ESLint/Prettier 규칙을 준수한다
- [ ] API 문서가 Swagger로 자동 생성된다
- [ ] Git 커밋 메시지가 컨벤션을 따른다
- [ ] README 문서가 명확하고 상세하다

## 확장 기능 (Phase 2)
- [ ] 운동 루틴 템플릿 시스템
- [ ] 운동 추천 알고리즘
- [ ] 사진 업로드 및 Before/After 비교
- [ ] 푸시 알림 시스템
- [ ] 소셜 기능 (친구, 그룹 챌린지)
- [ ] 고급 분석 (ML 기반 부상 위험 예측)