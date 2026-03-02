# 개발 계획서: IT 지원 시스템 (Lighthouse)

이 문서는 Next.js(App Router), TypeScript, Tailwind CSS, Shadcn UI, Prisma 및 PostgreSQL을 활용하여 "Lighthouse" IT 지원 시스템(Helpdesk)의 MVP(최소 기능 제품)를 구축하기 위한 종합적인 개발 계획을 설명합니다.

### 🎯 목표 개요
내부 IT 지원 티켓팅 시스템(Helpdesk)인 "Lighthouse"의 MVP를 구축하는 것입니다. 임직원(User)은 IT 관련 기술 지원을 요청할 수 있으며, IT 관리자(Admin)는 접수된 티켓을 효율적으로 추적, 관리 및 해결할 수 있습니다. 이 시스템은 사내망(온프레미스) 배포를 목적으로 설계되며, 보안을 위해 별도의 외부 인증 서버를 연동하여 사용합니다.

### 🏗️ 아키텍처 및 인증 통신 방법
*   **인프라 구성**: Docker 컨테이너를 활용한 온프레미스 배포 (Next.js Node 서버 + PostgreSQL 데이터베이스 결합).
*   **사용자 인증 (Authentication)**: 로그인은 외부 API/Identity Provider 시스템에 위임합니다. 사용자가 외부 연동 로그인을 성공하면, Next.js 애플리케이션은 사용자의 `externalId`, `역할(Admin/User)`, 프로필 정보가 담긴 JWT(JSON Web Token)를 전달받아 세션을 인가(Authorization)합니다.
*   **API 모킹 (개발 환경)**: 실제 인증 서버가 준비되기 전까지 MVP 개발 단계에서는 가짜(Mock) 인증 API 핸들러를 만들어 가상의 JWT 토큰을 발급받아 테스트를 진행합니다.

### 💾 1. 데이터베이스 스키마 설계 (Prisma)
인증은 외부에서 처리되므로, 로컬 DB에는 비밀번호를 저장하지 않으며 티켓 관리에 필요한 최소한의 사용자 프로필 정보만 동기화하여 저장합니다.

*   **`User` (사용자) 모델**: 
    *   `id` (기본키)
    *   `externalId` (외부 인증 서버와 매핑되는 고유 식별자)
    *   `email` (이메일, 고유값)
    *   `name` (이름)
    *   `role` (권한: `USER` 일반 사용자 | `ADMIN` IT 관리자)
*   **`Location` (근무지) 모델** (옵션):
    *   `건물명`, `층수` - 장애 발생 위치를 IT 부서가 빠르게 파악하기 위함.
*   **`Ticket` (티켓) 모델**: 
    *   `id` (티켓 번호)
    *   `title` (제목), `description` (상세 내용)
    *   `status` (진행상태: `OPEN(접수)` | `IN_PROGRESS(진행중)` | `RESOLVED(해결됨)` | `CLOSED(종료)`)
    *   `priority` (우선순위: `LOW` | `MEDIUM` | `HIGH` | `URGENT(긴급)`)
    *   `category` (카테고리: 하드웨어, 소프트웨어, 네트워크, 권한요청 등)
    *   `submitterId` (요청자 User ID), `assigneeId` (담당 IT 관리자 User ID, 배정전엔 Null)
    *   `createdAt` (생성일), `updatedAt` (수정일)
*   **`Comment` (댓글/로그) 모델**: 
    *   티켓 내에서 사용자와 관리자가 주고받는 메시지 및 이력을 저장합니다. (`내용`, `티켓ID`, `작성자ID`)

### 🌐 2. API 엔드포인트 구조 (Next.js 라우트 핸들러)
*   **POST** `/api/auth/mock-login`: (개발 전용) 테스트용 가짜 JWT 토큰 발급.
*   **POST** `/api/tickets`: 신규 지원 티켓 생성 (사용자 전용).
*   **GET** `/api/tickets`: 티켓 목록 조회 (관리자는 전체 조회, 일반 사용자는 본인 티켓만 조회 가능). 상태, 우선순위 등에 따른 필터링을 지원합니다.
*   **GET** `/api/tickets/[id]`: 특정 티켓의 상세 정보 및 댓글 히스토리 조회.
*   **PATCH** `/api/tickets/[id]`: 티켓 상태, 우선순위, 담당자 변경 (관리자 전용).
*   **POST** `/api/tickets/[id]/comments`: 티켓에 새로운 댓글/답변 등록.

### 💻 3. 프론트엔드 화면 구성 (Next.js + Shadcn UI)
#### 공통 레이아웃
*   **사이드바 (Sidebar)**: 권한(Admin/User)에 따라 접속 가능한 메뉴가 다르게 노출됩니다.
*   **상단바 (Top Bar)**: 사용자 프로필 메뉴 및 전역 알림(Notification) 아이콘.

#### 일반 사용자 (Employee) 화면:
*   **`/dashboard`**: 본인이 접수한 티켓들의 처리 상태(접수/진행중/완료)를 배지로 한눈에 파악할 수 있는 요약 화면.
*   **`/tickets/new`**: 카테고리, 우선순위, 제목, 상세 증상을 입력하는 폼 뷰. (`zod`를 이용해 필수값 누락을 방지합니다.)
*   **`/tickets/[id]`**: 접수한 티켓의 상세 화면. 현재 진행 상태를 타임라인으로 보여주며, 하단에서 IT 관리자와 채팅처럼 메시지를 주고받을 수 있습니다.

#### IT 관리자 (Admin) 화면:
*   **`/admin/dashboard`**: IT 부서 전체의 업무량을 파악하는 대시보드 (미처리 티켓 수, 긴급 알림, 내게 할당된 작업 등).
*   **`/admin/tickets`**: 데이터를 빠르고 강력하게 분류할 수 있는 데이터 테이블(Data Table). 정렬, 다중 필터링, 검색을 지원합니다.
*   **`/admin/tickets/[id]`**: 관리자용 상세 화면. 사용자에게 답변을 남길 수 있을 뿐만 아니라, 우측 패널에서 티켓의 담당자를 다른 관리자로 이관하거나 상태(Status)를 즉시 변경할 수 있는 컨트롤 패널을 제공합니다.

### ✅ 4. 초기 MVP 검증(QA) 시나리오
1.  **데이터베이스 세팅 검증**: 로컬 Docker PostgreSQL을 띄운 뒤, `npx prisma db push` 명령어로 위에서 정의한 테이블이 에러 없이 생성되는지 확인합니다.
2.  **인증 권한 검증**: Mock API를 통해 관리자 계정과 일반 계정으로 각각 로그인했을 때, 일반 계정이 `/admin/tickets` 목록을 호출하면 정상적으로 접근(403 Forbidden)이 차단되는지 확인합니다.
3.  **핵심 사용자 흐름(Flow) 테스트**: 사용자가 "인터넷 접속 불가" 티켓을 긴급으로 생성하고 -> 관리자가 해당 티켓을 본인에게 할당한 뒤 "조치 중입니다" 댓글을 남기고 상태를 변경하면 -> 사용자 화면에서도 상태가 실시간 동기화되어 보이는 일련의 과정을 검증합니다.
