import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import DashboardLayout from '../../components/DashboardLayout'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'

interface ScheduledQuestionnaire {
  id: string
  titulo: string
  descricao: string
  dataAgendamento: string
  prazo: string
  status: 'agendado' | 'disponivel' | 'expirado'
  perguntas: number
  tempoEstimado: string
}

export default function FuncionarioDashboard() {
  const { user } = useAuth()
  const [scheduledQuestionnaires, setScheduledQuestionnaires] = useState<ScheduledQuestionnaire[]>([])
  const [activeQuestionnaire, setActiveQuestionnaire] = useState<ScheduledQuestionnaire | null>(null)

  // Dados mock - substituir por chamada da API posteriormente
  useEffect(() => {
    // Simular chamada da API para obter questionários agendados
    const mockScheduled: ScheduledQuestionnaire[] = [
      {
        id: 'q1',
        titulo: 'Avaliação de Riscos Psicossociais - NR-1',
        descricao: 'Questionário completo para avaliação de conformidade NR-1',
        dataAgendamento: '2024-01-15',
        prazo: '2024-01-30',
        status: 'disponivel',
        perguntas: 25,
        tempoEstimado: '15 min'
      }
    ]
    setScheduledQuestionnaires(mockScheduled)
    setActiveQuestionnaire(mockScheduled[0] || null)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponivel': return 'text-green-600 bg-green-100'
      case 'agendado': return 'text-blue-600 bg-blue-100'
      case 'expirado': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'disponivel': return 'Disponível'
      case 'agendado': return 'Agendado'
      case 'expirado': return 'Expirado'
      default: return status
    }
  }

  const handleStartQuestionnaire = (questionnaire: ScheduledQuestionnaire) => {
    // Navegar para a página de resposta do questionário
    console.log('Starting questionnaire:', questionnaire.id)
    // Isso será implementado quando modificarmos a página do questionário
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-psy mb-2">
            Dashboard Funcionário
          </h1>
          <p className="text-gray-600">
            Olá, <span className="font-medium text-safe">{user?.name}</span>! Complete suas avaliações pendentes.
          </p>

        </div>

        {/* Active Questionnaire Section */}
        {activeQuestionnaire && activeQuestionnaire.status === 'disponivel' ? (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 Questionário Disponível</h2>
            <Card className="p-6 bg-gradient-to-br from-safe/5 to-safe/10 border-safe/20">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold text-gray-800">
                      {activeQuestionnaire.titulo}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(activeQuestionnaire.status)}`}>
                      {getStatusLabel(activeQuestionnaire.status)}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {activeQuestionnaire.descricao}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Perguntas:</span> {activeQuestionnaire.perguntas}
                    </div>
                    <div>
                      <span className="font-medium">Tempo estimado:</span> {activeQuestionnaire.tempoEstimado}
                    </div>
                    <div>
                      <span className="font-medium">Agendado em:</span> {new Date(activeQuestionnaire.dataAgendamento).toLocaleDateString('pt-BR')}
                    </div>
                    <div>
                      <span className="font-medium">Prazo:</span> {new Date(activeQuestionnaire.prazo).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
                <div className="ml-6">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => handleStartQuestionnaire(activeQuestionnaire)}
                  >
                    🔍 Responder Questionário
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 Questionários</h2>
            <Card className="p-8 text-center bg-gray-50">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Nenhum questionário disponível no momento
              </h3>
              <p className="text-gray-600">
                Não há questionários agendados para você no momento. Você será notificado quando um novo questionário estiver disponível.
              </p>
            </Card>
          </div>
        )}

        {/* Recent Activity */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Histórico de Respostas</h2>
          <Card className="p-6">
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg">📈</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Histórico vazio
              </h3>
              <p className="text-gray-600 text-sm">
                Você ainda não respondeu a nenhum questionário. Suas respostas aparecerão aqui após completar uma avaliação.
              </p>
            </div>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">📋</span>
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">
              {activeQuestionnaire ? '1' : '0'}
            </div>
            <div className="text-sm text-gray-600">
              Questionário{activeQuestionnaire ? '' : 's'} Disponível{activeQuestionnaire ? '' : 'is'}
            </div>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">✅</span>
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">0</div>
            <div className="text-sm text-gray-600">Completados</div>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">⏳</span>
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">0</div>
            <div className="text-sm text-gray-600">Pendentes</div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
