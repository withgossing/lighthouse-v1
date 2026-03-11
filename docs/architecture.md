# Lighthouse IT 지원 시스템 전체 아키텍처 문서 (Architecture)

본 문서는 사내 IT Helpdesk 시스템(Lighthouse)의 현재 기준 기술 스택, 시스템 아키텍처, 데이터베이스 모델 및 배포 전략을 정의합니다.

## 1. 개요 및 구조
Lighthouse는 모노레포(Monorepo) 구조를 채택하여 프론트엔드와 백엔드 프로젝트를 분리하면서도 데이터베이스 스키마와 타입을 쉽게 공유할 수 있도록 설계되었습니다. npm workspaces를 통해 `apps/`와 `packages/`를 관리합니다.

*   `apps/web`: 사용자 및 관리자가 접속하는 프론트엔드 웹 애플리케이션 (Next.js)
*   `apps/api`: 프론트엔드와 데이터베이스 사이에서 비즈니스 로직을 처리하는 백엔드 서버 (NestJS)
*   `packages/db`: 데이터베이스 연동 및 Prisma 스키마를 공통으로 관리하는 패키지

## 2. 기술 스택 (Tech Stack)

### 백엔드 (Backend - `apps/api`)
*   **프레임워크**: NestJS (v11) 기반의 체계적인 아키텍처
*   **언어**: TypeScript
*   **API 형태**: REST API

### 프론트엔드 (Frontend - `apps/web`)
*   **프레임워크**: Next.js (React 19)
*   **언어**: TypeScript
*   **UI/스타일링**: Tailwind CSS (v4), Shadcn UI (Radix UI 기반)
*   **폼 및 상태 관리**: React Hook Form, Zod (유효성 검증)
*   **인증**: NextAuth.js
*   **데이터 시각화**: Recharts

### 데이터베이스 및 인프라 (`packages/db`)
*   **데이터베이스**: PostgreSQL (v18)
*   **ORM**: Prisma (v5)

## 3. 배포(Deployment) 전략
Lighthouse는 온프레미스(On-premise) 환경 또는 사내망에 쉽게 배포할 수 있도록 `Docker`와 `docker-compose`를 기반으로 컨테이너화되어 있습니다.

*   **DB 컨테이너 (`db`)**: PostgreSQL 18 인스턴스를 실행합니다. (Port: 18011)
*   **API 컨테이너 (`api`)**: `Dockerfile.api`를 통해 NestJS 백엔드를 빌드하고 실행합니다. (Port: 18012)
*   **Web 컨테이너 (`web`)**: `Dockerfile.web`을 통해 Next.js 프론트엔드를 빌드하고 실행합니다. (Port: 18013)

데이터베이스 헬스체크(Healthcheck)를 통과하면 API 서버가 실행되고, API 서버에 의존성을 가진 Web 서버가 최종적으로 구동되는 순서를 보장합니다.

## 4. 인증 및 권한 (Authentication & Authorization)
*   비밀번호 기반 모델(`Bcryptjs` 사용 및 로컬 DB 저장) 또는 외부 연동 로그인(NextAuth 커스텀 제공자) 기능을 통해 세션을 인가합니다.
*   권한은 크게 일반 사용자(`USER`)와 IT 관리자(`ADMIN`)로 나뉘며, 프론트엔드(`NextAuth` 세션)와 백엔드(NestJS Guards) 양단에서 접근 통제를 수행합니다.

## 5. 데이터베이스 스키마 설계 (Core Models)
*   **`User`**: 시스템 사용자 및 관리자. (`id`, `email`, `role`)
*   **`Ticket`**: 사용자가 요청한 지원 서비스. 상태(`status`), 우선순위(`priority`), 카테고리 정보 포함.
*   **`Category`**: 티켓 분류를 위한 2단계 계층형 트리.
*   **`TicketHistory`**: 생성 및 상태 변경 등 변경 이력을 기록.
*   **`Comment`**: 담당 관리자와 사용자가 소통하는 텍스트 채널.
*   **`Notification`**: 티켓 상태 변경 시 사용자에게 전달되는 알람.
*   **`Attachment`**: 에러 로그 및 화면 캡쳐 이미지 등 파일 정보.
