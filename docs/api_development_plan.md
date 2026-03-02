# 백엔드 API 개발 계획 (Backend API Route Development Plan)

데이터베이스 스키마(Prisma) 구축 완료에 이어, 화면(Frontend)과 DB를 연결해 줄 Next.js App Router 기반의 API 엔드포인트 개발 계획입니다.

## 🛠️ 1. 기본 인프라(Infrastructure) 세팅
*   **`lib/prisma.ts`**: 개발 모드(Hot Reloading)에서 Prisma Client 다중 인스턴스가 생성되어 커넥션 풀을 고갈시키는 문제를 방지하기 위한 Singleton 패턴 적용.
*   **API 응답 표준화 (Response Wrapper)**: 모든 API 라우트가 동일한 포맷의 JSON을 반환하도록 유틸리티 함수 작성.
    *   *성공 시*: `{ "success": true, "data": { ... } }`
    *   *실패 시*: `{ "success": false, "error": "에러 메시지" }`

## 🔒 2. 인증(Auth) 유틸리티 및 Mock 로그인 API
*   **`lib/auth.ts`**: 현재 로그인한 사용자의 세션 정보(JWT 또는 서버사이드 세션 쿠키)를 읽어와 DB의 `User` 객체와 맵핑하여 반환하는 유틸리티 함수. (API 내 권한 검사에 사용)
*   **`POST /api/auth/mock-login`**: 연동 전 프론트엔드 작업 및 테스트를 위해, 개발 환경에서만 동작하는 가짜 세션(Cookie) 발급 백도어 라우트 구현.

## 🗂️ 3. 카테고리 (Category) API
프론트엔드에서 티켓 작성 폼을 그릴 때 필요한 2단계 분류 목록 제공.
*   **`GET /api/categories`**: 전체 대/중/소 카테고리를 트리 구조(Nested JSON)로 묶어서 반환.

## 🎫 4. 티켓 (Ticket) 코어 API
*   **`POST /api/tickets`**: 일반 사용자가 새로운 티켓을 등록(Create).
    *   초기 배정은 미할당(`assigneeId: null`), 상태는 `OPEN` 고정.
*   **`GET /api/tickets`**: 티켓 목록 조회 (Data Table 용도).
    *   쿼리 파라미터(`status`, `categoryId`, `priority`) 필터링 지원.
    *   권한 체크: 일반 사용자는 본인이 작성한(`submitterId`) 건만, 관리자는 전체를 조회.
*   **`GET /api/tickets/[id]`**: 단일 티켓의 상세 정보, 타임라인 역사(`historyLogs`), 댓글(`comments`), 첨부파일(`attachments`) 정보 모두를 반환.
*   **`PATCH /api/tickets/[id]`**: 티켓 메타데이터 갱신 (상태, 우선순위, **담당자 배정/이관** 등).
    *   이 라우터 호출 시 자동으로 `TicketHistory` 에 변경 이력 로깅.

## 💬 5. 댓글 (Comment) API
*   **`POST /api/tickets/[id]/comments`**: 특정 티켓에 새로운 댓글을 남깁니다.
    *   (추후 고도화 시 파일 첨부 정보 매핑 처리 포함)

---

위 계획을 바탕으로 `lib` 폴더의 공통 함수 구성을 가장 먼저 시작해야 합니다.
