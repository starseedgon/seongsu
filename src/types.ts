export type ResourceType = 'meeting' | 'vehicle' | 'refresh' | 'parking' | 'food'
export type BookingStatus = 'confirmed' | 'checked-in' | 'completed' | 'cancelled'

export interface Resource {
  id: string
  name: string
  type: ResourceType
  floor: string
  capacity: number
  tokenCost: number
  status: 'available' | 'occupied' | 'maintenance'
  features: string[]
  image: string
}

export interface Booking {
  id: string
  resourceId: string
  title: string
  userName: string
  department: string
  date: string
  startTime: string
  endTime: string
  attendees: number
  tokenCost: number
  status: BookingStatus
  createdAt: string
}

export interface Department {
  id: string
  name: string
  balance: number
  monthlyAllocation: number
  used: number
  color: string
}

export interface TokenTransaction {
  id: string
  departmentId: string
  amount: number
  type: 'allocation' | 'usage' | 'refund' | 'adjustment'
  description: string
  createdAt: string
}

export interface Visitor {
  id: string
  name: string
  company: string
  host: string
  phone: string
  visitDate: string
  visitTime: string
  purpose: string
  qrCode: string
  status: 'invited' | 'arrived' | 'departed' | 'expired'
}

export interface Integration {
  id: string
  name: string
  category: string
  method: string
  status: 'connected' | 'testing' | 'disconnected'
  lastSync: string
  description: string
}

export interface Device {
  id: string
  name: string
  resourceId: string
  type: string
  online: boolean
  value: string
  updatedAt: string
}

export interface Notice {
  id: string
  level: 'info' | 'warning' | 'success'
  title: string
  message: string
  createdAt: string
  read: boolean
}

