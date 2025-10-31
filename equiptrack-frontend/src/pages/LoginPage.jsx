import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'

export default function LoginPage() {
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('admin123')
  const [role, setRole] = useState('admin')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password, role)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Falha no login')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={submit} className="bg-white border rounded-xl p-6 w-full max-w-sm space-y-4 shadow-sm">
        <h1 className="text-xl font-semibold">Entrar</h1>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <div>
          <label className="block text-sm mb-1">E-mail</label>
          <input value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">Senha</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">Perfil</label>
          <select value={role} onChange={e => setRole(e.target.value)} className="w-full border rounded-md px-3 py-2">
            <option value="admin">Administrador</option>
            <option value="tecnico">Técnico</option>
          </select>
        </div>
        <Button type="submit" className="w-full">Entrar</Button>
      </form>
    </div>
  )
}
