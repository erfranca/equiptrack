import React from 'react'
import { Link } from 'react-router-dom'

const Card = ({ to, title, desc }) => (
  <Link to={to} className="block border rounded-xl p-5 hover:bg-gray-50">
    <div className="font-semibold">{title}</div>
    <div className="text-sm text-gray-600">{desc}</div>
  </Link>
)

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card to="/equipamentos/novo" title="Registrar Entrada/Saída" desc="Adicionar um novo movimento de equipamento." />
      <Card to="/equipamentos/busca" title="Buscar Equipamentos" desc="Filtrar por cliente, data, tipo, série e fluxo." />
      <Card to="/clientes" title="Clientes" desc="Cadastrar e gerenciar clientes." />
      <Card to="/listas" title="Listas (Acessórios & Defeitos)" desc="Consultar listas disponíveis." />
    </div>
  )
}
