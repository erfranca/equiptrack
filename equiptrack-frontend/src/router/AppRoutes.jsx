import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import Dashboard from '../pages/Dashboard'
import EquipmentForm from '../pages/EquipmentForm'
import EquipmentSearch from '../pages/EquipmentSearch'
import ClientsPage from '../pages/ClientsPage'
import AccessDefectsPage from '../pages/AccessDefectsPage'
import AppLayout from '../layouts/AppLayout'
import { useAuth } from '../context/AuthContext'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="p-6">Carregando...</div>
  return user ? children : <Navigate to="/login" />
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<PrivateRoute><AppLayout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="equipamentos/novo" element={<EquipmentForm />} />
        <Route path="equipamentos/busca" element={<EquipmentSearch />} />
        <Route path="clientes" element={<ClientsPage />} />
        <Route path="listas" element={<AccessDefectsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
