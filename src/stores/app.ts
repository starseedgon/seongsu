import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { db, seedDatabase } from '../lib/db'
import type { Booking, Department, Device, Integration, Notice, Resource, TokenTransaction, Visitor } from '../types'

export const useAppStore = defineStore('app', () => {
  const resources = ref<Resource[]>([])
  const bookings = ref<Booking[]>([])
  const departments = ref<Department[]>([])
  const transactions = ref<TokenTransaction[]>([])
  const visitors = ref<Visitor[]>([])
  const integrations = ref<Integration[]>([])
  const devices = ref<Device[]>([])
  const notices = ref<Notice[]>([])
  const loading = ref(true)
  const toast = ref('')
  const currentUser = { name: '권용주', department: 'Product Lab', role: '워크플레이스 운영 관리자' }

  const today = computed(() => new Date().toISOString().slice(0, 10))
  const todayBookings = computed(() => bookings.value.filter((item) => item.date === today.value && item.status !== 'cancelled'))
  const unreadNotices = computed(() => notices.value.filter((item) => !item.read).length)
  const onlineRate = computed(() => Math.round((devices.value.filter((item) => item.online).length / Math.max(devices.value.length, 1)) * 100))

  function notify(message: string) {
    toast.value = message
    window.setTimeout(() => { if (toast.value === message) toast.value = '' }, 2800)
  }

  async function load() {
    loading.value = true
    await seedDatabase()
    ;[resources.value, bookings.value, departments.value, transactions.value, visitors.value, integrations.value, devices.value, notices.value] = await Promise.all([
      db.resources.toArray(), db.bookings.toArray(), db.departments.toArray(), db.tokenTransactions.toArray(),
      db.visitors.toArray(), db.integrations.toArray(), db.devices.toArray(), db.notices.toArray(),
    ])
    loading.value = false
  }

  async function createBooking(input: Omit<Booking, 'id' | 'createdAt' | 'status'>) {
    const department = departments.value.find((item) => item.name === input.department)
    if (!department || department.balance < input.tokenCost) throw new Error('부서 토큰이 부족합니다.')
    const conflict = bookings.value.some((item) => item.resourceId === input.resourceId && item.date === input.date && item.status !== 'cancelled' && input.startTime < item.endTime && input.endTime > item.startTime)
    if (conflict) throw new Error('선택한 시간에 이미 예약이 있습니다.')
    const booking: Booking = { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString(), status: 'confirmed' }
    const transaction: TokenTransaction = { id: crypto.randomUUID(), departmentId: department.id, amount: -input.tokenCost, type: 'usage', description: `${input.title} 예약`, createdAt: new Date().toISOString() }
    const updated = { ...department, balance: department.balance - input.tokenCost, used: department.used + input.tokenCost }
    await db.transaction('rw', db.bookings, db.departments, db.tokenTransactions, async () => {
      await db.bookings.add(booking)
      await db.departments.put(updated)
      await db.tokenTransactions.add(transaction)
    })
    bookings.value.push(booking)
    departments.value = departments.value.map((item) => item.id === updated.id ? updated : item)
    transactions.value.unshift(transaction)
    notify('예약이 확정되고 토큰이 차감되었습니다.')
  }

  async function cancelBooking(id: string) {
    const booking = bookings.value.find((item) => item.id === id)
    if (!booking || booking.status === 'cancelled') return
    const department = departments.value.find((item) => item.name === booking.department)
    const updatedBooking = { ...booking, status: 'cancelled' as const }
    await db.bookings.put(updatedBooking)
    if (department) {
      const updatedDepartment = { ...department, balance: department.balance + booking.tokenCost, used: Math.max(0, department.used - booking.tokenCost) }
      const transaction: TokenTransaction = { id: crypto.randomUUID(), departmentId: department.id, amount: booking.tokenCost, type: 'refund', description: `${booking.title} 취소 환불`, createdAt: new Date().toISOString() }
      await db.transaction('rw', db.departments, db.tokenTransactions, async () => {
        await db.departments.put(updatedDepartment)
        await db.tokenTransactions.add(transaction)
      })
      departments.value = departments.value.map((item) => item.id === department.id ? updatedDepartment : item)
      transactions.value.unshift(transaction)
    }
    bookings.value = bookings.value.map((item) => item.id === id ? updatedBooking : item)
    notify('예약을 취소하고 토큰을 환불했습니다.')
  }

  async function allocateTokens(departmentId: string, amount: number) {
    const department = departments.value.find((item) => item.id === departmentId)
    if (!department || amount <= 0) return
    const updated = { ...department, balance: department.balance + amount }
    const transaction: TokenTransaction = { id: crypto.randomUUID(), departmentId, amount, type: 'allocation', description: '관리자 추가 배분', createdAt: new Date().toISOString() }
    await db.transaction('rw', db.departments, db.tokenTransactions, async () => {
      await db.departments.put(updated)
      await db.tokenTransactions.add(transaction)
    })
    departments.value = departments.value.map((item) => item.id === departmentId ? updated : item)
    transactions.value.unshift(transaction)
    notify(`${department.name}에 ${amount.toLocaleString()} 토큰을 배분했습니다.`)
  }

  async function createVisitor(input: Omit<Visitor, 'id' | 'qrCode' | 'status'>) {
    const visitor: Visitor = { ...input, id: crypto.randomUUID(), qrCode: `SSO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`, status: 'invited' }
    await db.visitors.add(visitor)
    visitors.value.unshift(visitor)
    notify('방문객 초대와 임시 QR이 발급되었습니다.')
  }

  async function updateVisitorStatus(id: string, status: Visitor['status']) {
    const visitor = visitors.value.find((item) => item.id === id)
    if (!visitor) return
    const updated = { ...visitor, status }
    await db.visitors.put(updated)
    visitors.value = visitors.value.map((item) => item.id === id ? updated : item)
    notify(status === 'arrived' ? '방문객 입실을 확인했습니다.' : '방문객 퇴실을 처리했습니다.')
  }

  async function markNoticesRead() {
    const updated = notices.value.map((item) => ({ ...item, read: true }))
    await db.notices.bulkPut(updated)
    notices.value = updated
  }

  async function toggleDevice(id: string) {
    const device = devices.value.find((item) => item.id === id)
    if (!device) return
    const updated = { ...device, online: !device.online, updatedAt: '방금 전', value: !device.online ? '정상' : '점검 모드' }
    await db.devices.put(updated)
    devices.value = devices.value.map((item) => item.id === id ? updated : item)
    notify(`${device.name} 상태가 변경되었습니다.`)
  }

  return { resources, bookings, departments, transactions, visitors, integrations, devices, notices, loading, toast, currentUser, today, todayBookings, unreadNotices, onlineRate, notify, load, createBooking, cancelBooking, allocateTokens, createVisitor, updateVisitorStatus, markNoticesRead, toggleDevice }
})

