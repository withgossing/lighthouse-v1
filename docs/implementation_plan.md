# 🚀 Lighthouse 향후 개발 구현 계획서 (Implementation Plan)

본 문서는 `docs/requirements_specification.md` 에서 종합된 에이전트들의 검토 의견과 현재(MVP) 프로젝트의 아키텍처(Next.js + NestJS 모노레포)를 바탕으로, **실제 코드로 구현하기 위한 단계별 상세 작업 계획**을 서술합니다.

---

## 단계 1 (Phase 1): 보안 강화 및 모바일 UI 최적화
가장 시급한 취약점 방어와 모바일 사용성을 확보합니다.

### 1-A. 첨부 파일 보안 (File Upload Security)
*   **대상 서비스**: `apps/api/src/upload` 및 관련 Controller
*   **작업 내용**:
    *   [백엔드] NestJS 파일 업로드 인터셉터(`FileInterceptor`)에 `fileFilter` 로직 추가.
    *   [백엔드] MIME 타입 검사 로직 작성 (예: `image/jpeg`, `image/png`, `application/pdf`, `text/plain` 만 허용).
    *   [백엔드] `MaxFileSizeValidator` 파이프를 이용해 파일 크기 제한 (예: 10MB) 하드코딩 적용.
    *   [프론트] 파일 첨부 시 허용되지 않은 확장자/용량 초과 시 `toast.error` 로 즉각적인 클라이언트 에러 피드백 표시.

### 1-B. 대시보드 데이터 테이블 모바일 반응형 처리
*   **대상 컴포넌트**: `apps/web/src/components/dashboard/ticket-data-table.tsx`
*   **작업 내용**:
    *   [프론트] Shadcn UI의 `<TableHead>` 및 `<TableCell>` 컴포넌트 클래스 수정.
    *   [프론트] 핵심 정보(`Title`, `Status`, `CreatedAt`)를 제외한 나머지 보조 컬럼(`Assignee`, `ID`, `Priority` 등)에 `hidden md:table-cell` 클래스 적용.
    *   [프론트] 카테고리 등 텍스트가 긴 컬럼은 `truncate` 처리하여 모바일 테이블 가로 스크롤 방지.

---

## 단계 2 (Phase 2): 사용자 소통의 실시간성 및 캐시 성능 확보
대규모 트래픽을 대응하고 헬프데스크의 핵심인 "빠른 대화" 경험을 개선합니다.

### 2-A. 인메모리 캐싱 도입 (Redis or NestJS CacheModule)
*   **대상 서비스**: `apps/api/src/analytics`, `apps/api/src/categories`
*   **작업 내용**:
    *   [백엔드] NestJS 내장 캐시 매니저(`CacheModule.register()`)를 AppModule에 연동.
    *   [백엔드] 정적 데이터인 전사 부서 리스트 및 트리형 `Category` 목록 응답(`GET /api/categories`) Controller에 `@UseInterceptors(CacheInterceptor)` 적용. TTL(생명주기) 1시간 할당.
    *   [백엔드] `analytics.controller.ts`의 전사 티켓 트렌드 요약 데이터 또한 5분~10분 단위의 TTL 캐시 부여로 DB Hit 최소화.

### 2-B. 코멘트 실시간 소통 (Optimistic UI & Broadcast)
*   **대상 서비스**: `apps/web/src/components/tickets/ticket-comments.tsx` 및 Backend API
*   **작업 내용**:
    *   [프론트] 댓글 전송 버튼 클릭 시, 서버 응답이 오기 전에 미리 화면(UI State)에 내가 쓴 글을 덧붙이는 **Optimistic Update** 적용.
    *   [백엔드] (선택) `Socket.io` 기반의 NestJS Gateway 모듈 신설 추가.
    *   [프론트] `useEffect` 를 통해 소켓에 접속하고, 같은 티켓(`Room: ticketId`)을 보고 있는 관리자가 새 댓글을 달면 클라이언트 뷰에서 즉시 말풍선 렌더링.

---

## 단계 3 (Phase 3): 스킬 및 부하 기반 티켓 자동 할당 알고리즘
수동 배정의 비효율을 없애고 업무를 지능적으로 분배합니다.

### 3-A. 관리자 스킬스택 매핑 (DB 스키마)
*   **대상 스키마**: `packages/db/prisma/schema.prisma`
*   **작업 내용**:
    *   [DB] `User` 테이블(또는 N:M 관계 테이블)에 `AdminSkill` (예: "Network", "Hardware") 등 관리자가 처리할 수 있는 주력 카테고리 매핑 관계선 추가.
    *   [DB] `prisma db push` 수행.

### 3-B. Round-Robin 티켓 배분 로직 개발 (Auto-Routing)
*   **대상 서비스**: `apps/api/src/tickets/tickets.service.ts`의 `createTicket` 로직.
*   **작업 내용**:
    *   [백엔드] 새 티켓 폼 파라미터로 넘어온 `categoryId`를 확인.
    *   [백엔드] DB 쿼리를 통해 해당 `categoryId`를 서포트하는 `role="ADMIN"` 유저 목록 추출.
    *   [백엔드] 그 후보자 목록 중, **현재 `status = IN_PROGRESS` 인 티켓수가 가장 적은 관리자 (Workload 최소 인원)** 를 조회 단일 리턴 (`ORDER BY count(tickets) ASC LIMIT 1`).
    *   [백엔드] 해당 관리자의 ID를 `assigneeId`로 매핑하여 Ticket Insert 쿼리 실행. 이와 동시에 해당 관리자에게 `TICKET_ASSIGNED` Notification 발행.

---

### 마치며
요구사항 정의서에 명시된 모든 에이전트의 의견은 위 3단계를 거쳐 코드로 반영될 것입니다. 이 문서는 차기 개발 스프린트의 **백로그(Backlog)**로 활용되며, 1단계부터 순차적으로 체크리스트화하여 개발을 진행합니다.
