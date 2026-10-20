# SEONGSU ONE — 성수 신사옥 IoT 통합 운영 프로토타입

회의실, 업무차량, 리프레시룸, 방문객, 토큰, IoT 장비와 외부 시스템 연동을 하나의 관리 경험으로 묶은 Vue 3 프로토타입입니다.

## 실행

```bash
npm install
npm run dev
```

프로덕션 빌드는 `npm run build`, 결과 미리보기는 `npm run preview`로 실행합니다.

## 구현 범위

- 통합 현황: 오늘 일정, 가용 공간, 토큰, 장비 상태, 운영 알림
- 통합 예약: 시설 필터·검색, 시간 중복 검사, 예약·취소
- 토큰 관리: 부서 지갑, 차감·환불·추가 배분, 거래 원장
- 방문객: 사전등록, 임시 QR, 입실·퇴실 상태
- IoT 운영: 장비 온라인 상태, 자동화 규칙, 장애 복구 시뮬레이션
- 분석: 활용도 추세, 시설별 사용률, 히트맵, 규칙 기반 제안
- 연동 관리: 그룹웨어, HR, 출입, 주차, F&B, BMS 연결 상태

## 기술 구성

- Vue 3 Composition API + TypeScript
- Pinia 상태·업무 로직
- Vue Router
- Tailwind CSS 4.3.3 + `@tailwindcss/vite`
- Dexie 4 / IndexedDB 로컬 영속 저장
- Lucide 아이콘

브라우저별 IndexedDB에 샘플 데이터가 최초 1회 저장됩니다. 초기 상태로 되돌리려면 개발자 도구에서 `seongsu-one-v1` IndexedDB를 삭제하고 새로고침합니다.

## 중요 제한

이 버전은 로컬 퍼스트 UX/업무흐름 검증용입니다. 실제 인증, 다중 사용자 동시성, 서버 권한검사, 실 QR 암호화, 외부 시스템 호출, 결제, 개인정보 보호 및 감사로그는 운영 백엔드와 PostgreSQL 전환 단계에서 구현해야 합니다. 화면에 표시된 연동 상태와 AI 제안은 시뮬레이션 데이터입니다.

상세 기술 가정은 [docs/research-and-assumptions.md](./docs/research-and-assumptions.md), PostgreSQL 전환안은 [docs/architecture.md](./docs/architecture.md)를 참고하십시오.

