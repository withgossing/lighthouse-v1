# Lighthouse 개발자 참고 문서 (Developer Guide)

본 문서는 사내 IT Helpdesk(Lighthouse) 시스템을 로컬에서 개발하고 유지보수하는 데 필요한 **프론트엔드(Next.js)와 백엔드(NestJS)** 의 핵심 통신 로직 및 코드 구조를 가이드합니다.

## 1. 프론트엔드 - 웹 (apps/web)
Next.js 15 (App Router) 기반으로 개발되었습니다.

*   **데이터 페칭 (Data Fetching Pattern)**: 
    *   화면을 그리기 위한 데이터는 클라이언트(브라우저)에서 백엔드로 직접 쏘지 않고, `apps/web/src/lib/data/` 디렉토리에 있는 유틸리티 함수들을(예: `dashboard.ts`, `tickets.ts`) 통해 **React Server Components (RSC)** 단에서 안전하게 가져옵니다.
    *   이때 프론트엔드 서버는 `INTERNAL_API_URL`(http://api:18012) 환경변수를 참조하여 동일한 Docker 네트워크 내의 백엔드를 호출합니다.
*   **컴포넌트 및 스타일 (UI)**: 
    *   Tailwind CSS (v4)와 Shadcn UI를 주축으로 컴포넌트 단위(`web/src/components`) 캡슐화가 적용되어 있습니다. 
    *   복잡한 폼 검증은 `react-hook-form` + `zod` 조합으로 유효성 처리를 강화했습니다.
*   **페이징 및 필터 제어**: 
    *   대시보드의 데이터 테이블은 Server-side Pagination 방식을 택했습니다. 클라이언트에서 상태를 관리하기보다는 URL Query Parameter(`searchParams`)를 Next.js의 서버 컴포넌트가 파싱하여 백엔드에 쿼리를 던지고, 그 결과 배열과 전체 페이지 메타데이터 등을 렌더링합니다.

## 2. 백엔드 - 서버 API (apps/api)
NestJS 11 기반의 모듈화(Controller-Service-Module) 아키텍처로 구현되었습니다.

*   **진입점 및 모듈 구성 (`app.module.ts`)**:
    *   `PrismaModule`, `CategoriesModule`, `TicketsModule`, `UploadModule`, `AnalyticsModule`, `NotificationsModule` 로 도메인별 관심사가 명확히 분리되어 있습니다.
*   **엔드포인트 및 권한 제어 (Guards)**:
    *   각 모듈의 컨트롤러(예: `TicketsController`)는 전역적으로 `@UseGuards(AuthGuard)`의 보호를 받습니다. 
    *   AuthGuard는 프론트엔드가 요청 헤더로 넘어주는 `x-user-id`와 `x-user-role`을 검사하여 유효성을 판별하며, `@CurrentUser()` 커스텀 데코레이터를 이용해 비즈니스 서비스 레이어로 유저 컨텍스트를 넘겨줍니다.
*   **주요 API 목록**:
    *   `GET /api/tickets`: 티켓 목록 조회 (Query `page`, `limit`, `status`, `priority` 등을 지원하며 `pagination` 메타를 돌려줌)
    *   `GET /api/tickets/:id`: 단일 티켓 조회 및 티켓에 달린 `historyLogs`, `comments` 등 상관 데이터(Relations) 조인
    *   `PATCH /api/tickets/:id`: 티켓의 상태, 타인 배정, 이슈 분류 등을 변경(업데이트)
    *   `POST /api/tickets/:id/comments`: 특정 티켓 내부에 새 댓글 작성
    *   `GET /api/analytics`: 대시보드 상단 요약본을 위한 티켓 통계(전체/할당대기/금일 완료) 데이터 집계 

## 3. 공통 데이터베이스 (packages/db)
Prisma ORM 기반으로 프론트엔드와 백엔드가 데이터 모델 인터페이스를 투명하게 공유하는 역할을 합니다.

*   **스키마 구조**: `packages/db/prisma/schema.prisma` 에서 모든 모델 정보가 정의되어 있으며 `npm run generate` 스크립트를 통해 양쪽 프로젝트(Next/Nest)에서 타입스크립트 기반 클라이언트를 사용할 수 있게 됩니다.
*   **DB 연결 관리**: 백엔드 `PrismaService` (`apps/api/src/prisma.service.ts`)가 전역적으로 주입되며 데이터베이스 통신 트랜잭션을 전담합니다.
