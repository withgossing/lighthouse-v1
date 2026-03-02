# Feature Extension: Attachments, Notifications, & Additional Requirements

이 문서는 기존 MVP(Minimum Viable Product) 스키마에 **파일 첨부(Attachments)** 및 **알림(Notifications)** 기능을 추가하기 위한 DB 설계 변경안과 추가적인 필수 기능 검토 내용을 담고 있습니다.

---

## 💾 1. 파일 첨부(Attachments) DB 설계

티켓 생성 시 에러 화면 캡처, 첨부 파일 등을 저장하기 위한 설계입니다.

### 저장 매체 (Storage) 결정 방향
*   **권장안 (S3 호환 스토리지)**: 클라우드(AWS S3) 또는 온프레미스 오브젝트 스토리지(MinIO 등)를 사용하는 것이 안전하며 확장성이 좋습니다.
*   **보조안 (로컬 파일 시스템)**: 온프레미스 보안이 묶여 있다면 서버의 특정 폴더(예: `/public/uploads` 혹은 Docker Volume)에 저장할 수 있습니다.
*   *스키마 측면*: 저장 매체와 무관하게 DB에는 **파일의 경로(URL/Path)**와 메타데이터만 저장하도록 추상화합니다.

### 📝 Prisma 스키마 추가 사항 (`Attachment` 모델)

```prisma
model Attachment {
  id           String   @id @default(uuid())
  fileName     String   @db.VarChar(255)       // 원본 파일명 (예: error_screen.png)
  fileUrl      String   @db.Text                 // 파일이 실제 저장된 경로 또는 S3 URL
  fileSize     Int                               // 파일 용량 (Bytes 단위)
  mimeType     String   @db.VarChar(100)       // MIME 타입 (예: image/png, application/pdf)
  createdAt    DateTime @default(now())

  // Foreign Keys
  ticketId     String?                           // 어떤 티켓에 첨부되었는지 (티켓 본문 첨부용)
  commentId    String?                           // 어떤 댓글에 첨부되었는지 (댓글 첨부용)
  uploadedById String                            // 누가 업로드 했는지 추적

  // Relations
  ticket       Ticket?  @relation(fields: [ticketId], references: [id], onDelete: Cascade)
  comment      Comment? @relation(fields: [commentId], references: [id], onDelete: Cascade)
  uploadedBy   User     @relation(fields: [uploadedById], references: [id])

  @@index([ticketId])
  @@index([commentId])
  @@map("attachments")
}
```
*   **리뷰 포인트**: 파일은 티켓 본문(`ticketId`)에 첨부될 수도 있고 관리자와 소통하며 작성하는 댓글(`commentId`)에도 첨부될 수 있도록 양쪽 외래키를 nullable하게 설계했습니다.

---

## 🔔 2. 알림(Notifications) DB 설계

이메일이나 메신저 웹훅 외에, **"웹 어플리케이션(Lighthouse) 상단 우측 종 모양 아이콘"**으로 떨어지는 인앱(In-App) 알림 기능입니다.

### 📝 Prisma 스키마 추가 사항 (`Notification` 모델)

```prisma
enum NotificationType {
  TICKET_CREATED       // 내게 할당된 새 티켓이 생성됨 (Admin)
  TICKET_ASSIGNED      // 누군가 이 티켓을 내게 할당함 (Admin)
  TICKET_STATUS_CHANGED// 내 티켓의 상태가 변경됨 (User)
  NEW_COMMENT          // 내 티켓에 관리자가 댓글을 닮 (User) / 내가 담당하는 티켓에 사용자가 추가 댓글을 닮 (Admin)
}

model Notification {
  id        String           @id @default(uuid())
  type      NotificationType
  title     String           // 요약 제목 ("새로운 댓글이 달렸습니다")
  message   String?          @db.Text // 상세 메시지 ("관리자님이 '증상 확인했습니다...' 라고 남겼습니다.")
  isRead    Boolean          @default(false)
  createdAt DateTime         @default(now())

  // Foreign Keys
  userId    String           // 알림을 받는 사람
  ticketId  String?          // 클릭 시 이동할 티켓 ID (Link 용도)

  // Relations
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  ticket    Ticket?  @relation(fields: [ticketId], references: [id], onDelete: Cascade)

  @@index([userId, isRead]) // "아직 안 읽은 유저 알림" 필터링 최적화
  @@map("notifications")
}
```
*   **리뷰 포인트**: 알림은 상태 변경 등의 이벤트 발생 시 백엔드 코드 단에서 생성됩니다. 읽지 않은(`isRead: false`) 알림을 가져오는 쿼리가 빈번하므로 인덱스를 걸었습니다.

---

## 💼 3. 그 외 실무 파트 필수 요구사항 검토 (Review & Gap Analysis)

현재 시나리오 외에 헬프데스크가 실제 동작하려면 고려해야 하는 추가 요소들입니다. 
당장 개발할 필요는 없지만, 확장성을 위해 염두에 두고 설계해야 합니다.

1.  **부서/팀 (Department) 정보**
    *   *분석*: 사용자가 속한 부서(영업팀, 재무팀 등)에 따라 요청 사항을 처리하는 프로세스가 다르거나, 부서 단위의 통계를 봐야 할 경우가 많습니다. `User` 테이블에 `department` 필드(Enum 혹은 별도 연관 테이블)를 추가하는 것이 좋습니다.
2.  **SLA (Service Level Agreement) 시간 추적**
    *   *분석*: "우선순위가 High인 건은 몇 분 내에 답변해야 한다" 같은 업무 규칙 측정용입니다. 티켓의 최초 응답 시간(`firstRespondedAt`), 해결 시간(`resolvedAt`) 같은 타임스탬프 스키마를 미리 티켓 테이블에 박아두는 것이 측정에 유리합니다.
3.  **Audit Logs/History (변경 이력 추적)**
    *   *분석*: 티켓의 상태(`OPEN` -> `IN_PROGRESS`)가 언제, 누구에 의해 바뀌었는지 내역을 추적하는 기능입니다. (현재는 댓글 모델로 대체 가능하나, 전문적인 이력 테이블 `TicketHistory`를 두기도 함). 당장은 MVP로서 `Comment` 만으로 상태변경을 로깅(System Comment)하는 방식으로 커버 가능합니다.
4.  **관람자/참조인 (CC / Watchers)**
    *   *분석*: 티켓 요청자는 아니지만 진행 상황을 같이 공유받아야 하는 팀장이나 다른 담당자 지정 기능입니다. `TicketWatcher` 등의 다대다(N:M) 연관 테이블이 필요할 수 있습니다. (추후 고도화 시 고려)

### 💡 결론 및 다음 액션 (결정 필요)
파일 첨부(`Attachment`)와 알림(`Notification`) 모델은 초기부터 구조적으로 들어가는 것이 좋으므로, **이 두 가지 모델을 현재 `schema.prisma` 코드에 즉시 병합(Merge)하고 DB에 다시 Push** 하는 것이 베스트 프랙티스로 보입니다.

위의 내용에 동의하신다면, 바로 `schema.prisma`를 업데이트하여 이 두 가지 기능(첨부+알림)을 추가 적용하겠습니다. 추가로 "이것도 넣자!" 하는 기능이 있다면 말씀해 주세요.
