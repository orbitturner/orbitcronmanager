import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { SignIn } from '../components/SignIn'
import { SignUp } from '../components/SignUp'

export function AuthPage() {
  return (
    <AuthLayout>
      <Routes>
        <Route path="sign-in" element={<SignIn />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="*" element={<Navigate to="sign-in" replace />} />
      </Routes>
    </AuthLayout>
  )
}