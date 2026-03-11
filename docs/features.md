# Lighthouse 기능 명세서 (Feature Specifications)

본 문서는 현재 구현된 코드를 바탕으로 사내 IT Helpdesk 시스템(Lighthouse)에서 제공하는 핵심 비즈니스 로직과 기능 정책을 설명합니다.

## 1. 사용자 역할 및 소속 (User Roles & Departments)
*   **역할 분리**: `USER`(일반 사원)와 `ADMIN`(IT 관리자) 두 가지 Role을 가집니다.
*   **부서(Department)**: 사용자는 IT, HR, FINANCE, SALES, MARKETING, OPERATIONS, MANAGEMENT, GENERAL 등 구체적인 부서에 소속됩니다.

## 2. 업무 분류 체계 및 접근 권한 (Category & Access Control)
*   **계층형 분류**: 2단계(대분류 -> 중분류) 트리 구조로 이루어진 `Category` 모델을 사용하여 발생한 이슈의 종류를 상세하게 매핑합니다.
*   **접근 권한(Access Rules)**: 단순히 모든 카테고리를 노출하는 것이 아니라 본인이 속한 `Department`(부서)나 `Role`(권한)에 따라 화면에 노출되고 선택할 수 있는 지원 요청 카테고리를 제한합니다. (예: IT 전용 카테고리는 일반 사원에게 보이지 않음).

## 3. 티켓 생명주기 및 담당자 배정 (Ticket Lifecycle & Assignment)
*   **상태 (Status)**: `OPEN`(접수) -> `IN_PROGRESS`(진행중) -> `RESOLVED`(해결됨) -> `CLOSED`(종료) 4단계 상태값을 가집니다.
*   **우선순위 (Priority)**: `LOW`, `MEDIUM`, `HIGH`, `URGENT`로 구분되어 장애의 긴급도를 표현합니다.
*   **할당 및 이관 (Assignee & Transfer)**: 최초 생성 시 미할당(`assigneeId`가 null) 상태가 되며, 관리자가 수동으로 본인이나 타인을 배정할 수 있습니다.
*   **발생 위치 (Location)**: 건물명과 층수 등 물리적 장애 발생 위치 정보를 별도의 `Location` 스키마로 매핑하여 출장 지원을 돕습니다.

## 4. 모든 처리 흐름 기록 (Audit Log / TicketHistory)
*   티켓에서 발생하는 상태 변경, 우선순위 변경, 담당자 변경, 카테고리 변경, 티켓 이관(Transfer) 등 주요 변경 이벤트는 **TicketHistory** 테이블에 누가(`changedById`), 언제 바꾸었으며, 변경 사유(`note`), 이전 값과 새로운 값이 무엇인지 상세히 로깅됩니다.
*   이를 통해 각 지원 건의 투명성을 확보하고 책임 소재를 명확히 합니다.

## 5. 소통과 파일 공유 (Comments & Attachments)
*   **댓글(Comment)**: 사용자와 IT 관리자는 티켓 내에서 스레드(Thread) 형태의 텍스트 메시지를 주고받으며 소통합니다.
*   **파일 첨부(Attachment)**: 에러 스크린샷이나 조치 로그를 첨부할 수 있으며, 이 첨부파일은 티켓 본문(`ticketId`)에 달릴 수도 있고, 개별 댓글(`commentId`)에 달릴 수도 있습니다. 

## 6. 인앱 알림 (Notifications)
*   별도로 이메일이나 메신저를 확인하지 않아도 웹 애플리케이션 내의 종 모양 알림 기능을 통해 필요한 정보를 즉각 푸시(Push)받습니다.
*   **발생 조건**: 새 티켓 생성(`TICKET_CREATED`), 담당자 배정됨(`TICKET_ASSIGNED`), 내 티켓 상태 변경(`TICKET_STATUS_CHANGED`), 내 티켓에 새 댓글 달림(`NEW_COMMENT`) 시 즉시 알림이 생성됩니다.

## 7. 대시보드 및 서비스 수준 통계 (Analytics & SLA)
*   **SLA (Service Level Agreement)**: 최초 접수 후 첫 답변이 달리기까지의 시간(`firstRespondedAt`)과 최종 해결되기까지의 시간(`resolvedAt`)을 데이터베이스 레벨에서 추적하여, IT 팀의 대응 속도 평가 및 개선 분석에 활용합니다.
*   **대시보드 통계**: NestJS의 `analytics` 모듈과 단위 페이지를 활용해 실시간 티켓 접수량, 미처리량 리스트를 요약, 시각화(Recharts)합니다.
