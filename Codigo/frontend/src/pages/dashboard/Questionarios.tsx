import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { questionarioService, Questionario } from '../../services/questionarioService'

export default function Questionarios() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'questionarios' | 'agendados'>('questionarios')
  const [questionarios, setQuestionarios] = useState<Questionario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [scheduledQuestionnaires, setScheduledQuestionnaires] = useState<any[]>([])
  const [loadingScheduled, setLoadingScheduled] = useState(false)

  useEffect(() => {
    loadQuestionarios()
    if (user?.role === 'gestor') {
      loadScheduledQuestionnaires()
    }
  }, [user?.role])

  const loadQuestionarios = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await questionarioService.getAllQuestionarios()
      
      // 🔍 DEBUG DETALHADO
      console.log('📊 Total de questionários:', data.length)
      console.log('📊 Primeiro questionário COMPLETO:', JSON.stringify(data[0], null, 2))
      console.log('📊 ID do primeiro:', data[0]?.id)
      console.log('📊 Campos disponíveis:', Object.keys(data[0] || {}))
      
      const uniqueQuestionarios = data.reduce((acc: Questionario[], curr) => {
        const exists = acc.find(q => q.titulo === curr.titulo)
        if (!exists) {
          acc.push(curr)
        }
        return acc
      }, [])
      
      console.log('✅ Questionários únicos:', uniqueQuestionarios)
      setQuestionarios(uniqueQuestionarios)
    } catch (err: any) {
      console.error('❌ Erro ao carregar questionários:', err)
      setError(err.message || 'Erro ao carregar questionários')
    } finally {
      setLoading(false)
    }
  }

  const loadScheduledQuestionnaires = async () => {
    try {
      setLoadingScheduled(true)
      const data = await questionarioService.getAgendamentos()
      setScheduledQuestionnaires(data)
    } catch (err: any) {
      console.error('Erro ao carregar agendamentos:', err)
    } finally {
      setLoadingScheduled(false)
    }
  }

  const handleCancelSchedule = async (id: number) => {
    if (!confirm('Deseja realmente cancelar este agendamento?')) {
      return
    }

    try {
      console.log('🗑️ Iniciando cancelamento do ID:', id)
      
      // Chama o serviço para deletar no backend
      await questionarioService.cancelarAgendamento(id)
      console.log('✅ Agendamento deletado no backend')
      
      // Remove imediatamente da lista no frontend
      setScheduledQuestionnaires(prev => {
        const filtered = prev.filter(scheduled => scheduled.id !== id)
        console.log('📋 Lista atualizada. Itens restantes:', filtered.length)
        return filtered
      })
      
      alert('Agendamento cancelado com sucesso!')
      
      // Recarrega a lista do backend para garantir sincronização
      await loadScheduledQuestionnaires()
      
    } catch (err: any) {
      console.error('❌ Erro ao cancelar agendamento:', err)
      alert(err.message || 'Erro ao cancelar agendamento')
    }
  }

  const handleScheduleQuestionnaire = (questionario: Questionario) => {
    const questionnaireId = questionario.id || questionario.idQuestionario || 0
    console.log('📅 Agendando questionário:', questionnaireId)
    console.log('📅 Objeto completo:', questionario)
    navigate('/dashboard/questionarios/agendar', {
      state: { questionnaireId }
    })
  }

  const handleAnswerQuestionnaire = (questionario: Questionario, version: 'curta' | 'media' | 'longa') => {
    const questionnaireId = questionario.id || questionario.idQuestionario || 0
    console.log('📝 Respondendo questionário:', questionnaireId, 'versão:', version)
    console.log('📝 Objeto completo:', questionario)
    navigate('/dashboard/questionarios/responder', {
      state: { questionnaireId, version }
    })
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-600">Carregando questionários...</div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          <Card className="p-6 bg-red-50 border-red-200">
            <p className="text-red-800">{error}</p>
            <Button onClick={loadQuestionarios} className="mt-4">
              Tentar novamente
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  if (user?.role === 'gestor') {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-psy mb-2">
              Gerenciar Questionários
            </h1>
            <p className="text-gray-600">
              Agende e acompanhe questionários para sua equipe
            </p>
          </div>

          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('questionarios')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'questionarios'
                      ? 'border-safe text-safe'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Questionários Disponíveis
                </button>
                <button
                  onClick={() => setActiveTab('agendados')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'agendados'
                      ? 'border-safe text-safe'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Questionários Agendados
                </button>
              </nav>
            </div>
          </div>

          {activeTab === 'questionarios' && (
            <div className="grid grid-cols-1 gap-6">
              {questionarios.length > 0 ? (
                questionarios.map((questionario, index) => (
                  <Card key={questionario.id || `q-${index}`} className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-bold text-gray-800">
                            {questionario.titulo}
                          </h3>
                          <span className="px-3 py-1 rounded-full text-sm font-medium text-green-600 bg-green-100">
                            ✓ Ativo
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">
                          {questionario.descricao}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                          <div>
                            <span className="font-medium">Total de perguntas:</span> {questionario.totalPerguntas}
                          </div>
                          <div>
                            <span className="font-medium">Criado em:</span> {new Date(questionario.dataCriacao).toLocaleDateString('pt-BR')}
                          </div>
                          <div>
                            <span className="font-medium">Versões:</span> Curta, Média, Longa
                          </div>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                          <p className="font-medium mb-1">💡 Versões disponíveis:</p>
                          <p>• Curta (~20 perguntas, 5-10 min) • Média (~50 perguntas, 15-20 min) • Longa (119 perguntas, 30-40 min)</p>
                        </div>
                      </div>
                      <div className="ml-6">
                        <Button
                          variant="primary"
                          size="lg"
                          onClick={() => handleScheduleQuestionnaire(questionario)}
                        >
                          📅 Agendar Questionário
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="p-8 text-center bg-gray-50">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📋</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    Nenhum questionário disponível
                  </h3>
                  <p className="text-gray-600">
                    Não há questionários ativos no momento.
                  </p>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'agendados' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Questionários Agendados</h2>
                <Button variant="primary" onClick={() => setActiveTab('questionarios')}>
                  ➕ Novo Agendamento
                </Button>
              </div>

              {loadingScheduled ? (
                <div className="text-center py-8">
                  <div className="text-gray-600">Carregando agendamentos...</div>
                </div>
              ) : scheduledQuestionnaires.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {scheduledQuestionnaires.map((scheduled, index) => (
                    <Card key={scheduled.id || `s-${index}`} className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-800">
                              {scheduled.tituloQuestionario}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              scheduled.versao === 'curta' ? 'text-green-600 bg-green-100' :
                              scheduled.versao === 'media' ? 'text-blue-600 bg-blue-100' :
                              'text-purple-600 bg-purple-100'
                            }`}>
                              {scheduled.versao === 'curta' ? '📝 Versão Curta' :
                               scheduled.versao === 'media' ? '📋 Versão Média' :
                               '📚 Versão Longa'}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              scheduled.ativo ? 'text-green-600 bg-green-100' :
                              'text-gray-600 bg-gray-100'
                            }`}>
                              {scheduled.ativo ? '✓ Ativo' : 'Encerrado'}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                            <div>
                              <span className="font-medium">Período:</span>
                              <p>{new Date(scheduled.dataInicio).toLocaleDateString('pt-BR')} até {new Date(scheduled.dataFim).toLocaleDateString('pt-BR')}</p>
                            </div>
                            <div>
                              <span className="font-medium">Departamentos:</span>
                              <p>{scheduled.departamentos?.length || 0} selecionados</p>
                            </div>
                            <div>
                              <span className="font-medium">Participantes:</span>
                              <p>{scheduled.totalParticipantes || 0} pessoas</p>
                            </div>
                            <div>
                              <span className="font-medium">Respostas:</span>
                              <p className="text-safe font-semibold">{scheduled.totalRespostas || 0}/{scheduled.totalParticipantes || 0} ({scheduled.totalParticipantes > 0 ? Math.round((scheduled.totalRespostas/scheduled.totalParticipantes)*100) : 0}%)</p>
                            </div>
                          </div>

                          {scheduled.departamentos && scheduled.departamentos.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {scheduled.departamentos.map((dept: string, idx: number) => (
                                <span key={`dept-${scheduled.id}-${idx}`} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                  {dept}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="ml-6 flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelSchedule(scheduled.id)}
                          >
                            ❌ Cancelar
                          </Button>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Progresso de respostas</span>
                          <span>{scheduled.totalParticipantes > 0 ? Math.round((scheduled.totalRespostas/scheduled.totalParticipantes)*100) : 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-safe h-2 rounded-full transition-all"
                            style={{ width: `${scheduled.totalParticipantes > 0 ? (scheduled.totalRespostas/scheduled.totalParticipantes)*100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center bg-gray-50">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📋</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    Nenhum questionário agendado
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Agende seu primeiro questionário para começar a acompanhar os resultados da equipe.
                  </p>
                  <Button variant="primary" onClick={() => setActiveTab('questionarios')}>
                    📅 Agendar Questionário
                  </Button>
                </Card>
              )}
            </div>
          )}
        </div>
      </DashboardLayout>
    )
  } else if (user?.role === 'funcionario') {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-psy mb-2">
              Meus Questionários
            </h1>
            <p className="text-gray-600">
              Complete suas avaliações pendentes
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 Questionários Disponíveis</h2>
            <div className="space-y-4">
              {questionarios.length > 0 ? (
                questionarios.map((questionario, index) => (
                  <Card key={questionario.id || `q-${index}`} className="p-6 bg-gradient-to-br from-safe/5 to-safe/10 border-safe/20">
                    <div className="mb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-800">
                          {questionario.titulo}
                        </h3>
                        <span className="px-3 py-1 rounded-full text-sm font-medium text-green-600 bg-green-100">
                          ✓ Disponível
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">
                        {questionario.descricao}
                      </p>
                      <div className="text-sm text-gray-600 mb-4">
                        <span className="font-medium">Total de perguntas:</span> {questionario.totalPerguntas}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-sm font-medium text-gray-700 mb-3">Escolha a versão que deseja responder:</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <button
                          onClick={() => handleAnswerQuestionnaire(questionario, 'curta')}
                          className="p-4 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all text-left"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">📝</span>
                            <span className="font-bold text-green-700">Versão Curta</span>
                          </div>
                          <p className="text-sm text-gray-600">~20 perguntas</p>
                          <p className="text-xs text-gray-500">5-10 minutos</p>
                        </button>

                        <button
                          onClick={() => handleAnswerQuestionnaire(questionario, 'media')}
                          className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-left"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">📋</span>
                            <span className="font-bold text-blue-700">Versão Média</span>
                          </div>
                          <p className="text-sm text-gray-600">~50 perguntas</p>
                          <p className="text-xs text-gray-500">15-20 minutos</p>
                        </button>

                        <button
                          onClick={() => handleAnswerQuestionnaire(questionario, 'longa')}
                          className="p-4 border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all text-left"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">📚</span>
                            <span className="font-bold text-purple-700">Versão Longa</span>
                          </div>
                          <p className="text-sm text-gray-600">119 perguntas</p>
                          <p className="text-xs text-gray-500">30-40 minutos</p>
                        </button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="p-8 text-center bg-gray-50">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📋</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    Nenhum questionário disponível
                  </h3>
                  <p className="text-gray-600">
                    Não há questionários disponíveis para responder no momento.
                  </p>
                </Card>
              )}
            </div>
          </div>

          <Card className="p-6 bg-blue-50 border-blue-200">
            <h3 className="text-lg font-bold text-blue-800 mb-2">💡 Como responder</h3>
            <div className="text-blue-700 text-sm space-y-2">
              <p>• Escolha a versão do questionário que melhor se adequa ao seu tempo disponível</p>
              <p>• <strong>Versão Curta:</strong> Avaliação rápida com perguntas essenciais (5-10 min)</p>
              <p>• <strong>Versão Média:</strong> Avaliação mais detalhada e equilibrada (15-20 min)</p>
              <p>• <strong>Versão Longa:</strong> Avaliação completa conforme NR-1 (30-40 min)</p>
              <p>• Responda todas as perguntas com atenção e sinceridade</p>
              <p>• Seus dados são tratados de forma confidencial</p>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    )
  } else {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
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
}