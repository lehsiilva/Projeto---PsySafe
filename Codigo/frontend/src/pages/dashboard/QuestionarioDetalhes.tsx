import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'

// Mock data for questionnaire details
const mockQuestionnaireDetails = {
  id: 'q1',
  titulo: 'Avaliação de Riscos Psicossociais - NR-1',
  descricao: 'Questionário completo para avaliação de conformidade NR-1',
  status: 'agendado',
  perguntas: 25,
  tempoEstimado: '15 min',
  ultimaAtualizacao: '2024-01-10',
  participantes: 45,
  dataAgendamento: '2024-01-15',
  prazo: '2024-01-30',
  participantesPrevistos: 50,
  participantesRespondidos: 23,
  questions: [
    {
      id: 1,
      tipo: 'escala',
      titulo: 'Como você avalia o equilíbrio entre trabalho e vida pessoal?',
      opcoes: ['1 - Muito insatisfatório', '2 - Insatisfatório', '3 - Neutro', '4 - Satisfatório', '5 - Muito satisfatório'],
      obrigatoria: true
    },
    {
      id: 2,
      tipo: 'escala',
      titulo: 'Como você percebe o nível de apoio social no ambiente de trabalho?',
      opcoes: ['1 - Sem apoio', '2 - Pouco apoio', '3 - Apoio moderado', '4 - Bom apoio', '5 - Excelente apoio'],
      obrigatoria: true
    },
    {
      id: 3,
      tipo: 'escala',
      titulo: 'Quão frequentemente você sente pressão ou estresse no trabalho?',
      opcoes: ['1 - Sempre', '2 - Frequentemente', '3 - Às vezes', '4 - Raramente', '5 - Nunca'],
      obrigatoria: true
    },
    {
      id: 4,
      tipo: 'escala',
      titulo: 'Como você avalia suas oportunidades de crescimento profissional?',
      opcoes: ['1 - Nenhuma oportunidade', '2 - Poucas oportunidades', '3 - Algumas oportunidades', '4 - Boas oportunidades', '5 - Excelentes oportunidades'],
      obrigatoria: true
    },
    {
      id: 5,
      tipo: 'escala',
      titulo: 'Em geral, como você se sente no ambiente de trabalho?',
      opcoes: ['1 - Muito insatisfeito', '2 - Insatisfeito', '3 - Neutro', '4 - Satisfeito', '5 - Muito satisfeito'],
      obrigatoria: true
    }
  ]
}

export default function QuestionarioDetalhes() {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'perguntas' | 'info'>('perguntas')

  // Get questionnaire ID from location state
  const questionnaireId = location.state?.questionnaireId || 'q1'

  const getQuestionTypeLabel = (tipo: string) => {
    switch (tipo) {
      case 'escala': return 'Escala Likert'
      case 'multipla': return 'Múltipla Escolha'
      case 'texto': return 'Texto Livre'
      default: return tipo
    }
  }

  const getQuestionTypeColor = (tipo: string) => {
    switch (tipo) {
      case 'escala': return 'bg-blue-100 text-blue-800'
      case 'multipla': return 'bg-green-100 text-green-800'
      case 'texto': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleBack = () => {
    navigate('/dashboard/questionarios')
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" onClick={handleBack}>
              ← Voltar
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-black text-psy mb-2">
                {mockQuestionnaireDetails.titulo}
              </h1>
              <p className="text-gray-600">
                Detalhes e perguntas do questionário
              </p>
            </div>
          </div>

          {/* Status and basic info */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-safe">{mockQuestionnaireDetails.perguntas}</div>
              <div className="text-sm text-gray-600">Perguntas</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{mockQuestionnaireDetails.tempoEstimado}</div>
              <div className="text-sm text-gray-600">Tempo Estimado</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{mockQuestionnaireDetails.participantesRespondidos}/{mockQuestionnaireDetails.participantesPrevistos}</div>
              <div className="text-sm text-gray-600">Respondido</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{Math.round((mockQuestionnaireDetails.participantesRespondidos / mockQuestionnaireDetails.participantesPrevistos) * 100)}%</div>
              <div className="text-sm text-gray-600">Taxa de Resposta</div>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('perguntas')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'perguntas'
                    ? 'border-safe text-safe'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📝 Perguntas ({mockQuestionnaireDetails.questions.length})
              </button>
              <button
                onClick={() => setActiveTab('info')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'info'
                    ? 'border-safe text-safe'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ℹ️ Informações Gerais
              </button>
            </nav>
          </div>
        </div>

        {/* Questions Tab */}
        {activeTab === 'perguntas' && (
          <div className="space-y-4">
            {mockQuestionnaireDetails.questions.map((question, index) => (
              <Card key={question.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-safe text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-1">
                        {question.titulo}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getQuestionTypeColor(question.tipo)}`}>
                          {getQuestionTypeLabel(question.tipo)}
                        </span>
                        {question.obrigatoria && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                            Obrigatória
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {question.opcoes && (
                  <div className="ml-11">
                    <p className="text-sm text-gray-600 mb-2">Opções de resposta:</p>
                    <div className="flex flex-wrap gap-2">
                      {question.opcoes.map((opcao, opcaoIndex) => (
                        <span
                          key={opcaoIndex}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {opcao}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {question.tipo === 'texto' && (
                  <div className="ml-11">
                    <p className="text-sm text-gray-600">
                      Resposta em formato de texto livre (campo aberto)
                    </p>
                  </div>
                )}

                {question.tipo === 'multipla' && (
                  <div className="ml-11">
                    <p className="text-sm text-blue-600 font-medium">
                      ✓ Múltiplas respostas permitidas
                    </p>
                  </div>
                )}

                {question.tipo === 'escala' && (
                  <div className="ml-11">
                    <p className="text-sm text-gray-600">
                      Resposta em escala de 1 a 5
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Info Tab */}
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">📊 Informações do Questionário</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Título:</span>
                  <span className="font-medium">{mockQuestionnaireDetails.titulo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600">Ativo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total de Perguntas:</span>
                  <span className="font-medium">{mockQuestionnaireDetails.perguntas}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tempo Estimado:</span>
                  <span className="font-medium">{mockQuestionnaireDetails.tempoEstimado}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Última Atualização:</span>
                  <span className="font-medium">{new Date(mockQuestionnaireDetails.ultimaAtualizacao).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Participantes Anteriores:</span>
                  <span className="font-medium">{mockQuestionnaireDetails.participantes}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">📅 Informações do Agendamento</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Data de Agendamento:</span>
                  <span className="font-medium">{new Date(mockQuestionnaireDetails.dataAgendamento).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Prazo:</span>
                  <span className="font-medium">{new Date(mockQuestionnaireDetails.prazo).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Participantes Previsto:</span>
                  <span className="font-medium">{mockQuestionnaireDetails.participantesPrevistos}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Participantes Respondido:</span>
                  <span className="font-medium text-green-600">{mockQuestionnaireDetails.participantesRespondidos}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxa de Resposta:</span>
                  <span className="font-medium">{Math.round((mockQuestionnaireDetails.participantesRespondidos / mockQuestionnaireDetails.participantesPrevistos) * 100)}%</span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
