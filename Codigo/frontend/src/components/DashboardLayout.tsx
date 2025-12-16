import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface DashboardLayoutProps {
  children: React.ReactNode
  showSidebar?: boolean
}

interface SidebarItem {
  id: string
  label: string
  icon: string
  path: string
}

const sidebarItems: SidebarItem[] = [
  { id: 'perfil', label: 'Perfil', icon: '👤', path: '/dashboard/perfil' },
  { id: 'empresa', label: 'Empresa', icon: '🏢', path: '/dashboard/empresa' },
  { id: 'questionarios', label: 'Questionários', icon: '📋', path: '/dashboard/questionarios' },
  { id: 'estatisticas', label: 'Estatísticas', icon: '📊', path: '/dashboard/estatisticas' }
]

export default function DashboardLayout({ children, showSidebar = true }: DashboardLayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const [activeItem, setActiveItem] = useState(() => {
    if (!showSidebar) return null
    const currentPath = location.pathname
    const item = sidebarItems.find(item => currentPath.includes(item.path.split('/').pop() || ''))
    return item?.id || 'perfil'
  })

  const handleSidebarClick = (item: SidebarItem) => {
    setActiveItem(item.id)
    navigate(item.path)
  }

  const handleHomeClick = () => {
    navigate('/')
  }

  if (!showSidebar) {
    return (
      <div className="page-root min-h-screen">
        <main className="min-h-screen p-8">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    )
  }

  return (
    <div className="page-root min-h-screen relative">
      <aside className="fixed left-0 top-0 h-full w-64 bg-white/95 backdrop-blur-md shadow-lg border-r border-white/20 flex flex-col z-50 overflow-hidden">
        <div className="p-6">
          <button
            onClick={handleHomeClick}
            className="text-2xl font-black hover:opacity-80 transition-opacity duration-200 w-full text-left"
          >
            <span className="text-safe">Psy</span><span className="text-psy">Safe</span>
          </button>
          <p className="text-xs text-gray-500 mt-1">Dashboard</p>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleSidebarClick(item)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    activeItem === item.id
                      ? 'bg-safe/10 text-safe border border-safe/20'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-safe'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-safe to-accent rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{user?.name || 'Usuário'}</p>
              <p className="text-xs text-gray-500 truncate">
                {user?.role?.toLowerCase() === 'gestor'
                  ? 'Gestor'
                  : user?.role?.toLowerCase() === 'funcionario'
                  ? 'Funcionário'
                  : 'Não definido'}
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className="ml-64 flex flex-col min-h-screen">
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  )
}
