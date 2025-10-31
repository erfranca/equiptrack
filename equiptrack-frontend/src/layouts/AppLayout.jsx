import React from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AppLayout() {
  const { user, role, logout } = useAuth()
  const navigate = useNavigate()

  const linkClass = ({ isActive }) => 
    'px-3 py-2 rounded-md text-sm font-medium ' + (isActive ? 'bg-gray-200' : 'hover:bg-gray-100')

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="font-semibold">EquipTrack</div>
          <nav className="flex gap-2">
            <NavLink to="/" className={linkClass}>Dashboard</NavLink>
            <NavLink to="/equipamentos/novo" className={linkClass}>Registrar</NavLink>
            <NavLink to="/equipamentos/busca" className={linkClass}>Busca</NavLink>
            <NavLink to="/clientes" className={linkClass}>Clientes</NavLink>
            <NavLink to="/listas" className={linkClass}>Listas</NavLink>
          </nav>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              {user?.name} <span className="text-gray-400">({role})</span>
            </div>
            <button onClick={() => { logout(); navigate('/login'); }} className="text-sm text-red-600 hover:underline">
              Sair
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
