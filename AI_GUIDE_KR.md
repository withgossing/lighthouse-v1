# Lighthouse - AI 에이전트 및 개발자 가이드

이 문서는 **Lighthouse** 프로젝트에 참여하는 AI 에이전트와 개발자를 위한 가이드입니다. 프로젝트의 **원칙(Rules)**, **작업 흐름(Workflow)**, **필요 역량(Skills)**을 정의하여, 작업 세션이 바뀌더라도 일관성 있는 품질과 맥락을 유지하는 것을 목적으로 합니다. `AI_GUIDE.md`는 AI를 위한 요약본이며, 본 문서는 사람을 위한 상세 설명서입니다.

---

## 1. Rules (원칙 및 제약사항)

### 1.1 언어 및 로컬라이제이션 (Language & Localization)
- **UI 언어**: 사용자에게 보이는 모든 텍스트는 반드시 **한국어**로 작성해야 합니다.
  - *예외*: 애플리케이션 이름인 "Lighthouse"는 영어로 표기합니다.
- **코드 언어**: 변수명, 주석, 커밋 메시지 등 개발 관련 텍스트는 **영어**를 사용합니다.
- **번역**: 금융 전문 용어는 자동 번역에 의존하지 않고 문맥에 맞는 용어를 사용합니다. (예: Ticket -> 문의/티켓, Execution -> 체결)

### 1.2 디자인 및 스타일 (Design & Styling)
- **배경색**: 메인 컨테이너의 배경은 항상 **`bg-white`**를 사용하여 깨끗하고 고급스러운 느낌을 유지합니다. 섹션 구분을 위해 꼭 필요한 경우가 아니라면 `bg-gray-50`과 같은 회색 배경은 지양합니다.
- **프레임워크**: **Tailwind CSS**만을 사용합니다. 별도의 CSS 파일이나 styled-components 도입은 금지합니다.
- **아이콘**: 모든 아이콘은 `lucide-react` 라이브러리를 사용합니다.

### 1.3 아키텍처 및 모노레포 (Architecture & Monorepo)
- **구조**: `frontend/`와 `backend/`로 나뉜 폴더 구조를 엄격히 준수합니다. 핵심 설정 파일의 위치를 임의로 변경하지 마십시오.
- **상태 관리**: 클라이언트의 전역 상태 관리는 **Zustand**를 사용합니다.
- **네트워크 환경**: 이 애플리케이션은 **폐쇄망(인트라넷)**에서 실행됩니다. 외부 CDN(예: Google Fonts URL)을 사용하는 의존성을 추가해서는 안 됩니다. 폰트나 라이브러리는 로컬에 포함되어야 합니다.

### 1.4 코드 품질 (Code Quality)
- **타입 안전성**: 엄격한 TypeScript 사용을 원칙으로 합니다. `any` 타입 사용을 지양하세요.
- **입력 처리**: 채팅 입력창 구현 시, 한글 입력 중 글자가 중복되는 현상을 방지하기 위해 반드시 **CJK Composition Fix**(`e.nativeEvent.isComposing`)를 적용해야 합니다.

---

## 2. Workflow (작업 흐름)

### 2.1 초기화 (Initialization)
1. **컨텍스트 확인**: 작업을 시작하기 전 `AI_GUIDE.md`와 `task.md`를 읽어 현재 진행 상황을 파악합니다.
2. **환경 점검**: Node.js 버전을 확인하고, 프론트엔드 포트(`3000`)와 백엔드 포트(`4000`)가 사용 가능한지 확인합니다.

### 2.2 개발 사이클 (Development Cycle)
1. **계획 (Plan)**: 복잡한 작업의 경우 `implementation_plan.md`를 작성하거나 업데이트하여 계획을 수립합니다.
2. **구현 (Implement)**:
   - 백엔드 변경 사항(API, 소켓 이벤트 등)을 먼저 구현합니다.
   - 이후 프론트엔드 연동 작업을 진행합니다.
3. **검증 (Verify)**:
   - `frontend` 폴더에서 `npm run dev`, `backend` 폴더에서 `npm run start:dev`를 실행합니다.
   - UI 상호작용(버튼 클릭, 폼 전송 등)을 직접 테스트합니다.
4. **문서화 (Document)**: 작업 완료 후 `task.md`와 `walkthrough.md`에 진행 내용을 업데이트합니다.

### 2.3 배포 및 버전 관리 (Deployment & Version Control)
- **커밋**: 영어로 명령어조(Imperative mood)를 사용하여 작성합니다. (예: "Add feature", "Fix bug")
- **푸시**: 의미 있는 단위의 작업이 완료되면 반드시 `origin main` 브랜치로 푸시합니다.

---

## 3. Skills (필요 역량 및 스택)

### 3.1 프론트엔드 엔지니어링 (Next.js)
- **App Router**: `page.tsx`, `layout.tsx`의 역할과 Server/Client Component의 차이를 이해하고 활용해야 합니다.
- **Tailwind CSS**: 유틸리티 클래스를 사용하여 복잡하고 반응형인 레이아웃을 구현할 수 있어야 합니다.
- **실시간 연동**: `socket.io-client`와 React Hooks를 연동하여 실시간 데이터를 처리할 수 있어야 합니다.

### 3.2 백엔드 엔지니어링 (NestJS)
- **모듈형 아키텍처**: Module, Controller, Gateway의 구조와 역할을 이해해야 합니다.
- **웹소켓 게이트웨이**: `SubscribeMessage` 데코레이터를 사용한 이벤트 처리 및 메시지 전송을 구현할 수 있어야 합니다.
- **TypeORM**: Entity 정의 및 Repository 패턴을 사용하여 데이터베이스(SQLite/PostgreSQL)를 다룰 수 있어야 합니다.

### 3.3 도메인 지식 (증권/고객지원)
- **티켓 생명주기**: 신규(New) -> 처리중(In Progress) -> 해결됨(Resolved)
- **원격 지원 흐름**: WebRTC 시그널링 개념(Offer, Answer, ICE Candidate)에 대한 이해가 필요합니다.
- **인트라넷 제약**: 오프라인 및 프록시 환경에서의 제약 사항을 인지하고 개발해야 합니다.

---

## 4. 현재 구성 참조 (Current Configuration)

| 컴포넌트 | 포트 | 로컬 URL |
|-----------|------|-----------|
| Frontend  | 3000 | http://localhost:3000 |
| Backend   | 4000 | http://localhost:4000 |
| DB (Dev)  | N/A  | SQLite (파일 기반) |

## 5. 현재 구현 상태 (Current Status)
- [x] 알림 및 사용자 프로필 (Mock Data)
- [x] 전체 검색 (지식 베이스 연동)
- [x] 티켓 관리 (목록/상세)

> **참고**: 3000번 포트가 사용 중일 경우, Next.js는 자동으로 3001번 포트를 사용합니다. 터미널 출력을 확인하세요.
