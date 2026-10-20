import Dexie, { type EntityTable } from 'dexie'
import type { Booking, Department, Device, Integration, Notice, Resource, TokenTransaction, Visitor } from '../types'

class SeongsuDatabase extends Dexie {
  resources!: EntityTable<Resource, 'id'>
  bookings!: EntityTable<Booking, 'id'>
  departments!: EntityTable<Department, 'id'>
  tokenTransactions!: EntityTable<TokenTransaction, 'id'>
  visitors!: EntityTable<Visitor, 'id'>
  integrations!: EntityTable<Integration, 'id'>
  devices!: EntityTable<Device, 'id'>
  notices!: EntityTable<Notice, 'id'>

  constructor() {
    super('seongsu-one-v1')
    this.version(1).stores({
      resources: 'id, type, floor, status',
      bookings: 'id, resourceId, date, status, department, createdAt',
      departments: 'id, name',
      tokenTransactions: 'id, departmentId, type, createdAt',
      visitors: 'id, visitDate, status, host',
      integrations: 'id, status, category',
      devices: 'id, resourceId, online, type',
      notices: 'id, level, read, createdAt',
    })
  }
}

export const db = new SeongsuDatabase()

const date = (offset: number) => {
  const value = new Date()
  value.setDate(value.getDate() + offset)
  return value.toISOString().slice(0, 10)
}

