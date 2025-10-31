import React, { useEffect, useState } from 'react'
import { api } from '../api'

export default function EquipmentSearch() {
  const [clients, setClients] = useState([])
  const [rows, setRows] = useState([])
  const [q, setQ] = useState({ flow: '', client_id: '', kind: '', serial: '', from: '', to: '' })
  const [error, setError] = useState('')

  useEffect(() => { api.listClients().then(setClients) }, [])

  const buildQuery = () => {
    const parts = []
    Object.entries(q).forEach(([k, v]) => { if (v) parts.push(`${k}=${encodeURIComponent(v)}`) })
    return parts.length ? `?${parts.join('&')}` : ''
  }

  const search = async (e) => {
    e?.preventDefault()
    setError('')
    try {
      const data = await api.searchEquipments(buildQuery())
      setRows(data)
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={search} className="bg-white border rounded-xl p-4 grid md:grid-cols-6 gap-3">
        <select value={q.flow} onChange={e => setQ({...q, flow: e.target.value})} className="border rounded-md px-3 py-2">
          <option value="">Fluxo</option>
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>
        <select value={q.client_id} onChange={e => setQ({...q, client_id: e.target.value})} className="border rounded-md px-3 py-2">
          <option value="">Cliente</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input placeholder="Tipo" value={q.kind} onChange={e => setQ({...q, kind: e.target.value})} className="border rounded-md px-3 py-2" />
        <input placeholder="Série" value={q.serial} onChange={e => setQ({...q, serial: e.target.value})} className="border rounded-md px-3 py-2" />
        <input type="date" value={q.from} onChange={e => setQ({...q, from: e.target.value})} className="border rounded-md px-3 py-2" />
        <input type="date" value={q.to} onChange={e => setQ({...q, to: e.target.value})} className="border rounded-md px-3 py-2" />
        <button className="md:col-span-6 px-4 py-2 rounded-md bg-gray-900 text-white">Buscar</button>
      </form>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="bg-white border rounded-xl p-4 overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">#</th>
              <th>Data</th>
              <th>Cliente</th>
              <th>Fluxo</th>
              <th>Categoria</th>
              <th>Tipo</th>
              <th>Série</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-b">
                <td className="py-2">{r.id}</td>
                <td>{new Date(r.created_at).toLocaleString()}</td>
                <td>{r.client_name}</td>
                <td>{r.flow}</td>
                <td>{r.category}</td>
                <td>{r.kind}</td>
                <td>{r.serial}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
