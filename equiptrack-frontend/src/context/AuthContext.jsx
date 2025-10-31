import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(() => localStorage.getItem('role') || 'admin') // admin | tecnico
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { setLoading(false); return }
    api.me().then(({ user }) => {
      setUser(user)
    }).catch(() => {
      localStorage.removeItem('token')
    }).finally(() => setLoading(false))
  }, [])

  const login = async (email, password, pickedRole) => {
    const data = await api.login(email, password)
    localStorage.setItem('token', data.token)
    setUser(data.user)
    if (pickedRole) {
      setRole(pickedRole)
      localStorage.setItem('role', pickedRole)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, role, setRole, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
