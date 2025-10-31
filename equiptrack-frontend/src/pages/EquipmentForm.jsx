import React, { useEffect, useMemo, useState } from 'react'
import { api } from '../api'
import Button from '../components/Button'

export default function EquipmentForm() {
  const [clients, setClients] = useState([])
  const [accessories, setAccessories] = useState([])
  const [defects, setDefects] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [flow, setFlow] = useState('entrada') // entrada | saida
  const [category, setCategory] = useState('manutencao') // instalacao | manutencao
  const [clientId, setClientId] = useState('')
  const [kind, setKind] = useState('')
  const [serial, setSerial] = useState('')
  const [selectedAccessories, setSelectedAccessories] = useState([])
  const [selectedDefects, setSelectedDefects] = useState([])
  const [accNote, setAccNote] = useState('')
  const [defNote, setDefNote] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const [c, a, d] = await Promise.all([api.listClients(), api.listAccessories(), api.listDefects()])
        setClients(c); setAccessories(a); setDefects(d)
      } catch (e) {
        setError(e.message)
      }
    })()
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(''); setSuccess('')
    try {
      const payload = {
        client_id: Number(clientId),
        kind, serial,
        flow, category,
        accessories: selectedAccessories.map(Number),
        defects: selectedDefects.map(Number),
        accessories_note: accNote || null,
        defects_note: defNote || null
      }
      await api.createEquipment(payload)
      setSuccess('Registro salvo com sucesso!')
      setKind(''); setSerial(''); setSelectedAccessories([]); setSelectedDefects([]); setAccNote(''); setDefNote('')
    } catch (e) {
      setError(e.message)
    }
  }

  const showAccessories = flow === 'saida'
  const showDefects = flow === 'entrada'

  const toggle = (list, setList, id) => {
    setList(list.includes(id) ? list.filter(x => x !== id) : [...list, id])
  }

  return (
    <form onSubmit={onSubmit} className="bg-white border rounded-xl p-4 space-y-4 max-w-3xl">
      <h2 className="font-semibold text-lg">Registrar Entrada/Saída</h2>
      {error && <div className="text-sm text-red-600">{error}</div>}
      {success && <div className="text-sm text-green-600">{success}</div>}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Fluxo</label>
          <select value={flow} onChange={e => setFlow(e.target.value)} className="w-full border rounded-md px-3 py-2">
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Categoria</label>
          <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border rounded-md px-3 py-2">
            <option value="instalacao">Instalação</option>
            <option value="manutencao">Manutenção</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Cliente</label>
          <select value={clientId} onChange={e => setClientId(e.target.value)} className="w-full border rounded-md px-3 py-2">
            <option value="">Selecione...</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Tipo de Equipamento</label>
          <input value={kind} onChange={e => setKind(e.target.value)} className="w-full border rounded-md px-3 py-2" placeholder="Ex.: Notebook, Roteador..." />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Número de Série *</label>
          <input value={serial} onChange={e => setSerial(e.target.value)} className="w-full border rounded-md px-3 py-2" required />
        </div>
      </div>

      {showAccessories && (
        <div>
          <div className="font-medium mb-2">Acessórios levados</div>
          <div className="grid md:grid-cols-2 gap-2">
            {accessories.map(a => (
              <label key={a.id} className="flex items-center gap-2">
                <input type="checkbox" checked={selectedAccessories.includes(String(a.id))}
                  onChange={() => toggle(selectedAccessories, setSelectedAccessories, String(a.id))} />
                <span>{a.description}</span>
              </label>
            ))}
          </div>
          <textarea placeholder="Observações de acessórios" value={accNote} onChange={e => setAccNote(e.target.value)} className="w-full border rounded-md px-3 py-2 mt-2" />
        </div>
      )}

      {showDefects && (
        <div>
          <div className="font-medium mb-2">Defeitos identificados</div>
          <div className="grid md:grid-cols-2 gap-2">
            {defects.map(d => (
              <label key={d.id} className="flex items-center gap-2">
                <input type="checkbox" checked={selectedDefects.includes(String(d.id))}
                  onChange={() => toggle(selectedDefects, setSelectedDefects, String(d.id))} />
                <span>{d.description}</span>
              </label>
            ))}
          </div>
          <textarea placeholder="Observações de defeitos" value={defNote} onChange={e => setDefNote(e.target.value)} className="w-full border rounded-md px-3 py-2 mt-2" />
        </div>
      )}

      <Button type="submit">Salvar</Button>
    </form>
  )
}
