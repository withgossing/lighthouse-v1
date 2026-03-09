# Lighthouse MVP: Mid-Phase Progress Review

본 문서는 사내 IT 헬프데스크 프로젝트(Lighthouse)의 현재까지 진행된 개발 상황을 점검하고, 앞으로 남은 과정(Next Steps)을 계획하기 위한 리뷰 문서입니다.

## 📈 1. 완료된 주요 작업 (Milestones Achieved)

프로젝트 기획부터 데이터베이스, 백엔드 API, 그리고 프론트엔드의 주요 레이아웃까지 MVP의 **약 70%** 가 성공적으로 구축되었습니다.

### 🏛️ 아키텍처 및 기획 (100% 완료)
*   **기술 스택 확정**: Next.js (App Router), Tailwind CSS, Shadcn UI, Prisma, PostgreSQL.
*   **요구사항 분석**: 계층형 2-Depth 카테고리, SLA, 티켓 이관 로직, 권한(ADMIN/USER) 분리기능 설계 완료.
*   **데이터베이스 설계**: `Ticket`, `Category`, `TicketHistory`, `TicketComment` 등 복잡한 관계형 엔티티 설계 및 배포(`schema.prisma`) 완료.

### ⚙️ 백엔드 / API 개발 (100% 완료 - MVP 기준)
*   `lib/prisma.ts` 싱글톤 연결 최적화 및 `api-response.ts` 표준 JSON 응답 포맷 구성.
*   **티켓 생명주기 API 완성**: 조회(GET), 생성(POST), 수정(PATCH - 히스토리 로깅 포함).
*   Mock 로그인 및 세션 미들웨어 유틸리티(`lib/auth.ts`) 구축.

### 🎨 프론트엔드 UI 개발 (진행 중 - 약 60%)
*   글로벌 레이아웃, 좌측 사이드바, 상단 헤더 컴포넌트(반응형).
*   **티켓 대시보드 (`/`)**: 
    *   사용자 요약 메트릭(Summary Cards).
    *   서버사이드 페이지네이션(Pagination) 및 상태 필터링이 연동된 **데이터 테이블(DataTable)** 완성.
*   **티켓 생성 폼 (`/tickets/new`)**: 
    *   `react-hook-form`과 `Zod`를 이용한 강력한 유효성 검증.
    *   `GET /api/categories?tree=true` 와 연동된 계층형(Parent-Child) 드롭다운 UI 완비.

---

## 🏃 2. 향후 진행 단계 (Next Steps)

현재 티켓을 **"생성"** 하고 **"목록으로 보는"** 것까지 완료되었습니다. 이제 남은 핵심 기능은 티켓을 클릭해서 들어가 **"상세 내용을 확인하고 처리(응답)"** 하는 뷰입니다.

### [Step 1] 티켓 상세 열람 화면 (`app/(dashboard)/tickets/[id]/page.tsx`)
*   **대상**: 일반 사용자(USER) 및 관리자(ADMIN) 공통.
*   **기능**: 사용자가 접수한 상세 Description, 카테고리, 우선순위 등을 읽기 전용으로 예쁘게 렌더링.
*   `api/tickets/[id]` 를 서버 컴포넌트 환경에서 Fetch하여 표시.

### [Step 2] 실시간 댓글 및 양방향 소통 UI (Ticket Comments)
*   **대상**: 공통
*   **기능**: 사용자와 IT 담당자가 메신저처럼 대화를 나눌 수 있는 쓰레드(Thread) 뷰.
*   작성 폼(Input)을 통해 `POST /api/tickets/[id]/comments` API 호출.

### [Step 3] 관리자 컨트롤 패널 (Admin Actions Panel)
*   **대상**: 관리자(ADMIN) 전용 UI.
*   **기능**: 
    1.  티켓 상태 변경 (OPEN -> IN_PROGRESS -> RESOLVED).
    2.  담당자 배정 (Assignee 변경).
*   이 패널에서 버튼을 누르면 `PATCH /api/tickets/[id]` 가 호출되어 DB가 업데이트되고 `TicketHistory` 에 자동으로 로그가 남습니다.

### [Step 4] E2E 최종 검증 및 배포 준비
*   테스트 코드 점검 및 전체적인 Walkthrough(테스트 시나리오) 수행.
*   프로덕션 수준의 DB 백업 및 배포 환경(Vercel 등) 검토.

---

📋 **요약**: 기초 뼈대와 혈관(API), 그리고 얼굴(Dashboard)이 모두 완성되었습니다. 이제 **세부 장기(상세 페이지와 댓글 등)** 만 붙이면 프로젝트가 완성됩니다!
