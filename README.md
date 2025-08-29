# FortuneApp

사주, 타로, 운세 서비스 - 사용자의 생년월일과 생시 정보를 바탕으로 ChatGPT API를 통해 전문적인 사주 해석을 제공하는 웹 애플리케이션

## 🏗️ 기술 스택

### Backend
- **Framework**: Spring Boot 3.2+
- **Build Tool**: Gradle
- **Database**: H2 (개발용)
- **External API**: OpenAI ChatGPT API
- **Documentation**: Swagger/OpenAPI 3

### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (카드 디자인, 모달 컴포넌트)
- **State Management**: Context API or Zustand
- **HTTP Client**: Axios

### Development Tools
- **Containerization**: Docker, Docker Compose
- **Process Management**: concurrently
- **Code Quality**: ESLint, Prettier

## 🚀 빠른 시작

### 필수 조건
- Node.js 18+
- Java 17+
- OpenAI API Key (ChatGPT API 사용을 위함)
- Docker & Docker Compose

### 설치 및 실행

```bash
# 저장소 클론
git clone <repository-url>
cd fortune-app

# 의존성 설치
npm install

# 환경변수 설정
# server/src/main/resources/application.yml에서 OpenAI API 키 설정
openai:
  api:
    key: ${OPENAI_API_KEY:your-api-key-here}

# 개발 서버 실행 (프론트엔드 + 백엔드 동시)
npm run dev

# 또는 개별 실행
npm run server:dev  # 백엔드만
npm run client:dev  # 프론트엔드만

# Docker 환경 실행
npm run docker:dev
```

### 접속 정보
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html

### 사용 방법
1. 메인 페이지에서 사주 카드 클릭 (타로, 오늘의 운세는 준비중)
2. 생년월일, 생시, 성별 입력
3. AI가 분석한 전문적인 사주 해석 결과 확인

## 📁 프로젝트 구조

```
fortune-app/
├── client/              # React + TypeScript Frontend
│   ├── components/      # UI 컴포넌트들
│   │   ├── cards/       # 운세 타입 카드 컴포넌트들
│   │   ├── modals/      # 모달 컴포넌트들
│   │   └── common/      # 공통 컴포넌트들
│   ├── pages/           # 페이지 컴포넌트들
│   ├── services/        # API 서비스
│   └── types/           # TypeScript 타입 정의
├── server/              # Spring Boot Backend
│   ├── controller/      # REST API Controllers
│   ├── service/         # Business Logic (OpenAI API 연동 등)
│   ├── dto/            # Data Transfer Objects
│   └── config/          # Spring Configuration
├── docs/                # Documentation
├── docker-compose.yml
└── package.json        # Root package.json (dev scripts)
```

## 🎯 주요 기능

1. **Fortune Type Selection**: 메인 페이지에서 사주, 타로, 오늘의 운세 카드 선택 (1단계에서는 사주만 활성화)
2. **Birth Information Input**: 생년월일, 생시, 성별 입력을 위한 모달 인터페이스
3. **AI-Powered Fortune Reading**: ChatGPT API를 통한 전문적인 사주 해석
4. **Professional Fortune Analysis**: 사주 전문 프롬프트를 활용한 정확하고 상세한 해석
5. **Responsive Design**: 모바일 친화적인 카드 기반 UI 디자인

## 🔧 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 테스트
npm run test

# Docker
npm run docker:dev    # 컨테이너 실행
npm run docker:down   # 컨테이너 중지
```

## 📚 문서

- [Claude 개발 가이드](./CLAUDE.md) - FortuneApp 개발 체크리스트 및 가이드라인
- [API 문서](http://localhost:8080/swagger-ui.html) (개발 서버 실행 후)

## 🔮 API 엔드포인트

- **POST** `/api/fortune/saju` - 사주 해석 요청
- **GET** `/api/health` - 서버 상태 확인

## 🎯 사용자 플로우

1. **메인 페이지 진입** → 3개 카드 중 사주 카드만 활성화 상태
2. **사주 카드 클릭** → 생년월일/생시 입력 모달 표시
3. **정보 입력 완료** → ChatGPT API 호출하여 사주 해석
4. **전문적인 사주 결과 표시**

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이센스

This project is licensed under the ISC License.

## ✨ 향후 계획 (Phase 2)

- [ ] 사용자 계정 시스템 (로그인/회원가입)
- [ ] 사주 기록 저장 및 조회 기능
- [ ] 타로 카드 해석 기능 추가
- [ ] 오늘의 운세 기능 추가
- [ ] 사주 결과 공유 기능 (SNS, 링크 공유)
- [ ] 프리미엄 기능 (더 상세한 해석, 궁합 등)