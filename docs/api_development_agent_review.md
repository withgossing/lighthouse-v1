# 백엔드 API 개발 단계: 구체화 및 에이전트 리뷰 (Agent Review of API Plan)

앞서 제안된 "백엔드 API 및 통신 레이어 개발" 단계에 대해 더 깊이 있는 동작 원리를 구체화하고, 프로젝트에 참여 중인 5개의 AI 에이전트(PM, 디자이너, 프론트엔드, 백엔드, QA/보안)의 관점에서 문제점이나 개선안이 없는지 점검(Review)한 문서입니다.

---

## 🏗️ 1. 개발 계획 구체화 (Detailed API Architecture)

우리가 개발할 Next.js (App Router) 기반의 통신 레이어는 단순히 DB와 프론트엔드를 연결하는 것을 넘어, **보안(권한 검사)**과 **유지보수성(공통화)**을 챙겨야 합니다.

**[🚀 구체적인 3단계 필수 작업]**

1.  **데이터베이스 통신 최적화 (`lib/prisma.ts`)**
    *   *원리*: 코드를 수정할 때마다 서버가 재시작(Hot-Reload)되는 개발 환경 특성상, 매번 새로운 DB 연결이 생겨 PostgreSQL 커넥션이 폭발하는 것을 막아야 합니다.
    *   *동작*: `globalThis` 객체 안에 단 한 개의 DB 연결(Singleton) 인스턴스만 캐싱해두고 모든 API가 돌려쓰도록 설정합니다.
2.  **API 응답 및 에러 공통화 로직 설계 (`lib/api-response.ts`)**
    *   *원리*: 프론트엔드 개발자가 API 호출 후 에러 처리를 쉽게 하려면, 백엔드가 주는 JSON의 모양이 언제나 똑같아야 합니다.
    *   *동작*: `successResponse(data)` 와 `errorResponse(message, status)` 라는 두 개의 핵심 함수를 만듭니다. 성공 시 HTTP 200과 `{ "success": true, "data": ... }` 를 반환하고, 실패 시 `{ "success": false, "error": "로그인 필요" }` 포맷으로 통일시킵니다.
3.  **임시 인증 로직 설계 (`lib/auth.ts` 및 `/api/auth/mock-login`)**
    *   *원리*: 외부 로그인(SSO) 연동은 가장 나중에 진행하므로, 현재 당장 관리자 권한과 일반 사용자 권한을 번갈아가며 테스트할 방법이 필요합니다.
    *   *동작*: `POST /api/auth/mock-login` API 스위치에 `{ "role": "ADMIN" }` 을 넣고 쏘면, 프론트엔드 브라우저에 임시 식별(Cookie 혹은 Session 토큰)을 심어주는 "백도어 서버"를 엽니다. 모든 API는 이 `lib/auth.ts`를 거쳐 *이 호출자가 Admin인지 User인지 검증*한 뒤 로직을 수행합니다.

---

## 🤖 2. 5개 전문가 에이전트 다각도 리뷰 (Agent Feedback)

위 구체안에 대해 각 파트의 에이전트들이 검토한 결과와 설계 개선안입니다.

### 📋 1. PM & 총괄 아키텍트 (PM & Architect Agent)
*   **리뷰 (Review)**: "DB 통신 최적화와 공통 규격 생성은 장기 프로젝트의 가장 훌륭한 첫 단추입니다. 싱글톤 패턴 적용은 MVP 이후에도 무조건 필요한 구조입니다."
*   **제언 (Action Item)**: "응답 처리 포맷(Response Wrapper)을 만들 때, 페이징 처리를 고려하여 `data` 배열 외에 `totalCount`, `page`, `limit` 같은 **메타 데이터(Meta)를 담을 수 있는 규격**을 미리 열어두세요. 나중에 관리자 데이터 테이블 만들 때 무조건 필요합니다."

### 🎨 2. UI/UX 디자이너 (UI/UX Designer Agent)
*   **리뷰 (Review)**: "API 응답 규격이 일정해지면, 화면 단에서 로딩 스피너(Loading)나 토스트(Toast) 팝업(예: '요청에 실패했습니다')을 띄울 때 일관된 디자인 모듈 코드를 짤 수 있어 UI 작업이 훨씬 수월해집니다."
*   **제언 (Action Item)**: " Mock 로그인을 만들 때, **에러가 났을 경우 반환되는 `error` 메시지 문자열을 가급적 사용자 친화적인 자연어(Korean)로** 세팅해 주었으면 좋겠습니다. (예: 'User Not Found' 보다는 '사용자를 찾을 수 없습니다.')"

### 💻 3. 프론트엔드 개발자 (Frontend Developer Agent)
*   **리뷰 (Review)**: "카테고리 조회 API 등은 매번 서버에서 가져오면 화면이 버벅일(Waterfall) 수 있습니다."
*   **제언 (Action Item)**: "React 서버 컴포넌트(RSC) 환경이라는 점을 십분 활용하여, DB 쿼리를 꼭 `/api/...` 라우트로 한 번 감아서 호출하지 말고, **프론트엔드 화면 서버 단에서 곧바로 `lib/prisma.ts` 를 불러와 DB를 직접 읽는 방식(Server Action / Server Component Fetching)**을 혼용하는 것이 Next.js 생태계에서 퍼포먼스가 가장 좋습니다."

### ⚙️ 4. 백엔드 및 API 개발자 (Backend Developer Agent)
*   **리뷰 (Review)**: "`lib/auth.ts` 로직은 매우 훌륭합니다. API 단의 방어벽이 생겼군요."
*   **제언 (Action Item)**: "인증 미들웨어를 짤 때, 토큰이 없는(비로그인) 접근자를 어떻게 처리할지 결정해야 합니다. `success: false, error: 'Unauthorized'` 뿐만 아니라 **HTTP Status Code 401 고정**을 지켜주세요. 그래야 프론트엔드 인터셉터가 로그인 페이지로 강제 리다이렉트를 시킬 수 있습니다."

### 🛡️ 5. QA 및 보안 엔지니어 (QA & Security Engineer Agent)
*   **리뷰 (Review)**: "Mock 로그인(`mock-login`) 라우터는 위험한 백도어(Backdoor)입니다."
*   **제언 (Action Item)**: "기존에도 한번 언급했지만, 이 테스트 라우트는 파일 내부 최상단에 `if (process.env.NODE_ENV === 'production') return new Response('Forbidden', { status: 403 })` 방어벽을 **개발 시점부터 강제로 하드코딩**하여, 나중에 까먹고 라이브(Live) 장비로 스크립트가 배포되어도 보안 침해가 없도록 원천 차단해 주세요."

---

## 🎯 최종 결정 액션 (Summary & Next Steps)
에이전트들의 피드백은 실무적으로 대단히 유용하며, 위 피드백 5가지는 즉각 코드에 반영되어도 무방할 만큼 필수적인 규칙들입니다.

**결론적으로 다음 개발 프로세스는 이렇게 흘러갈 예정입니다:**
1.  `lib/prisma.ts` 생성 (DB 인스턴스)
2.  `lib/api-response.ts` 생성 (PM 리뷰 수용: 페이징 메타데이터 포맷 포함)
3.  `lib/auth.ts` 생성 (백엔드 리뷰 수용: HTTP Status 401 철저)
4.  `app/api/auth/mock-login/route.ts` 생성 (QA 보안 리뷰 수용: 환경변수로 강제 차단 하드코딩 추가)

위 에이전트 의견들의 반영 방향이 마음에 드신다면, 이 계획대로 네트워크 기초 공사(코드 작성)에 들어가겠습니다. 승인해 주시겠습니까?
