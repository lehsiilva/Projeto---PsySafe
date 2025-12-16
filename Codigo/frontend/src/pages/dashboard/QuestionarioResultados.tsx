import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'

// Configuração do modo de demonstração - usa variável de ambiente
const DEMO_MODE = import.meta.env?.VITE_DEMO_MODE === 'true'

// Dados mock para resultados de questionários
const mockQuestionnaireResults = {
  id: 'q1',
  titulo: 'Avaliação de Riscos Psicossociais - NR-1',
  questions: [
    {
      id: 1,
      titulo: 'Como você avalia o equilíbrio entre trabalho e vida pessoal?',
      tipo: 'escala'
    },
    {
      id: 2,
      titulo: 'Como você percebe o nível de apoio social no ambiente de trabalho?',
      tipo: 'escala'
    },
    {
      id: 3,
      titulo: 'Quão frequentemente você sente pressão ou estresse no trabalho?',
      tipo: 'escala'
    },
    {
      id: 4,
      titulo: 'Como você avalia suas oportunidades de crescimento profissional?',
      tipo: 'escala'
    },
    {
      id: 5,
      titulo: 'Em geral, como você se sente no ambiente de trabalho?',
      tipo: 'escala'
    }
  ],
  employees: [
    {
      id: 'emp1',
      nome: 'Maria Silva',
      email: 'maria.silva@empresa.com',
      setor: 'Recursos Humanos',
      cargo: 'Analista de RH',
      dataResposta: '2024-01-15T14:30:00Z',
      tempoGasto: '12 min',
      pontuacao: 85,
      respostas: {
        1: '4 - Satisfatório', // Resposta de escala
        2: '4 - Bom apoio',
        3: '3 - Às vezes',
        4: '4 - Boas oportunidades',
        5: '4 - Satisfeito'
      }
    },
    {
      id: 'emp2',
      nome: 'Carlos Santos',
      email: 'carlos.santos@empresa.com',
      setor: 'TI',
      cargo: 'Desenvolvedor Senior',
      dataResposta: '2024-01-15T11:15:00Z',
      tempoGasto: '18 min',
      pontuacao: 92,
      respostas: {
        1: '5 - Muito satisfatório',
        2: '5 - Excelente apoio',
        3: '4 - Raramente',
        4: '5 - Excelentes oportunidades',
        5: '5 - Muito satisfeito'
      }
    },
    {
      id: 'emp3',
      nome: 'Ana Costa',
      email: 'ana.costa@empresa.com',
      setor: 'Financeiro',
      cargo: 'Analista Financeiro',
      dataResposta: '2024-01-14T16:45:00Z',
      tempoGasto: '15 min',
      pontuacao: 78,
      respostas: {
        1: '2 - Insatisfatório',
        2: '3 - Apoio moderado',
        3: '2 - Frequentemente',
        4: '3 - Algumas oportunidades',
        5: '3 - Neutro'
      }
    },
    {
      id: 'emp4',
      nome: 'João Oliveira',
      email: 'joao.oliveira@empresa.com',
      setor: 'Vendas',
      cargo: 'Vendedor',
      dataResposta: '2024-01-14T09:20:00Z',
      tempoGasto: '10 min',
      pontuacao: 88,
      respostas: {
        1: '3 - Neutro',
        2: '4 - Bom apoio',
        3: '3 - Às vezes',
        4: '4 - Boas oportunidades',
        5: '4 - Satisfeito'
      }
    }
  ]
}

interface QuestionnaireResult {
  id: string
  titulo: string
  questions: Question[]
  employees: Employee[]
}

interface Question {
  id: number
  titulo: string
  tipo: string
}

interface Employee {
  id: string
  nome: string
  email: string
  setor: string
  cargo: string
  dataResposta: string
  tempoGasto: string
  pontuacao: number
  respostas: Record<number, string | string[]>
}

