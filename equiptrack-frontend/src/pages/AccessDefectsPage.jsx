import React, { useEffect, useState } from 'react'
import { api } from '../api'

export default function AccessDefectsPage() {
  const [accessories, setAccessories] = useState([])
  const [defects, setDefects] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([api.listAccessories(), api.listDefects()])
      .then(([a, d]) => { setAccessories(a); setDefects(d); })
      .catch(e => setError(e.message))
  }, [])

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white border rounded-xl p-4">
        <h2 className="font-semibold mb-3">Acessórios</h2>
        {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
        <ul className="list-disc pl-5">
          {accessories.map(a => <li key={a.id}>{a.description}</li>)}
        </ul>
      </div>
      <div className="bg-white border rounded-xl p-4">
        <h2 className="font-semibold mb-3">Defeitos</h2>
        <ul className="list-disc pl-5">
          {defects.map(d => <li key={d.id}>{d.description}</li>)}
        </ul>
      </div>
    </div>
  )
}
