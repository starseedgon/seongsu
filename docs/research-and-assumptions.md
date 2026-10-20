# 기술 조사 및 외부 시스템 가정

작성일: 2026-10-20 (Asia/Seoul)

## 조사 결과

- Tailwind CSS 공식 문서는 v4에서 Vite 전용 플러그인과 CSS `@import "tailwindcss"` 사용을 권장합니다. 현재 npm 배포 버전은 프로젝트 생성 시점 기준 4.3.3입니다. [공식 Vite 설치 문서](https://tailwindcss.com/docs/installation/using-vite)
- Vue 공식 가이드는 빌드형 SPA에 Vite와 Single-File Components를 안내합니다. [Vue Quick Start](https://vuejs.org/guide/quick-start.html)
- Pinia는 여러 화면에서 공유하는 상태와 업무 로직을 Store에 두는 Vue 상태 관리 라이브러리입니다. [Pinia Getting Started](https://pinia.vuejs.org/getting-started)
- IndexedDB는 브라우저의 구조화 로컬 저장소이며, Dexie는 IndexedDB를 Promise·트랜잭션·버전 스키마로 다루는 래퍼입니다. [Dexie 공식 문서](https://dexie.org/docs/Dexie.js)
- OpenID Connect는 OAuth 2.0 위의 인증 계층, SCIM 2.0은 HTTP 기반 사용자·그룹 프로비저닝 표준입니다. [OIDC Core](https://openid.net/specs/openid-connect-core-1_0-18.html), [SCIM RFC 7644](https://www.rfc-editor.org/info/rfc7644/)
- MQTT 5는 IoT에 적합한 경량 publish/subscribe 표준이며 인증·인가·보안 통신을 적용해야 합니다. [OASIS MQTT 5](https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html)
- BACnet은 HVAC, 조명, 출입 등 빌딩 자동화 장비의 상호운용을 위한 표준입니다. [ASHRAE Standard 135 자료](https://data.ashrae.org/bacnet/)

## 외부 시스템 가정

현재 고객 시스템의 제품·API가 지정되지 않았으므로 프로토타입은 아래를 전제로 합니다.

| 영역 | 가정 | 운영 전 확인 |
|---|---|---|
| 인증 | 사내 IdP가 OIDC 또는 SAML 제공 | 발급자, 클라이언트, MFA, 역할 클레임 |
| HR/조직 | SCIM 2.0 또는 증분 REST 제공 | 조직코드, 겸직, 휴직·퇴사 반영시간 |
| 그룹웨어 | 일정 REST API와 Webhook 제공 | 반복일정, 양방향 충돌, 리소스 사서함 |
| 출입통제 | 임시 자격증명 발급/회수 API 제공 | QR 형식, 구역·시간 권한, 오프라인 정책 |
| 사원증 | 카드번호 대신 비가역 매핑키 제공 | 카드 교체·분실·퇴사 처리 |
| 회의실 | 사이니지·화상회의 장비 관리 API 제공 | 모델, 테넌트 권한, 원격 제어 범위 |
| 차량 | 스마트키 보관함과 차량 관제 API 제공 | 운전자 자격, 위치·운행 기록 동의 |
| 주차 | LPR 및 방문차량 등록 API/Webhook 제공 | 차량번호 규격, 할인·정산, 실패 처리 |
| F&B | 운영사 주문·재고·결제 API 제공 | PG/VAN, 취소·환불, 정산 책임 |
| BMS/IoT | 현장 게이트웨이가 BACnet을 MQTT 5/HTTPS 이벤트로 중계 | 토픽, QoS, 인증서, 장비 명명 규칙 |

## 프로토타입 데이터 가정

- 날짜와 시설·사용자·부서 정보는 데모용 샘플입니다.
- 토큰은 현금성 자산이 아닌 시설 수요 조절용 가상 단위로 가정합니다.
- QR 이미지는 UX 검증을 위한 시각적 모형이며 실제 출입 자격증명이 아닙니다.
- AI 활용 제안은 고정 샘플 데이터에 대한 규칙 기반 문구입니다.
- 모든 데이터는 현재 브라우저 프로필의 IndexedDB에만 저장됩니다. 브라우저/기기 간 동기화되지 않습니다.

## 보안·운영 전제

- MQTT는 TLS와 장비별 인증서, 최소 권한 토픽 ACL을 적용합니다.
- 출입 QR에는 개인정보를 넣지 않고 짧은 만료시간의 서명 토큰 또는 서버 조회용 난수를 사용합니다.
- 토큰 증감은 수정 가능한 잔액만 저장하지 않고 append-only 거래 원장과 감사 이벤트를 함께 저장합니다.
- 개인정보와 민감한 공간 이용 데이터는 목적별 최소 수집, 역할별 접근, 보존기간 후 파기를 적용합니다.
- 실제 운영은 브라우저 로컬 DB가 아니라 서버 권한검사, PostgreSQL 트랜잭션, 백업·DR이 있는 구조로 전환합니다.

