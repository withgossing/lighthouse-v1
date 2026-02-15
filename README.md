# Lighthouse (등대) - Securities System Support Application

Lighthouse는 증권사 내부 사용자를 위한 통합 지원 시스템으로, 에이전트 없이 자동화된 방식으로 티켓 접수, 실시간 채팅, 원격 지원 기능을 제공합니다.

## 프로젝트 구조 (Project Structure)

이 프로젝트는 **Monorepo** 구조로 되어 있으며, Frontend와 Backend가 하나의 저장소에서 관리됩니다.

```
lighthouse-v1/
├── frontend/        # Next.js 기반 웹 애플리케이션
├── backend/         # NestJS 기반 API 및 WebSocket 서버
├── docker-compose.yml # (Optional) 개발 환경 구성을 위한 Docker 설정
└── README.md        # 프로젝트 설명 문서
```

## 시작 가이드 (Getting Started)

### 사전 요구 사항 (Prerequisites)

- Node.js (v18 이상)
- npm 또는 yarn
- Docker (선택 사항, 데이터베이스 실행 시 필요)

### 설치 및 실행 (Installation & Running)

1. **저장소 클론**
   ```bash
   git clone https://github.com/withgossing/lighthouse-v1.git
   cd lighthouse-v1
   ```

2. **Backend 실행**
   ```bash
   cd backend
   npm install
   npm run start:dev
   ```
   - 서버는 기본적으로 `http://localhost:4000`에서 실행됩니다.

3. **Frontend 실행**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   - 웹 애플리케이션은 `http://localhost:3000`에서 확인 가능합니다.

## 주요 기능 (Features)

- **대시보드**: 시스템 상태 모니터링 및 빠른 지원 요청
- **실시간 채팅**: WebSocket 기반의 상담원 연결 없이 자동 응답 및 지원 요청 접수
- **원격 지원**: WebRTC를 활용한 화면 공유 및 원격 제어 (개발 중)
- **지식 베이스**: 자주 묻는 질문(FAQ) 및 가이드 검색
- **티켓 관리**: 접수된 문의 내역 조회 및 상태 추적

## 기술 스택 (Tech Stack)

- **Frontend**: Next.js (App Router), Tailwind CSS, Zustand, Lucide React
- **Backend**: NestJS, TypeORM (SQLite/PostgreSQL), Socket.io
- **Database**: SQLite (기본), PostgreSQL (호환 가능)
- **DevOps**: Docker, Github Actions (예정)

## 라이선스 (License)

This project is licensed under the MIT License.
