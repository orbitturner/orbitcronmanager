import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { OrganizationGuard } from '@/components/OrganizationGuard'
import { DashboardPage } from '@/features/tasks/pages/DashboardPage'
import { TasksPage } from '@/features/tasks/pages/TasksPage'
import { HistoryPage } from '@/features/tasks/pages/HistoryPage'
import { TeamPage } from '@/features/team/pages/TeamPage'
import { AuthPage } from '@/features/auth/pages/AuthPage'
import { useAuth } from '@/hooks/useAuth'

function App() {
  const { session, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    )
  }

  return (
    <Routes>
      <Route
        path="/auth/*"
        element={
          !session ? (
            <AuthPage />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      <Route
        path="/*"
        element={
          session ? (
            <Layout>
              <OrganizationGuard>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/tasks" element={<TasksPage />} />
                  <Route path="/history" element={<HistoryPage />} />
                  <Route path="/team" element={<TeamPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </OrganizationGuard>
            </Layout>
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />
    </Routes>
  )
}

export default App