export async function seedDatabase() {
  if (await db.resources.count()) return

  const resources: Resource[] = [
    { id: 'mr-01', name: '서울숲', type: 'meeting', floor: '8F', capacity: 12, tokenCost: 8, status: 'occupied', features: ['Teams Room', '4K 디스플레이', '전자칠판'], image: 'linear-gradient(135deg,#1e493b,#87a88f)' },
    { id: 'mr-02', name: '뚝섬', type: 'meeting', floor: '7F', capacity: 6, tokenCost: 4, status: 'available', features: ['Zoom Room', '화상회의', '화이트보드'], image: 'linear-gradient(135deg,#6f7654,#d8c9a2)' },
    { id: 'mr-03', name: '한강', type: 'meeting', floor: '9F', capacity: 20, tokenCost: 12, status: 'available', features: ['Teams Room', '듀얼 스크린', '마이크'], image: 'linear-gradient(135deg,#294d61,#94b8c6)' },
    { id: 'car-01', name: '아이오닉 6 · 01', type: 'vehicle', floor: 'B2', capacity: 5, tokenCost: 10, status: 'available', features: ['전기차', '하이패스', '스마트키'], image: 'linear-gradient(135deg,#363b3f,#9ca5aa)' },
    { id: 'car-02', name: '카니발 · 02', type: 'vehicle', floor: 'B2', capacity: 9, tokenCost: 15, status: 'occupied', features: ['9인승', '하이패스', '스마트키'], image: 'linear-gradient(135deg,#3e4540,#a9ae9d)' },
    { id: 'rf-01', name: '포레스트 룸', type: 'refresh', floor: '6F', capacity: 1, tokenCost: 3, status: 'available', features: ['안마의자', '조도 제어', '방음'], image: 'linear-gradient(135deg,#355b4a,#b2c6ab)' },
    { id: 'rf-02', name: '리커버리 룸', type: 'refresh', floor: '6F', capacity: 1, tokenCost: 3, status: 'maintenance', features: ['리클라이너', '공기청정', '방음'], image: 'linear-gradient(135deg,#675c55,#cbbdaf)' },
    { id: 'pk-01', name: '방문 주차 A-12', type: 'parking', floor: 'B1', capacity: 1, tokenCost: 2, status: 'available', features: ['방문객', '번호인식'], image: 'linear-gradient(135deg,#374151,#94a3b8)' },
    { id: 'fd-01', name: '성수 키친', type: 'food', floor: '2F', capacity: 80, tokenCost: 6, status: 'available', features: ['도시락', '샐러드', '사전주문'], image: 'linear-gradient(135deg,#885b3d,#dfb477)' },
  ]
  const departments: Department[] = [
    { id: 'dept-1', name: 'Product Lab', balance: 1840, monthlyAllocation: 2500, used: 660, color: '#206c52' },
    { id: 'dept-2', name: 'Brand Studio', balance: 1060, monthlyAllocation: 1800, used: 740, color: '#d28545' },
    { id: 'dept-3', name: 'Business', balance: 1415, monthlyAllocation: 2200, used: 785, color: '#526e9e' },
    { id: 'dept-4', name: 'People & Culture', balance: 820, monthlyAllocation: 1200, used: 380, color: '#8c6a9d' },
  ]
  const bookings: Booking[] = [
    { id: 'bk-1', resourceId: 'mr-01', title: '신사업 전략 위클리', userName: '김민준', department: 'Product Lab', date: date(0), startTime: '10:00', endTime: '11:30', attendees: 8, tokenCost: 8, status: 'checked-in', createdAt: new Date().toISOString() },
    { id: 'bk-2', resourceId: 'mr-02', title: '브랜드 캠페인 리뷰', userName: '이서윤', department: 'Brand Studio', date: date(0), startTime: '13:30', endTime: '14:30', attendees: 5, tokenCost: 4, status: 'confirmed', createdAt: new Date().toISOString() },
    { id: 'bk-3', resourceId: 'car-02', title: '판교 고객사 방문', userName: '박도윤', department: 'Business', date: date(0), startTime: '14:00', endTime: '18:00', attendees: 6, tokenCost: 15, status: 'confirmed', createdAt: new Date().toISOString() },
    { id: 'bk-4', resourceId: 'rf-01', title: '리프레시 예약', userName: '김민준', department: 'Product Lab', date: date(1), startTime: '11:30', endTime: '12:00', attendees: 1, tokenCost: 3, status: 'confirmed', createdAt: new Date().toISOString() },
    { id: 'bk-5', resourceId: 'mr-03', title: '올핸즈 준비', userName: '최하은', department: 'People & Culture', date: date(1), startTime: '15:00', endTime: '17:00', attendees: 16, tokenCost: 12, status: 'confirmed', createdAt: new Date().toISOString() },
  ]
  const visitors: Visitor[] = [
    { id: 'vs-1', name: '정지훈', company: '어반테크', host: '김민준', phone: '010-1234-5678', visitDate: date(0), visitTime: '14:00', purpose: '프로젝트 미팅', qrCode: 'SSO-VS-001', status: 'invited' },
    { id: 'vs-2', name: '오지은', company: '아키랩', host: '이서윤', phone: '010-2222-4401', visitDate: date(0), visitTime: '10:30', purpose: '인테리어 협의', qrCode: 'SSO-VS-002', status: 'arrived' },
    { id: 'vs-3', name: '윤태영', company: '모빌리티웍스', host: '박도윤', phone: '010-9876-1100', visitDate: date(1), visitTime: '16:00', purpose: '차량 운영 협의', qrCode: 'SSO-VS-003', status: 'invited' },
  ]
  const integrations: Integration[] = [
    { id: 'int-1', name: '그룹웨어 · 캘린더', category: '업무', method: 'REST API / Webhook', status: 'connected', lastSync: '방금 전', description: '조직 캘린더와 회의실 일정을 양방향 동기화합니다.' },
    { id: 'int-2', name: 'HR · 조직정보', category: '인사', method: 'SCIM 2.0', status: 'connected', lastSync: '12분 전', description: '임직원·부서·재직 상태를 매일 증분 동기화합니다.' },
    { id: 'int-3', name: '출입통제 · 사원증', category: '보안', method: 'Vendor API / OSDP', status: 'testing', lastSync: '1시간 전', description: '출입 권한과 방문객용 임시 QR 자격증명을 연계합니다.' },
    { id: 'int-4', name: '주차관제', category: '시설', method: 'REST API / LPR', status: 'testing', lastSync: '2시간 전', description: '차량번호, 주차면, 입출차 이벤트를 연계합니다.' },
    { id: 'int-5', name: '카페 · 벤딩 결제', category: 'F&B', method: 'PG/VAN API', status: 'disconnected', lastSync: '연결 필요', description: '사내 토큰과 운영사 결제 승인 결과를 정산합니다.' },
    { id: 'int-6', name: 'BMS · 공간 센서', category: 'IoT', method: 'BACnet / MQTT 5', status: 'connected', lastSync: '8초 전', description: '재실·온습도·공기질과 설비 상태를 실시간 수집합니다.' },
  ]
  const devices: Device[] = [
    { id: 'dv-1', name: '서울숲 재실센서', resourceId: 'mr-01', type: '재실', online: true, value: '8명 감지', updatedAt: '3초 전' },
    { id: 'dv-2', name: '서울숲 도어사이니지', resourceId: 'mr-01', type: '사이니지', online: true, value: '예약중', updatedAt: '10초 전' },
    { id: 'dv-3', name: '뚝섬 CO₂ 센서', resourceId: 'mr-02', type: '공기질', online: true, value: '612 ppm', updatedAt: '5초 전' },
    { id: 'dv-4', name: 'B2 스마트키 보관함', resourceId: 'car-01', type: '키오스크', online: true, value: '2 / 3 보관', updatedAt: '20초 전' },
    { id: 'dv-5', name: '리커버리 도어락', resourceId: 'rf-02', type: '출입', online: false, value: '응답 없음', updatedAt: '18분 전' },
    { id: 'dv-6', name: '2.5F 방문 QR 리더', resourceId: 'pk-01', type: '출입', online: true, value: '정상', updatedAt: '2초 전' },
  ]
  const notices: Notice[] = [
    { id: 'nt-1', level: 'warning', title: '장비 연결 확인 필요', message: '6F 리커버리 룸 도어락이 18분째 응답하지 않습니다.', createdAt: new Date().toISOString(), read: false },
    { id: 'nt-2', level: 'info', title: '예약 자동 취소 예정', message: '뚝섬 회의실 예약이 10분 내 입실 확인되지 않으면 취소됩니다.', createdAt: new Date().toISOString(), read: false },
    { id: 'nt-3', level: 'success', title: '조직 정보 동기화 완료', message: '신규 입사자 3명의 계정과 토큰 지갑이 생성되었습니다.', createdAt: new Date().toISOString(), read: true },
  ]

  await db.transaction('rw', [db.resources, db.departments, db.bookings, db.visitors, db.integrations, db.devices, db.notices], async () => {
    await Promise.all([
      db.resources.bulkAdd(resources), db.departments.bulkAdd(departments), db.bookings.bulkAdd(bookings),
      db.visitors.bulkAdd(visitors), db.integrations.bulkAdd(integrations), db.devices.bulkAdd(devices), db.notices.bulkAdd(notices),
    ])
  })
}

