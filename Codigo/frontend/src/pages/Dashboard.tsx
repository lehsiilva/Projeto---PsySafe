import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import DashboardLayout from '../components/DashboardLayout'
import GestorDashboard from './dashboard/GestorDashboard'
import FuncionarioDashboard from './dashboard/FuncionarioDashboard'

export default function Dashboard() {
  const { user } = useAuth()

  // Roteamento baseado em função
  if (user?.role === 'gestor') {
    return <GestorDashboard />
  } else if (user?.role === 'funcionario') {
    return <FuncionarioDashboard />
  }

  // Fallback padrão - mostrar seleção de função ou dashboard genérico
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho de boas-vindas */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-psy mb-2">
            Bem-vindo ao Dashboard!
          </h1>
          <p className="text-gray-600">
            Olá, <span className="font-medium text-safe">{user?.name}</span>!
          </p>

        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">
            ⚠️ Papel não definido
          </h2>
          <p className="text-yellow-700">
            Seu perfil não possui um papel definido (gestor ou funcionário).
            Entre em contato com o administrador para definir seu papel no sistema.
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
