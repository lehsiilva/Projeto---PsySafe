import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import DashboardLayout from '../../components/DashboardLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { userService, UserProfile } from '../../services/userService'
import { empresaService, EmpresaData } from '../../services/empresaService'

export default function Perfil() {
  const { user, switchRole } = useAuth()
  const [isDemoMode] = useState((import.meta as any).env?.VITE_DEMO_MODE === 'true')
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [empresa, setEmpresa] = useState<EmpresaData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProfileData()
  }, [])

  const loadProfileData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const profileData = await userService.getCurrentUser()

      if (!profileData) {
        setError('Perfil não encontrado')
        return
      }

      // Garantir que todos os campos existam, mesmo que backend não envie
      const normalizedProfile: UserProfile = {
        id: profileData.id || '',
        name: profileData.name || '',
        email: profileData.email || '',
        role: profileData.role || 'user',
        cargo: profileData.cargo || '',
        departamento: profileData.departamento || '',
        telefone: profileData.telefone || '',
        idEmpresa: profileData.idEmpresa || '',
        dataAdmissao: profileData.dataAdmissao || '',
        ultimoLogin: profileData.ultimoLogin || '',
      }

      setProfile(normalizedProfile)

      if (normalizedProfile.idEmpresa) {
        const empresaData = await empresaService.getMyEmpresa()
        setEmpresa(empresaData)
      }
    } catch (err: any) {
      console.error('Erro ao carregar perfil:', err)
      setError(err.response?.data?.message || 'Erro ao carregar dados do perfil')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleSwitch = () => {
    const newRole = user?.role === 'gestor' ? 'funcionario' : 'gestor'
    switchRole(newRole)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-600">Carregando perfil...</div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <Card className="p-6 bg-red-50 border-red-200">
            <p className="text-red-800">{error}</p>
            <Button onClick={loadProfileData} className="mt-4">
              Tentar novamente
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <Card className="p-6">
            <p className="text-gray-600">Perfil não encontrado</p>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-psy mb-2">
            Perfil do Usuário
          </h1>
          <p className="text-gray-600">
            Gerencie suas informações pessoais e configurações da conta
          </p>
        </div>

        {/* Role Switcher - Only show in demo mode */}
        {isDemoMode && (
          <div className="mb-6">
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-blue-800 mb-1">
                    🎭 Demo Mode - Trocar Papel
                  </h3>
                  <p className="text-xs text-blue-600">
                    Papel atual: <span className="font-medium">{user?.role === 'gestor' ? 'Gestor' : 'Funcionário'}</span>
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleRoleSwitch}
                >
                  🔄 Trocar para {user?.role === 'gestor' ? 'Funcionário' : 'Gestor'}
                </Button>
              </div>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture and Basic Info */}
          <div className="lg:col-span-1">
            <Card className="text-center p-6">
              <div className="mb-6">
                <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-safe/20 flex items-center justify-center text-4xl font-bold text-safe">
                  {profile.name?.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {profile.name}
                </h3>
                <p className="text-gray-600">{profile.cargo || 'Cargo não informado'}</p>
              </div>

              <div className="space-y-3 text-left">
                {empresa && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Empresa:</span>
                      <span className="font-medium text-gray-800">{empresa.nome}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Departamento:</span>
                      <span className="font-medium text-gray-800">{profile.departamento || 'N/A'}</span>
                    </div>
                  </>
                )}
                {profile.dataAdmissao && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Admissão:</span>
                    <span className="font-medium text-gray-800">
                      {new Date(profile.dataAdmissao).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Informações Pessoais
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-psy mb-2">
                    Nome Completo
                  </label>
                  <p className="text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">
                    {profile.name}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-psy mb-2">
                    Email
                  </label>
                  <p className="text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">
                    {profile.email}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-psy mb-2">
                    Cargo
                  </label>
                  <p className="text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">
                    {profile.cargo || 'Não informado'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-psy mb-2">
                    Telefone
                  </label>
                  <p className="text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">
                    {profile.telefone || 'Não informado'}
                  </p>
                </div>
              </div>

              {/* Last Login Info */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Último acesso:</span>
                  <span className="text-sm font-medium text-gray-800">
                    {profile.ultimoLogin 
                      ? new Date(profile.ultimoLogin).toLocaleString('pt-BR')
                      : 'Primeiro acesso'}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
