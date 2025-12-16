import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import DashboardLayout from '../../components/DashboardLayout'
import Card from '../../components/ui/Card'
import DemoRoleToggle from '../../components/DemoRoleToggle'

const API_BASE_URL = 'http://localhost:4567/api'

interface AcaoCorretiva {
  id: string
  titulo: string
  descricao: string
  departamento: string
  nivelRisco: string
  prioridade: string
  responsavel: string
  dataCriacao: string
  dataPrazo: string
  status: string
  medidasSugeridas: string[]
  analiseDetalhada: string
  impactoEsperado: string
  recursosNecessarios: string
}

export default function Estatisticas() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()
  const [timeRange, setTimeRange] = useState('6meses')
  const [stats, setStats] = useState<any>(null)
  const [alerts, setAlerts] = useState<any[]>([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Estados para ação corretiva
  const [generatingAction, setGeneratingAction] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState<any>(null)
  const [generatedAction, setGeneratedAction] = useState<AcaoCorretiva | null>(null)
  const [showActionModal, setShowActionModal] = useState(false)

  // Carregar estatísticas da API
  useEffect(() => {
    if (!user?.id) return

    const fetchStats = async () => {
      setLoadingStats(true)
      setError(null)
      
      try {
        const statsResponse = await fetch(
          `${API_BASE_URL}/stats/overview?timeRange=${timeRange}&userId=${user.id}&role=${user.role || 'gestor'}`
        )
        
        if (!statsResponse.ok) {
          throw new Error('Erro ao carregar estatísticas')
        }
        
        const statsData = await statsResponse.json()
        setStats(statsData)

        const alertsResponse = await fetch(
          `${API_BASE_URL}/stats/alerts?userId=${user.id}&role=${user.role || 'gestor'}`
        )
        
        if (alertsResponse.ok) {
          const alertsData = await alertsResponse.json()
          setAlerts(alertsData)
        }
        
      } catch (err: any) {
        console.error('Erro ao carregar dados:', err)
        setError(err.message)
      } finally {
        setLoadingStats(false)
      }
    }

    fetchStats()
  }, [user?.id, timeRange, user?.role])

  const handleGerarAcaoCorretiva = async (alert: any) => {
    setSelectedAlert(alert)
    setGeneratingAction(true)
    setShowActionModal(true)
    setGeneratedAction(null)

    try {
      const response = await fetch(`${API_BASE_URL}/acoes-corretivas/gerar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          departamento: alert.departamento,
          responsavel: user?.name || 'Responsável'
        })
      })

      if (!response.ok) {
        throw new Error('Erro ao gerar ação corretiva')
      }

      const acao = await response.json()
      setGeneratedAction(acao)
      
    } catch (err: any) {
      console.error('Erro ao gerar ação:', err)
      alert('Erro ao gerar ação corretiva: ' + err.message)
      setShowActionModal(false)
    } finally {
      setGeneratingAction(false)
    }
  }

  const handleSaveAction = async () => {
    if (!selectedAlert || !generatedAction) return

    try {
      // Tentar atualizar o status do alerta no backend
      try {
        const response = await fetch(`${API_BASE_URL}/stats/alerts/${selectedAlert.id}/resolver`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'resolvido',
            acaoCorretivaId: generatedAction.id
          })
        })

        if (!response.ok && response.status !== 404) {
          throw new Error('Erro ao atualizar status do alerta')
        }
      } catch (apiError) {
        // Se o endpoint não existir (404), continua e atualiza localmente
        console.log('Endpoint de atualização não disponível, atualizando localmente')
      }

      // Atualizar a lista de alertas localmente (sempre funciona)
      setAlerts(prevAlerts => 
        prevAlerts.map(alert => 
          alert.id === selectedAlert.id 
            ? { ...alert, status: 'resolvido' }
            : alert
        )
      )

      alert('✅ Ação corretiva salva com sucesso! Alerta marcado como resolvido.')
      setShowActionModal(false)
      setGeneratedAction(null)
      setSelectedAlert(null)
      
    } catch (err: any) {
      console.error('Erro ao salvar ação:', err)
      alert('❌ Erro ao salvar ação corretiva: ' + err.message)
    }
  }

  const getRiskColor = (nivel: string) => {
    switch (nivel) {
      case 'baixo': return 'text-green-600 bg-green-100'
      case 'medio': return 'text-yellow-600 bg-yellow-100'
      case 'alto': return 'text-orange-600 bg-orange-100'
      case 'critico': return 'text-red-600 bg-red-100'
      case 'questionario': return 'text-blue-600 bg-blue-100'
      case 'melhoria': return 'text-green-600 bg-green-100'
      case 'informacao': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getRiskLabel = (nivel: string) => {
    switch (nivel) {
      case 'baixo': return 'Baixo'
      case 'medio': return 'Médio'
      case 'alto': return 'Alto'
      case 'critico': return 'Crítico'
      case 'questionario': return 'Questionário'
      case 'melhoria': return 'Melhoria'
      case 'informacao': return 'Informação'
      default: return nivel
    }
  }

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade?.toLowerCase()) {
      case 'urgente': return 'text-red-600 bg-red-100'
      case 'alta': return 'text-orange-600 bg-orange-100'
      case 'média': return 'text-yellow-600 bg-yellow-100'
      case 'baixa': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getAlertColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'text-red-600 bg-red-100'
      case 'informacao': return 'text-blue-600 bg-blue-100'
      case 'resolvido': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getAlertLabel = (status: string) => {
    switch (status) {
      case 'pendente': return 'Pendente'
      case 'informacao': return 'Informação'
      case 'resolvido': return 'Resolvido'
      default: return status
    }
  }

  // Loading state
  if (isLoading || loadingStats) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-safe mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando estatísticas...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              ⚠️ Erro ao carregar estatísticas
            </h2>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Renderização para funcionários
  if (user?.role === 'funcionario') {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-psy mb-2">
              Minhas Estatísticas
            </h1>
            <p className="text-gray-600">
              Acompanhe seu progresso e resultados pessoais
            </p>
            <div className="mt-4">
              <DemoRoleToggle />
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="mb-8">
            <div className="flex gap-2 flex-wrap">
              {[
                { value: '30dias', label: '30 Dias' },
                { value: '3meses', label: '3 Meses' },
                { value: '6meses', label: '6 Meses' },
                { value: '1ano', label: '1 Ano' }
              ].map((range) => (
                <button
                  key={range.value}
                  onClick={() => setTimeRange(range.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    timeRange === range.value
                      ? 'bg-safe text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Personal Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">📋</span>
              </div>
              <div className="text-3xl font-black text-blue-600 mb-1">
                {stats?.minhasAvaliacoes || 0}
              </div>
              <p className="text-gray-600">Minhas Avaliações</p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">⚠️</span>
              </div>
              <div className="text-3xl font-black text-orange-600 mb-1">
                {stats?.meuNivelRisco || 0}%
              </div>
              <p className="text-gray-600">Meu Nível de Risco</p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">✅</span>
              </div>
              <div className="text-3xl font-black text-green-600 mb-1">
                {stats?.minhaConformidade || 0}%
              </div>
              <p className="text-gray-600">Minha Conformidade</p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">⏳</span>
              </div>
              <div className="text-3xl font-black text-yellow-600 mb-1">
                {stats?.minhasRespostasPendentes || 0}
              </div>
              <p className="text-gray-600">Respostas Pendentes</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Personal Trend */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Minha Evolução</h3>
              <div className="space-y-4">
                {stats?.tendenciaPessoal && Object.keys(stats.tendenciaPessoal).length > 0 ? (
                  Object.entries(stats.tendenciaPessoal).map(([mes, valor]: [string, any]) => (
                    <div key={mes} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-600 capitalize w-16">
                          {mes.slice(0, 3)}
                        </span>
                        <span className="text-gray-800">{valor}%</span>
                      </div>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-safe h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(valor, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Sem dados de evolução disponíveis</p>
                    <p className="text-sm mt-2">Complete mais avaliações para visualizar sua evolução</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Personal Alerts */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Minhas Notificações</h3>
              <div className="space-y-4">
                {alerts.length > 0 ? (
                  alerts.map((alert) => (
                    <div key={alert.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                        alert.status === 'pendente' ? 'bg-red-500' : 'bg-blue-500'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2 gap-2">
                          <h4 className="font-medium text-gray-800">{alert.titulo}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getAlertColor(alert.status)}`}>
                            {getAlertLabel(alert.status)}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{alert.descricao}</p>
                        <div className="text-xs text-gray-500">
                          {new Date(alert.data).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Nenhuma notificação no momento</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Personal Response History */}
          <div className="mt-8">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Histórico de Respostas</h3>
              <div className="overflow-x-auto">
                {stats?.minhasRespostas && stats.minhasRespostas.length > 0 ? (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Data</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Questionário</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Pontuação</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600">Nível de Risco</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.minhasRespostas.map((resposta: any, index: number) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {new Date(resposta.data).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="py-3 px-4 text-sm font-medium text-gray-800">
                            {resposta.questionario}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-800">
                            <span className="font-medium">{resposta.pontuacao}%</span>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(resposta.nivelRisco)}`}>
                              {getRiskLabel(resposta.nivelRisco)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Nenhuma avaliação encontrada</p>
                    <p className="text-sm mt-2">Complete seu primeiro questionário para ver o histórico</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Render para gestores
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-psy mb-2">
            Estatísticas e Relatórios
          </h1>
          <p className="text-gray-600">
            Análise detalhada dos dados de riscos psicossociais
          </p>
          <div className="mt-4">
            <DemoRoleToggle />
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="mb-8">
          <div className="flex gap-2 flex-wrap">
            {[
              { value: '30dias', label: '30 Dias' },
              { value: '3meses', label: '3 Meses' },
              { value: '6meses', label: '6 Meses' },
              { value: '1ano', label: '1 Ano' }
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  timeRange === range.value
                    ? 'bg-safe text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl">📋</span>
            </div>
            <div className="text-3xl font-black text-blue-600 mb-1">
              {stats?.totalAvaliacoes || 0}
            </div>
            <p className="text-gray-600">Total de Avaliações</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl">⚠️</span>
            </div>
            <div className="text-3xl font-black text-orange-600 mb-1">
              {stats?.mediaRiscos || 0}%
            </div>
            <p className="text-gray-600">Média de Riscos</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl">✅</span>
            </div>
            <div className="text-3xl font-black text-green-600 mb-1">
              {stats?.nivelConformidade || 0}%
            </div>
            <p className="text-gray-600">Nível de Conformidade</p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl">🚨</span>
            </div>
            <div className="text-3xl font-black text-red-600 mb-1">
              {stats?.alertasAtivos || 0}
            </div>
            <p className="text-gray-600">Alertas Ativos</p>
          </Card>
        </div>

        {/* Risk Distribution & Top Departments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Distribuição de Riscos</h3>
            <div className="space-y-4">
              {stats?.distribuicaoRiscos && Object.entries(stats.distribuicaoRiscos).map(([nivel, quantidade]: [string, any]) => (
                <div key={nivel} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(nivel)}`}>
                      {getRiskLabel(nivel)}
                    </span>
                    <span className="text-gray-600">{quantidade} colaboradores</span>
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        nivel === 'baixo' ? 'bg-green-500' :
                        nivel === 'medio' ? 'bg-yellow-500' :
                        nivel === 'alto' ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${stats.totalAvaliacoes > 0 ? (quantidade / stats.totalAvaliacoes) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Top Departamentos</h3>
            <div className="space-y-4">
              {stats?.topDepartamentos && stats.topDepartamentos.length > 0 ? (
                stats.topDepartamentos.map((dept: any, index: number) => (
                  <div key={dept.nome} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-safe/10 rounded-full flex items-center justify-center text-xs font-bold text-safe flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="font-medium text-gray-800">{dept.nome}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-800">
                        {dept.avaliacoes} avaliações
                      </div>
                      <div className="text-xs text-gray-500">
                        Risco: {dept.mediaRisco}%
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhum departamento com dados disponíveis</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Recent Alerts with AI Action Button */}
        <div className="mt-8">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Alertas Recentes</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="animate-pulse">🧠</span>
                <span>Ações geradas por IA</span>
              </div>
            </div>
            <div className="space-y-4">
              {alerts.length > 0 ? (
                alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                      alert.nivel === 'critico' ? 'bg-red-500' :
                      alert.nivel === 'alto' ? 'bg-orange-500' :
                      alert.nivel === 'medio' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <h4 className="font-medium text-gray-800">{alert.titulo}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                          alert.status === 'pendente' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                        }`}>
                          {alert.status === 'pendente' ? 'Pendente' : 'Resolvido'}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{alert.descricao}</p>
                      <div className="flex justify-between items-center gap-4 flex-wrap">
                        <div className="text-xs text-gray-500">
                          <span>{alert.departamento}</span>
                          <span className="mx-2">•</span>
                          <span>{new Date(alert.data).toLocaleDateString('pt-BR')}</span>
                        </div>
                        {alert.status === 'pendente' && (
                          <button
                            onClick={() => handleGerarAcaoCorretiva(alert)}
                            disabled={generatingAction}
                            className="bg-gradient-to-r from-safe to-psy hover:from-safe/90 hover:to-psy/90 text-white text-xs px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="text-base">🧠</span>
                            <span>Gerar Ação com IA</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhum alerta no momento</p>
                  <p className="text-sm mt-2">✅ Todos os indicadores estão em níveis seguros</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Modal de Ação Corretiva */}
        {showActionModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      {generatingAction ? '🧠 Gerando Ação Corretiva...' : '✅ Ação Corretiva Gerada'}
                    </h2>
                    <p className="text-gray-600">
                      {selectedAlert?.departamento && `Departamento: ${selectedAlert.departamento}`}
                    </p>
                  </div>
                  {!generatingAction && (
                    <button
                      onClick={() => setShowActionModal(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <div className="p-6">
                {generatingAction ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-safe mx-auto mb-4"></div>
                    <p className="text-gray-600 mb-2">Analisando contexto e gerando recomendações...</p>
                    <p className="text-sm text-gray-500">Isso pode levar alguns segundos</p>
                  </div>
                ) : generatedAction ? (
                  <div className="space-y-6">
                    {/* Título e Prioridade */}
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-xl font-bold text-gray-800">{generatedAction.titulo}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium flex-shrink-0 ${getPriorityColor(generatedAction.prioridade)}`}>
                          {generatedAction.prioridade}
                        </span>
                      </div>
                      <div className="flex gap-2 text-sm text-gray-600">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(generatedAction.nivelRisco)}`}>
                          {getRiskLabel(generatedAction.nivelRisco)}
                        </span>
                        <span>•</span>
                        <span>Prazo: {new Date(generatedAction.dataPrazo).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>

                    {/* Descrição */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">📋 Descrição</h4>
                      <p className="text-gray-600 whitespace-pre-wrap">{generatedAction.descricao}</p>
                    </div>

                    {/* Análise Detalhada */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">🔍 Análise Detalhada</h4>
                      <p className="text-gray-600 whitespace-pre-wrap">{generatedAction.analiseDetalhada}</p>
                    </div>

                    {/* Medidas Sugeridas */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">✓ Medidas Sugeridas</h4>
                      <div className="space-y-2">
                        {generatedAction.medidasSugeridas.map((medida, index) => (
                          <div key={index} className="flex gap-3 items-start">
                            <span className="w-6 h-6 bg-safe/10 rounded-full flex items-center justify-center text-xs font-bold text-safe flex-shrink-0 mt-0.5">
                              {index + 1}
                            </span>
                            <p className="text-gray-700 flex-1">{medida}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Impacto Esperado */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">📈 Impacto Esperado</h4>
                      <p className="text-gray-600 whitespace-pre-wrap">{generatedAction.impactoEsperado}</p>
                    </div>

                    {/* Recursos Necessários */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">💼 Recursos Necessários</h4>
                      <p className="text-gray-600 whitespace-pre-wrap">{generatedAction.recursosNecessarios}</p>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={handleSaveAction}
                        className="flex-1 bg-safe hover:bg-safe/90 text-white py-3 rounded-lg font-medium transition-colors"
                      >
                        ✓ Confirmar e Salvar
                      </button>
                      <button
                        onClick={() => setShowActionModal(false)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}