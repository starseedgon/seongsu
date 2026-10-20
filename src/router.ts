import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from './views/DashboardView.vue'
import BookingView from './views/BookingView.vue'
import TokenView from './views/TokenView.vue'
import VisitorsView from './views/VisitorsView.vue'
import OperationsView from './views/OperationsView.vue'
import AnalyticsView from './views/AnalyticsView.vue'
import IntegrationsView from './views/IntegrationsView.vue'
import SettingsView from './views/SettingsView.vue'
import HelpView from './views/HelpView.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'dashboard', component: DashboardView, meta: { title: '통합 현황', eyebrow: 'SEONGSU CAMPUS' } },
    { path: '/booking', name: 'booking', component: BookingView, meta: { title: '통합 예약', eyebrow: 'SPACE & SERVICE' } },
    { path: '/tokens', name: 'tokens', component: TokenView, meta: { title: '토큰 관리', eyebrow: 'RESOURCE WALLET' } },
    { path: '/visitors', name: 'visitors', component: VisitorsView, meta: { title: '방문객 관리', eyebrow: 'WELCOME LOUNGE · 2.5F' } },
    { path: '/operations', name: 'operations', component: OperationsView, meta: { title: 'IoT 운영', eyebrow: 'LIVE FACILITY' } },
    { path: '/analytics', name: 'analytics', component: AnalyticsView, meta: { title: '데이터 분석', eyebrow: 'SPACE INTELLIGENCE' } },
    { path: '/integrations', name: 'integrations', component: IntegrationsView, meta: { title: '연동 관리', eyebrow: 'CONNECTED ECOSYSTEM' } },
    { path: '/settings', name: 'settings', component: SettingsView, meta: { title: '환경 설정', eyebrow: 'WORKPLACE PREFERENCES' } },
    { path: '/help', name: 'help', component: HelpView, meta: { title: '도움말', eyebrow: 'GUIDE & SUPPORT' } },
  ],
})

