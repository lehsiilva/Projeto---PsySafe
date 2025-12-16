import apiClient from './apiClient'

export interface Questionario {
  // Campos possíveis do backend
  id?: number
  idQuestionario?: number  // ⚠️ Campo adicional caso venha do Java
  titulo: string
  descricao: string
  ativo: boolean
  dataCriacao: string
  dataEncerramento?: string
  totalPerguntas: number
  tempoEstimado: string
  versao: 'curta' | 'media' | 'longa'
}

// Helper function para normalizar o ID
function normalizeQuestionario(q: any): Questionario {
  return {
    ...q,
    id: q.id || q.idQuestionario || 0 // Usa id ou idQuestionario, fallback para 0
  }
}

export interface TipoResposta {
  id: number
  nome: string
  descricao: string
  opcao1: string
  opcao2: string
  opcao3: string
  opcao4: string
  opcao5: string
}

export interface Subescala {
  id: number
  nome: string
  descricao: string
  ordem: number
  tipoResposta: TipoResposta
}

export interface Pergunta {
  id: number
  conteudo: string
  numero: number
  subescala: Subescala
}

export interface RespostaItem {
  idPergunta: number
  valor: number
}

export interface RespostaRequest {
  respostas: RespostaItem[]
}

export interface RespostaDetalhe {
  idPergunta: number
  conteudoPergunta: string
  valor: number
}

export interface SubescalaResultado {
  nomeSubescala: string
  mediaRespostas: number
  totalPerguntas: number
  respostas: RespostaDetalhe[]
}

export interface ResultadoQuestionario {
  idQuestionario: number
  tituloQuestionario: string
  idUsuario: number
  nomeUsuario: string
  dataResposta: string
  totalPerguntas: number
  perguntasRespondidas: number
  completo: boolean
  resultadosPorSubescala: Record<string, SubescalaResultado>
}

export interface AgendamentoRequest {
  idQuestionario: number
  versao: 'curta' | 'media' | 'longa'
  dataInicio: string
  dataFim: string
  departamentos: string[]
}

export interface Agendamento {
  id: number
  idQuestionario: number
  tituloQuestionario: string
  idGestor: number
  nomeGestor: string
  versao: 'curta' | 'media' | 'longa'
  dataInicio: string
  dataFim: string
  departamentos: string[]
  ativo: boolean
  totalParticipantes: number
  totalRespostas: number
  createdAt: string
}

export const questionarioService = {
  async getAllQuestionarios(): Promise<Questionario[]> {
    const response: any = await apiClient.get('/api/questionarios', true)
    // Normaliza os questionários para garantir que tenham o campo 'id'
    return (response.data || []).map(normalizeQuestionario)
  },

  async getQuestionarioById(id: number): Promise<Questionario> {
    const response: any = await apiClient.get(`/api/questionarios/${id}`, true)
    return normalizeQuestionario(response.data)
  },

  async getPerguntasForQuestionario(id: number): Promise<Pergunta[]> {
    const response: any = await apiClient.get(`/api/questionarios/${id}/perguntas`, true)
    return response.data
  },

  async responderQuestionario(id: number, respostas: RespostaRequest): Promise<void> {
    await apiClient.post(`/api/questionarios/${id}/responder`, respostas, true)
  },

  async getResultados(): Promise<ResultadoQuestionario[]> {
    const response: any = await apiClient.get('/api/questionarios/resultados', true)
    return response.data
  },

  async agendarQuestionario(request: AgendamentoRequest): Promise<Agendamento> {
    const response: any = await apiClient.post('/api/questionarios/schedule', request, true)
    return response.data
  },

  async getAgendamentos(): Promise<Agendamento[]> {
    const response: any = await apiClient.get('/api/questionarios/scheduled', true)
    return response.data
  },

  async getAgendamentosAtivos(): Promise<Agendamento[]> {
    const response: any = await apiClient.get('/api/questionarios/scheduled/active', true)
    return response.data
  },

  async cancelarAgendamento(id: number): Promise<any> {
    console.log('🔧 Service: Cancelando agendamento ID:', id)
    const response = await apiClient.delete(`/api/questionarios/scheduled/${id}`, true)
    console.log('🔧 Service: Resposta do delete:', response)
    return response
  },

  async getResultadosAgendamento(id: number): Promise<any> {
    const response: any = await apiClient.get(`/api/questionarios/scheduled/${id}/resultados`, true)
    return response.data
  }
}