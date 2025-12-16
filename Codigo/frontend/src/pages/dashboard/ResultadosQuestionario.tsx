import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { questionarioService, ResultadoQuestionario } from '../../services/questionarioService'

export default function ResultadosQuestionario() {
  const navigate = useNavigate()
  const [resultados, setResultados] = useState<ResultadoQuestionario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadResultados()
  }, [])

  const loadResultados = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await questionarioService.getResultados()
      setResultados(data)
    } catch (err: any) {
      console.error('Erro ao carregar resultados:', err)
      setError(err.message || 'Erro ao carregar resultados')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-600">Carregando resultados...</div>
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
            <Button onClick={loadResultados} className="mt-4">
              Tentar novamente
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/dashboard/questionarios')}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200 font-medium border border-gray-300 hover:border-gray-400"
            >
              <span className="text-lg">←</span>
              Voltar
            </button>
            <h1 className="text-3xl font-black text-psy">
              Meus Resultados
            </h1>
          </div>
          <p className="text-gray-600">
            Visualize os resultados dos questionários que você respondeu
          </p>
        </div>

        {resultados.length > 0 ? (
          <div className="space-y-6">
            {resultados.map((resultado) => (
              <Card key={resultado.idQuestionario} className="p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {resultado.tituloQuestionario}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Respondido em: {new Date(resultado.dataResposta).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                        resultado.completo 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {resultado.completo ? '✓ Completo' : '⚠️ Incompleto'}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {resultado.perguntasRespondidas} de {resultado.totalPerguntas} perguntas
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-6">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-safe h-2 rounded-full transition-all"
                        style={{ width: `${(resultado.perguntasRespondidas / resultado.totalPerguntas) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Results by subscale */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-800">Resultados por Subescala:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(resultado.resultadosPorSubescala).map(([nome, subescala]) => (
                        <div key={nome} className="bg-gray-50 rounded-lg p-4">
                          <h5 className="font-semibold text-gray-700 text-sm mb-2">{subescala.nomeSubescala}</h5>
                          <div className="flex items-center gap-2">
                            <div className="text-2xl font-bold text-safe">
                              {subescala.mediaRespostas.toFixed(1)}
                            </div>
                            <div className="text-xs text-gray-500">
                              / 5.0
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {subescala.totalPerguntas} perguntas
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center bg-gray-50">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Nenhum resultado disponível
            </h3>
            <p className="text-gray-600 mb-6">
              Você ainda não respondeu a nenhum questionário. Complete uma avaliação para ver seus resultados aqui.
            </p>
            <Button variant="primary" onClick={() => navigate('/dashboard/questionarios')}>
              Ver Questionários Disponíveis
            </Button>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