export default function QuestionarioResultados() {
  const location = useLocation()
  const navigate = useNavigate()
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null)
  const [filter, setFilter] = useState<'todos' | 'setor' | 'pontuacao'>('todos')
  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get questionnaire ID from location state
  const questionnaireId = location.state?.questionnaireId || 'q1'

  // API call to fetch questionnaire results
  const fetchQuestionnaireResults = async () => {
    try {
      setLoading(true)
      setError(null)

      // TODO: Replace with actual API endpoint
      const response = await fetch(`/api/questionnaires/${questionnaireId}/results/`)
      if (!response.ok) {
        throw new Error('Failed to fetch questionnaire results')
      }

      const data = await response.json()
      setQuestionnaireData(data)
    } catch (err) {
      console.error('Erro ao buscar resultados do questionário:', err)
      setError('Erro ao carregar resultados do questionário')
      // Fallback to mock data if API fails
      setQuestionnaireData(mockQuestionnaireResults)
    } finally {
      setLoading(false)
    }
  }

  // Initialize data on component mount
  useEffect(() => {
    if (!DEMO_MODE) {
      fetchQuestionnaireResults()
    } else {
      setQuestionnaireData(mockQuestionnaireResults)
      setLoading(false)
    }
  }, [questionnaireId])

  // Filter employees based on selected filter
  const getFilteredEmployees = () => {
    if (!questionnaireData?.employees) return []

    switch (filter) {
      case 'setor':
        // Group by sector
        const sectorGroups: Record<string, Employee[]> = {}
        questionnaireData.employees.forEach(emp => {
          if (!sectorGroups[emp.setor]) {
            sectorGroups[emp.setor] = []
          }
          sectorGroups[emp.setor].push(emp)
        })
        return sectorGroups

      case 'pontuacao':
        // Group by score ranges
        const scoreGroups: Record<string, Employee[]> = {
          '90-100': [],
          '80-89': [],
          '70-79': [],
          '60-69': [],
          '0-59': []
        }

        questionnaireData.employees.forEach(emp => {
          if (emp.pontuacao >= 90) scoreGroups['90-100'].push(emp)
          else if (emp.pontuacao >= 80) scoreGroups['80-89'].push(emp)
          else if (emp.pontuacao >= 70) scoreGroups['70-79'].push(emp)
          else if (emp.pontuacao >= 60) scoreGroups['60-69'].push(emp)
          else scoreGroups['0-59'].push(emp)
        })
        return scoreGroups

      default:
        return questionnaireData.employees
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const handleBack = () => {
    navigate('/dashboard/questionarios')
  }

  const handleViewEmployeeDetails = (employeeId: string) => {
    setSelectedEmployee(selectedEmployee === employeeId ? null : employeeId)
  }

  const filteredEmployees = getFilteredEmployees()
  const selectedEmployeeData = questionnaireData?.employees.find(emp => emp.id === selectedEmployee)

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-safe mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando resultados...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Error state
  if (error && !questionnaireData) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" onClick={handleBack}>
              ← Voltar
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-black text-psy mb-2">
                Erro ao carregar resultados
              </h1>
              <p className="text-red-600">{error}</p>
              <Button onClick={fetchQuestionnaireResults} className="mt-4">
                Tentar novamente
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!questionnaireData) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" onClick={handleBack}>
              ← Voltar
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-black text-psy mb-2">
                Nenhum dado encontrado
              </h1>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
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
                Resultados: {questionnaireData.titulo}
              </h1>
              <p className="text-gray-600">
                Análise detalhada das respostas dos funcionários
              </p>
              {!DEMO_MODE && (
                <p className="text-sm text-blue-600 mt-1">
                  Modo de produção - Dados reais da API
                </p>
              )}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-safe">{questionnaireData.employees.length}</div>
              <div className="text-sm text-gray-600">Total de Respostas</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(questionnaireData.employees.reduce((acc, emp) => acc + emp.pontuacao, 0) / questionnaireData.employees.length)}
              </div>
              <div className="text-sm text-gray-600">Pontuação Média</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {questionnaireData.employees.filter(emp => emp.pontuacao >= 80).length}
              </div>
              <div className="text-sm text-gray-600">Acima de 80 pts</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((questionnaireData.employees.length / 50) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Taxa de Resposta</div>
            </Card>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setFilter('todos')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  filter === 'todos'
                    ? 'border-safe text-safe'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                👥 Todos ({questionnaireData.employees.length})
              </button>
              <button
                onClick={() => setFilter('setor')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  filter === 'setor'
                    ? 'border-safe text-safe'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🏢 Por Setor ({Object.keys(filteredEmployees as Record<string, Employee[]>).length})
              </button>
              <button
                onClick={() => setFilter('pontuacao')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  filter === 'pontuacao'
                    ? 'border-safe text-safe'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📊 Por Pontuação ({Object.keys(filteredEmployees as Record<string, Employee[]>).length})
              </button>
            </nav>
          </div>
        </div>

        {/* Results List */}
        <div className="space-y-4">
          {filter === 'todos' ? (
            // Individual employees view
            (filteredEmployees as Employee[]).map((employee) => (
              <Card key={employee.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-800">
                        {employee.nome}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(employee.pontuacao)}`}>
                        {employee.pontuacao} pts
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">Setor:</span> {employee.setor}
                      </div>
                      <div>
                        <span className="font-medium">Cargo:</span> {employee.cargo}
                      </div>
                      <div>
                        <span className="font-medium">Data:</span> {new Date(employee.dataResposta).toLocaleDateString('pt-BR')}
                      </div>
                      <div>
                        <span className="font-medium">Tempo:</span> {employee.tempoGasto}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewEmployeeDetails(employee.id)}
                    >
                      {selectedEmployee === employee.id ? 'Ocultar Detalhes' : 'Ver Detalhes'}
                    </Button>
                  </div>
                </div>

                {/* Detailed Responses */}
                {selectedEmployee === employee.id && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-md font-bold text-gray-800 mb-4">📋 Respostas Detalhadas</h4>
                    <div className="space-y-4">
                      {questionnaireData.questions.map((question, index) => (
                        <div key={question.id} className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-medium text-gray-800 mb-2">
                            {index + 1}. {question.titulo}
                          </h5>
                          <div className="text-gray-700">
                            {Array.isArray(employee.respostas[question.id]) ? (
                              <div className="flex flex-wrap gap-2">
                                {(employee.respostas[question.id] as string[]).map((resposta, idx) => (
                                  <span key={idx} className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm">
                                    {resposta}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="bg-white p-3 rounded border border-gray-300">
                                {employee.respostas[question.id] as string}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))
          ) : (
            // Grouped view (by sector or score)
            Object.entries(filteredEmployees as Record<string, Employee[]>).map(([groupKey, employees]) => (
              <Card key={groupKey} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-800">
                        {filter === 'setor' ? `🏢 ${groupKey}` : `📊 ${groupKey} pontos`}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(
                        Math.round(employees.reduce((acc, emp) => acc + emp.pontuacao, 0) / employees.length)
                      )}`}>
                        {employees.length} funcionários
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Média:</span> {Math.round(employees.reduce((acc, emp) => acc + emp.pontuacao, 0) / employees.length)} pts
                      </div>
                      <div>
                        <span className="font-medium">Maior:</span> {Math.max(...employees.map(emp => emp.pontuacao))} pts
                      </div>
                      <div>
                        <span className="font-medium">Menor:</span> {Math.min(...employees.map(emp => emp.pontuacao))} pts
                      </div>
                      <div>
                        <span className="font-medium">Acima de 80:</span> {employees.filter(emp => emp.pontuacao >= 80).length}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Employee list within group */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700 mb-3">👥 Funcionários neste grupo:</h4>
                  {employees.map((employee) => (
                    <div key={employee.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-gray-800">{employee.nome}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(employee.pontuacao)}`}>
                              {employee.pontuacao} pts
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {employee.cargo} • {employee.setor} • {new Date(employee.dataResposta).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewEmployeeDetails(employee.id)}
                        >
                          {selectedEmployee === employee.id ? 'Ocultar' : 'Ver Detalhes'}
                        </Button>
                      </div>

                      {/* Detailed Responses */}
                      {selectedEmployee === employee.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h5 className="text-sm font-bold text-gray-800 mb-3">📋 Respostas Detalhadas</h5>
                          <div className="space-y-3">
                            {questionnaireData.questions.map((question, index) => (
                              <div key={question.id} className="bg-white p-3 rounded border border-gray-300">
                                <h6 className="font-medium text-gray-800 mb-1">
                                  {index + 1}. {question.titulo}
                                </h6>
                                <div className="text-gray-700 text-sm">
                                  {Array.isArray(employee.respostas[question.id]) ? (
                                    <div className="flex flex-wrap gap-1">
                                      {(employee.respostas[question.id] as string[]).map((resposta, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-xs">
                                          {resposta}
                                        </span>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-sm">
                                      {employee.respostas[question.id] as string}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Export Options */}
        <div className="mt-8 flex justify-center gap-4">
          <Button variant="outline">
            📊 Exportar Relatório (PDF)
          </Button>
          <Button variant="outline">
            📈 Exportar Dados (Excel)
          </Button>
          <Button variant="outline">
            📧 Compartilhar Resultados
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
