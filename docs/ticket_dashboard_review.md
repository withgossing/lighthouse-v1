# 티켓 대시보드(Ticket Dashboard) 레이아웃 산출물 및 에이전트 검토

본 문서는 사내 IT 헬프데스크의 가장 핵심적인 **"티켓 대시보드 (Ticket Dashboard)"** 의 레이아웃 구조를 제안하고, 5명의 프로젝트 전문가 AI 에이전트들이 이를 리뷰한 결과를 정리한 문서입니다.

---

## 🎨 1. 티켓 대시보드 레이아웃 제안 (Proposed Layout)

대시보드는 사용자와 IT 관리자가 본인에게 관련된 티켓들을 직관적으로 확인하고 필터링하는 메인 공간입니다. 다음과 같은 세 가지 주요 섹션으로 구분됩니다.

### Section A: 요약 메트릭 카드 (Summary Metrics)
상단에는 현재 상황을 한눈에 파악할 수 있는 최소 4개의 주요 지표 카드를 배치합니다.
*   **Total Tickets**: 전체 생성된 티켓 수
*   **Open / Pending**: 아직 처리되지 않았거나 대기 중인 티켓 수
*   **Unassigned**: "담당자"가 배정되지 않고 방치된 티켓 수 (관리자에게만 붉은색 알림 표시)
*   **Resolved (Today)**: 오늘 해결 완료된 티켓 수

### Section B: 퀵 필터 및 검색바 (Quick Filters & Search)
메트릭 카드 바로 아래, 데이터 테이블 상단에 위치합니다.
*   **텍스트 검색 (Search)**: 제목, 내용 또는 티켓 번호로 빠른 검색.
*   **드롭다운 필터 (Select Filters)**:
    *   `Status` (Open, In Progress, Resolved)
    *   `Priority` (Low, Medium, High)
    *   `Category` (하드웨어, 소프트웨어, 네트워크 등)
*   **탭 (Tabs)**: "내 티켓 (My Tickets)", "전체 티켓 (All Tickets - Admins Only)"

### Section C: 반응형 데이터 테이블 (Responsive Data Table)
가장 많은 면적을 차지하는 핵심 표(Table) 영역입니다. `Shadcn UI Table` 컴포넌트를 사용합니다.
*   **컬럼(Columns)**:
    1.  `ID`: #TKT-001 형태의 짧은 식별 번호
    2.  `Title`: 티켓 제목 (클릭 시 상세 페이지로 이동)
    3.  `Status`: 현재 상태를 나타내는 색상 뱃지 (Badge 컴포넌트)
    4.  `Priority`: 중요도를 나타내는 아이콘 및 라벨
    5.  `Category`: 티켓의 분류 (예: 데스크톱/설치)
    6.  `Assignee`: 둥근 아바타 혹은 이메일/이름
    7.  `Created At`: 접수된 날짜 (`timeago` 포맷 ex. "2 hours ago")
*   **페이지네이션 (Pagination)**: 테이블 최하단에 `< Previous` `1, 2, 3...` `Next >` 제공.

---

## 🤖 2. 에이전트 그룹 리뷰 세션 (Agent Review Feedback)

### 📋 PM & Product Owner
*   **피드백**: "전반적인 구조는 합격점입니다. 다만, "관리자(ADMIN)"와 "일반 사원(USER)"이 보는 뷰가 명확하게 달라야 합니다. 일반 사원에게는 'Unassigned(미할당)' 카드는 혼란만 가중시키므로 숨기고, 본인이 올린 티켓의 처리 상황 메트릭만 보여주도록 렌더링을 이원화(Conditional Rendering)해 주세요."

### 🎨 UI/UX Designer
*   **피드백**: "Shadcn UI의 Data Table 컴포넌트를 쓸 때, 모바일 뷰에 대한 고민이 필요합니다. 컬럼이 7개나 되면 모바일에서는 무조건 스크롤이 깨집니다. 뷰포트 너비가 좁아지면 `Category`, `Created At`, `Assignee` 같은 부차적인 정보는 숨기고, `Title`과 `Status`만 보이게 반응형 유틸리티 클래스(`hidden md:table-cell`)를 꼼꼼히 적용할 것을 권고합니다. Status 뱃지 컬러는 직관적으로 (초록-해결, 노랑-진행, 빨강-대기) 설정합시다."

### 💻 Frontend Developer
*   **피드백**: "TanStack Table(Shadcn이 내부적으로 쓰는 라이브러리)을 적극 도입하는 것이 좋겠습니다. 텍스트 검색이나 필터링을 서버 엔진으로 매번 요청(Server-side Filtering)할지, 아니면 초기 1페이지(20~50개)를 들고 와서 클라이언트에서 빠르게 필터링(Client-side Filtering)할지 정해야 합니다. MVP 단계에서는 구현이 빠른 **Server-side Pagination & Filtering 방식**으로 Next.js Server Action 또는 URL `searchParams`를 활용하는 것을 지지합니다."

### ⚙️ Backend Developer
*   **피드백**: "프론트엔드의 `GET /api/tickets` 쿼리를 최적화할 준비가 되었습니다. 제안된 레이아웃에서 'Summary Metrics' (카드 데이터)를 그리기 위해 백엔드에서 통계용 API 쿼리 1번, 그리고 리스트 표출용 Pagination 쿼리 1번, 총 2개의 비동기 병렬 요청(`Promise.all`)이 프론트의 Server Component 렌더링 단계에서 효율적으로 일어나게 구성하면 성능이 완벽할 것입니다."

### 🛡️ QA & Security Engineer
*   **피드백**: "데이터 테이블에서 클릭하여 상세 페이지로 넘어가는 라우팅(`Link href="/tickets/[id]"`) 과정에서 URL 조작을 통한 인가 우회 테스트가 예상됩니다. 화면상에서 타인의 티켓이 안 보인다고 끝이 아니라, Backend API 설계 때 반영된 '권한 검증' 로직이 브라우저 콘솔 네트워크 탭이나 강제 URL 접근 시에도 동일하게 작동하는지 화면 렌더링 이후 반드시 E2E 테스트 시나리오에 포함하겠습니다."

---

## 🚀 3. 다음 실행 계획 (Next Execution Step)

1.  **메트릭 & 필터링 UI 구성**: 제안된 상단 Summary Card와 필터/검색 바를 먼저 컴포넌트화.
2.  **데이터 바인딩 및 URL 상태 동기화**: `?page=1&status=OPEN` 등 Next.js의 `searchParams`를 활용한 서버 사이드 테이블 렌더링 체계 세팅.
3.  **반응형 DataTable 컴포넌트 작성**: Shadcn UI Table 조립 및 모바일 CSS Hide 처리.
4.  권한 분기: User vs Admin 뷰 이원화.
