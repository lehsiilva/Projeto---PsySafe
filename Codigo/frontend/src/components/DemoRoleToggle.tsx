import React from 'react'
import { useAuth } from '../contexts/AuthContext'

interface DemoRoleToggleProps {
  className?: string
}

export default function DemoRoleToggle({ className = '' }: DemoRoleToggleProps) {
  const { user, switchRole } = useAuth()

  const handleRoleSwitch = () => {
    const newRole = user?.role === 'gestor' ? 'funcionario' : 'gestor'
    switchRole(newRole)
  }

  // Mostrar apenas no modo demo
  const isDemoMode = import.meta.env?.VITE_DEMO_MODE === 'true'

  if (!isDemoMode) {
    return null
  }

  // Sempre mostrar no modo demo, mesmo se o usuário não tiver função definida
  const currentRole = user?.role || 'não definido'

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-blue-800 mb-1">
            🎭 Demo Mode
          </h3>
          <p className="text-xs text-blue-600">
            Papel atual: <span className="font-medium">{currentRole === 'gestor' ? 'Gestor' : currentRole === 'funcionario' ? 'Funcionário' : 'Não definido'}</span>
          </p>
        </div>
        <button
          onClick={handleRoleSwitch}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2 rounded-md transition-colors duration-200 font-medium"
        >
          🔄 Trocar para {currentRole === 'gestor' ? 'Funcionário' : 'Gestor'}
        </button>
      </div>
    </div>
  )
}
