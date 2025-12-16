import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import { useAuth } from '../../contexts/AuthContext'
import { questionarioService, Pergunta as PerguntaAPI } from '../../services/questionarioService'

export default function ResponderQuestionario() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const location = useLocation()
  const { questionnaireId, version } = location.state || {}

  const [respostas, setRespostas] = useState<{ [key: number]: number }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [perguntaAtual, setPerguntaAtual] = useState(0)
  const [showExitWarning, setShowExitWarning] = useState(false)
  const [perguntas, setPerguntas] = useState<PerguntaAPI[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [questionario, setQuestionario] = useState<any>(null)

  useEffect(() => {
    console.log('🔍 DEBUG useEffect executado')
    console.log('📋 questionnaireId:', questionnaireId)
    console.log('📋 version:', version)
    console.log('📋 location.state:', location.state)
    
    if (!questionnaireId) {
      console.log('❌ questionnaireId não encontrado, redirecionando...')
      navigate('/dashboard/questionarios')
      return
    }
    
    console.log('✅ Chamando loadQuestionario()')
    loadQuestionario()
  }, [questionnaireId])

  const loadQuestionario = async () => {
    try {
      console.log('🚀 Iniciando loadQuestionario...')
      setLoading(true)
      setError(null)
      
      console.log('📡 Fazendo requisição para questionário:', questionnaireId)
      
      const [questionarioData, perguntasData] = await Promise.all([
        questionarioService.getQuestionarioById(questionnaireId),
        questionarioService.getPerguntasForQuestionario(questionnaireId)
      ])
      
      console.log('✅ Questionário recebido:', questionarioData)
      console.log('✅ Total de perguntas recebidas:', perguntasData.length)
      console.log('📋 Primeira pergunta:', perguntasData[0])
      
      setQuestionario(questionarioData)
      
      // Filter questions based on version
      let filteredPerguntas = perguntasData
      if (version === 'curta') {
        filteredPerguntas = perguntasData.filter((_, index) => index % 6 === 0).slice(0, 20)
        console.log('📝 Versão CURTA: ' + filteredPerguntas.length + ' perguntas')
      } else if (version === 'media') {
        filteredPerguntas = perguntasData.filter((_, index) => index % 2 === 0).slice(0, 50)
        console.log('📝 Versão MÉDIA: ' + filteredPerguntas.length + ' perguntas')
      } else {
        console.log('📝 Versão LONGA: ' + filteredPerguntas.length + ' perguntas')
      }
      
      console.log('✅ Definindo perguntas no estado:', filteredPerguntas.length)
      setPerguntas(filteredPerguntas)
      
    } catch (err: any) {
      console.error('❌ Erro ao carregar questionário:', err)
      console.error('❌ Stack trace:', err.stack)
      setError(err.message || 'Erro ao carregar questionário')
    } finally {
      console.log('✅ loadQuestionario finalizado')
      setLoading(false)
    }
  }

  const handleRespostaChange = (perguntaId: number, resposta: number) => {
    setRespostas(prev => ({
      ...prev,
      [perguntaId]: resposta
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const respostasArray = Object.entries(respostas).map(([idPergunta, valor]) => ({
        idPergunta: parseInt(idPergunta),
        valor
      }))

      await questionarioService.responderQuestionario(questionnaireId, {
        respostas: respostasArray
      })

      alert('Respostas enviadas com sucesso!')
      navigate('/dashboard/questionarios')
    } catch (error: any) {
      console.error('Erro ao enviar respostas:', error)
      alert(error.message || 'Erro ao enviar respostas. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const progresso = perguntas.length > 0 ? (Object.keys(respostas).length / perguntas.length) * 100 : 0

  const proximaPergunta = () => {
    if (perguntaAtual < perguntas.length - 1) {
      setPerguntaAtual(perguntaAtual + 1)
    }
  }

  const perguntaAnterior = () => {
    if (perguntaAtual > 0) {
      setPerguntaAtual(perguntaAtual - 1)
    }
  }

  const perguntaAtualRespondida = perguntas[perguntaAtual] ? respostas[perguntas[perguntaAtual]?.id] !== undefined : false

  const todasRespondidas = Object.keys(respostas).length === perguntas.length

  const ehUltimaPergunta = perguntaAtual === perguntas.length - 1

  const temRespostasNaoSalvas = Object.keys(respostas).length > 0

  const handleVoltarClick = () => {
    if (temRespostasNaoSalvas && !isSubmitting) {
      setShowExitWarning(true)
    } else {
      navigate('/dashboard/questionarios')
    }
  }

  const confirmarSaida = () => {
    setShowExitWarning(false)
    navigate('/dashboard/questionarios')
  }

  const cancelarSaida = () => {
    setShowExitWarning(false)
  }

  console.log('🎨 Renderizando componente...')
  console.log('📊 Estado atual:', { loading, error, perguntas: perguntas.length, questionario: !!questionario })

  if (loading) {
    return (
      <DashboardLayout showSidebar={false}>
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-600">Carregando questionário...</div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !questionario) {
    return (
      <DashboardLayout showSidebar={false}>
        <div className="max-w-5xl mx-auto">
          <Card className="p-6 bg-red-50 border-red-200">
            <p className="text-red-800">{error || 'Questionário não encontrado'}</p>
            <Button onClick={() => navigate('/dashboard/questionarios')} className="mt-4">
              Voltar
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  if (perguntas.length === 0) {
    return (
      <DashboardLayout showSidebar={false}>
        <div className="max-w-5xl mx-auto">
          <Card className="p-6 bg-yellow-50 border-yellow-200">
            <h3 className="text-lg font-bold text-yellow-800 mb-2">⚠️ Nenhuma pergunta encontrada</h3>
            <p className="text-yellow-700 mb-4">
              Este questionário não possui perguntas cadastradas ainda.
            </p>
            <div className="text-sm text-yellow-600 mb-4">
              <p>Debug info:</p>
              <p>• Questionário ID: {questionnaireId}</p>
              <p>• Versão: {version}</p>
              <p>• Título: {questionario?.titulo}</p>
            </div>
            <Button onClick={() => navigate('/dashboard/questionarios')}>
              Voltar
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout showSidebar={false}>
      <div className="max-w-5xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={handleVoltarClick}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200 font-medium border border-gray-300 hover:border-gray-400"
            >
              <span className="text-lg">←</span>
              Voltar
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-black text-psy mb-2">
                {questionario.titulo}
              </h1>
              <p className="text-gray-600">
                {questionario.descricao}
              </p>
            </div>
          </div>

          {/* Barra de progresso */}
          <div className="bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-safe h-2 rounded-full transition-all duration-300"
              style={{ width: `${progresso}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Pergunta {perguntaAtual + 1} de {perguntas.length}</span>
            <span>{Math.round(progresso)}% completo</span>
          </div>
        </div>

        {/* Pergunta atual */}
        {(() => {
          const pergunta = perguntas[perguntaAtual]
          if (!pergunta) return null

          return (
            <Card className="p-8">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-safe text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">
                    {perguntaAtual + 1}
                  </span>
                  <h3 className="text-xl font-bold text-gray-800">
                    {pergunta.conteudo}
                  </h3>
                </div>
                {pergunta.subescala && (
                  <p className="text-sm text-gray-500 ml-13 mb-2">
                    Subescala: {pergunta.subescala.nome}
                  </p>
                )}
              </div>

              {/* Opções de resposta - Horizontal */}
              <div className="ml-13">
                <div className="grid grid-cols-5 gap-3">
                  {[1, 2, 3, 4, 5].map((valorOpcao) => {
                    const isSelected = respostas[pergunta.id] === valorOpcao
                    const opcaoTexto = pergunta.subescala?.tipoResposta?.[`opcao${valorOpcao}` as keyof typeof pergunta.subescala.tipoResposta] || `Opção ${valorOpcao}`

                    return (
                      <label
                        key={valorOpcao}
                        className={`flex flex-col items-center p-4 rounded-lg border cursor-pointer transition-all text-center ${
                          isSelected
                            ? 'border-safe bg-safe/5 text-safe'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`pergunta-${pergunta.id}`}
                          value={valorOpcao}
                          checked={isSelected}
                          onChange={(e) => handleRespostaChange(pergunta.id, parseInt(e.target.value))}
                          className="w-4 h-4 text-safe border-gray-300 focus:ring-safe mb-2"
                        />
                        <span className="text-2xl font-bold mb-1">{valorOpcao}</span>
                        <span className="text-xs leading-tight">{opcaoTexto}</span>
                      </label>
                    )
                  })}
                </div>
                {pergunta.subescala?.tipoResposta && (
                  <p className="text-xs text-gray-500 mt-4 text-center">
                    {pergunta.subescala.tipoResposta.opcao1} ←→ {pergunta.subescala.tipoResposta.opcao5}
                  </p>
                )}
              </div>
            </Card>
          )
        })()}

        {/* Botões de navegação */}
        <div className="mt-8 flex justify-between">
          <Button
            variant="outline"
            size="lg"
            onClick={perguntaAnterior}
            disabled={perguntaAtual === 0}
            className="min-w-[120px]"
          >
            ← Anterior
          </Button>

          {ehUltimaPergunta ? (
            <Button
              variant="primary"
              size="lg"
              onClick={handleSubmit}
              disabled={!perguntaAtualRespondida || isSubmitting}
              className="min-w-[200px]"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Enviando...
                </>
              ) : (
                '📤 Enviar Respostas'
              )}
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              onClick={proximaPergunta}
              disabled={!perguntaAtualRespondida}
              className="min-w-[120px]"
            >
              Próxima →
            </Button>
          )}
        </div>

        {/* Indicador de pergunta obrigatória */}
        {!perguntaAtualRespondida && (
          <div className="mt-4 text-center">
            <p className="text-orange-600 text-sm">
              ⚠️ Responda a pergunta atual para continuar
            </p>
          </div>
        )}

        {/* Instruções */}
        <Card className="mt-6 p-6 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-bold text-blue-800 mb-3">💡 Instruções importantes</h3>
          <div className="text-blue-700 text-sm space-y-2">
            <p>• Responda com sinceridade - suas respostas são confidenciais</p>
            <p>• Escolha a opção que melhor representa sua percepção</p>
            <p>• Não há respostas certas ou erradas, apenas suas opiniões</p>
            <p>• Complete todas as perguntas antes de enviar</p>
            {questionario.tempoEstimado && <p>• Tempo estimado: {questionario.tempoEstimado}</p>}
            <p>• Versão: {version === 'curta' ? 'Curta (~20 perguntas)' : version === 'media' ? 'Média (~50 perguntas)' : 'Longa (completa)'}</p>
          </div>
        </Card>
      </div>

      {/* Modal de confirmação de saída */}
      {showExitWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Sair do Questionário?
              </h3>
              <p className="text-gray-600 mb-6">
                Você tem respostas não salvas que serão perdidas se sair agora.
                Tem certeza que deseja continuar?
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={cancelarSaida}
                  className="px-6"
                >
                  Continuar Respondendo
                </Button>
                <Button
                  variant="danger"
                  onClick={confirmarSaida}
                  className="px-6"
                >
                  Sair e Perder Respostas
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}