# 아키텍처 및 PostgreSQL 전환안

## ver01 구조

```text
Vue 화면
  ↓
Pinia Store — 업무 규칙·화면 공유 상태
  ↓
Dexie Repository — 트랜잭션·스키마 버전
  ↓
브라우저 IndexedDB
```

`src/lib/db.ts`가 저장 구조를, `src/stores/app.ts`가 예약 중복검사·토큰 차감/환불 같은 업무 트랜잭션을 담당합니다. UI가 IndexedDB를 직접 접근하지 않도록 분리해 향후 API 클라이언트로 교체할 수 있게 했습니다.

## 운영 목표 구조

```text
Vue SPA / 모바일 웹 / 키오스크
              ↓ HTTPS · OIDC
API Gateway / BFF
              ↓
예약 · 토큰 · 방문객 · 자원 · 연동 서비스
      ↓ PostgreSQL       ↓ Event Bus / MQTT
원장·예약·감사로그       외부 시스템 어댑터 / IoT Gateway
```

## PostgreSQL 전환 순서

1. 현재 TypeScript 인터페이스를 기준으로 OpenAPI 계약과 서버 DTO를 정의합니다.
2. `resources`, `bookings`, `departments`, `token_transactions`, `visitors`, `devices`, `integrations`, `audit_events` 테이블을 구축합니다.
3. 예약 시간 중복은 PostgreSQL range/exclusion constraint 또는 직렬화 트랜잭션으로 서버에서 최종 차단합니다.
4. 토큰 차감·환불은 단일 데이터베이스 트랜잭션과 멱등성 키로 처리합니다.
5. Pinia action의 Dexie 호출을 HTTP API repository로 교체하고 서버 상태는 재조회/캐시합니다.
6. IndexedDB는 오프라인 캐시와 임시 작업 저장으로만 축소하며 서버 권한검사를 신뢰 원천으로 둡니다.
7. 외부 이벤트는 outbox/inbox와 재시도 큐를 사용해 유실·중복을 처리합니다.

## 운영 구현 시 추가할 항목

- OIDC 로그인, 역할 기반 접근제어, API별 인가
- 데이터 암호화, 비밀정보 저장소, 감사로그
- 다중 사용자 동시성·낙관적 잠금·멱등성
- Webhook 서명 검증과 재시도/격리 큐
- 관측성(로그·메트릭·트레이스), ITSM 알림
- 개인정보 파기, 백업·복구, DR 훈련
- 단위·통합·E2E·장비 연동 시험과 부하·보안 시험

