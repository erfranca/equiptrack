import React, { useEffect, useState } from 'react'
import { api } from '../api'
import Button from '../components/Button'

export default function ClientsPage() {
  const [clients, setClients] = useState([])
  const [form, setForm] = useState({ name: '', document: '', contact: '', phone: '', address: '' })
  const [error, setError] = useState('')

  const load = async () => {
    try {
      const data = await api.listClients()
      setClients(data)
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => { load() }, [])

  const create = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.createClient(form)
      setForm({ name: '', document: '', contact: '', phone: '', address: '' })
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white border rounded-xl p-4">
        <h2 className="font-semibold mb-3">Novo Cliente</h2>
        {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
        <form onSubmit={create} className="space-y-2">
          <input placeholder="Nome *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border rounded-md px-3 py-2" />
          <input placeholder="Documento" value={form.document} onChange={e => setForm({ ...form, document: e.target.value })} className="w-full border rounded-md px-3 py-2" />
          <input placeholder="Contato" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} className="w-full border rounded-md px-3 py-2" />
          <input placeholder="Telefone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full border rounded-md px-3 py-2" />
          <input placeholder="Endereço" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full border rounded-md px-3 py-2" />
          <Button type="submit">Salvar</Button>
        </form>
      </div>
      <div className="bg-white border rounded-xl p-4">
        <h2 className="font-semibold mb-3">Clientes</h2>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Nome</th>
                <th>Contato</th>
                <th>Telefone</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(c => (
                <tr key={c.id} className="border-b">
                  <td className="py-2">{c.name}</td>
                  <td>{c.contact}</td>
                  <td>{c.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
