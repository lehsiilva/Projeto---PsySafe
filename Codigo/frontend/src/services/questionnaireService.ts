interface Questionnaire {
  id: string
  titulo: string
  descricao: string
  status: string
  perguntas: number
  tempoEstimado: string
  ultimaAtualizacao: string
  participantes: number
}

interface ScheduledQuestionnaire {
  id: string
  titulo: string
  descricao: string
  dataAgendamento: string
  prazo: string
  status: string
  perguntas: number
  tempoEstimado: string
  participantesPrevistos: number
  participantesRespondidos: number
}

interface SchedulingRequest {
  titulo: string
  descricao: string
  departamentos: string[]
  dataInicio: string
  dataFim: string
  enviarLembrete: boolean
  lembreteDias: number
  enviarNotificacao: boolean
  prioridade: string
  questionnaireId?: string
}

/**
 * Interface para requisição de agendamento de questionários
 * Removidos campos: funcionarios e observacoes
 * @interface SchedulingRequest
 */

interface SchedulingResponse {
  success: boolean
  message: string
  scheduledQuestionnaire?: {
    id: string
    titulo: string
    status: string
    dataAgendamento: string
    prazo: string
    participantesPrevistos: number
  }
}

interface QuestionnairesResponse {
  success: boolean
  questionnaires: Questionnaire[]
  scheduledQuestionnaires: ScheduledQuestionnaire[]
}

class QuestionnaireService {
  private baseURL = '/api'

  private getHeaders() {
    const token = localStorage.getItem('authToken')
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    }
  }

  private get isDemoMode() {
    return (import.meta as any).env?.VITE_DEMO_MODE === 'true'
  }

  async getQuestionnaires(): Promise<QuestionnairesResponse> {
    try {
      const response = await fetch(`${this.baseURL}/questionnaires`, {
        method: 'GET',
        headers: this.getHeaders()
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erro ao obter questionários:', error)
      throw new Error('Erro ao carregar questionários. Verifique sua conexão e tente novamente.')
    }
  }

  async scheduleQuestionnaire(schedulingData: SchedulingRequest): Promise<SchedulingResponse> {
    // Modo Demo: simular agendamento sem backend
    if (this.isDemoMode) {
      console.log('🎭 Modo Demo: Simulando agendamento de questionário')
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simular delay

      return {
        success: true,
        message: 'Questionário agendado com sucesso! (Modo Demonstração)',
        scheduledQuestionnaire: {
          id: `demo-sched-${Date.now()}`,
          titulo: schedulingData.titulo,
          status: 'agendado',
          dataAgendamento: schedulingData.dataInicio,
          prazo: schedulingData.dataFim,
          participantesPrevistos: schedulingData.departamentos.length * 5 // Estimativa de 5 funcionários por departamento
        }
      }
    }

    // Modo Produção: fazer chamada real para API
    try {
      const response = await fetch(`${this.baseURL}/questionnaires/schedule`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(schedulingData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erro ao agendar questionário:', error)
      throw error instanceof Error ? error : new Error('Erro ao agendar questionário')
    }
  }

  async getScheduledQuestionnaires(): Promise<{ success: boolean; scheduledQuestionnaires: ScheduledQuestionnaire[] }> {
    try {
      const response = await fetch(`${this.baseURL}/questionnaires/scheduled`, {
        method: 'GET',
        headers: this.getHeaders()
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erro ao obter questionários agendados:', error)
      throw new Error('Erro ao carregar questionários agendados')
    }
  }

  async cancelScheduledQuestionnaire(scheduledId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseURL}/questionnaires/scheduled/${scheduledId}/cancel`, {
        method: 'PATCH',
        headers: this.getHeaders()
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Cancel scheduled questionnaire error:', error)
      throw error instanceof Error ? error : new Error('Erro ao cancelar agendamento')
    }
  }

  async getQuestionnaireById(questionnaireId: string): Promise<{ success: boolean; questionnaire: Questionnaire }> {
    // Modo Demo: retornar dados mock
    if (this.isDemoMode) {
      console.log('🎭 Modo Demo: Retornando dados mock de questionário')
      await new Promise(resolve => setTimeout(resolve, 200)) // Simular delay

      return {
        success: true,
        questionnaire: {
          id: questionnaireId,
          titulo: 'Avaliação de Riscos Psicossociais - NR-1 (Demo)',
          descricao: 'Questionário completo para avaliação de conformidade NR-1 - Modo Demonstração',
          status: 'ativo',
          perguntas: 25,
          tempoEstimado: '15 min',
          ultimaAtualizacao: new Date().toISOString().split('T')[0],
          participantes: 45
        }
      }
    }

    // Modo Produção: fazer chamada real para API
    try {
      const response = await fetch(`${this.baseURL}/questionnaires/${questionnaireId}`, {
        method: 'GET',
        headers: this.getHeaders()
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erro ao obter questionário por ID:', error)
      throw new Error('Erro ao carregar questionário')
    }
  }

  async getDepartments(): Promise<{ success: boolean; departments: Array<{ id: string; name: string; employeeCount: number }> }> {
    // Modo Demo: retornar dados mock
    if (this.isDemoMode) {
      console.log('🎭 Modo Demo: Retornando dados mock de departamentos')
      await new Promise(resolve => setTimeout(resolve, 300)) // Simular delay

      return {
        success: true,
        departments: [
          { id: '1', name: 'Tecnologia da Informação', employeeCount: 25 },
          { id: '2', name: 'Recursos Humanos', employeeCount: 8 },
          { id: '3', name: 'Financeiro', employeeCount: 12 },
          { id: '4', name: 'Operações', employeeCount: 30 },
          { id: '5', name: 'Marketing', employeeCount: 6 }
        ]
      }
    }

    // Modo Produção: fazer chamada real para API
    try {
      const response = await fetch(`${this.baseURL}/departments`, {
        method: 'GET',
        headers: this.getHeaders()
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erro ao obter departamentos:', error)
      throw new Error('Erro ao carregar departamentos')
    }
  }

  async getEmployees(): Promise<{ success: boolean; employees: Array<{ id: string; name: string; department: string; email: string }> }> {
    // Modo Demo: retornar dados mock
    if (this.isDemoMode) {
      console.log('🎭 Modo Demo: Retornando dados mock de funcionários')
      await new Promise(resolve => setTimeout(resolve, 400)) // Simular delay

      return {
        success: true,
        employees: [
          { id: '1', name: 'Maria Silva', department: '1', email: 'maria.silva@empresa.com' },
          { id: '2', name: 'Carlos Santos', department: '1', email: 'carlos.santos@empresa.com' },
          { id: '3', name: 'Ana Costa', department: '2', email: 'ana.costa@empresa.com' },
          { id: '4', name: 'João Oliveira', department: '3', email: 'joao.oliveira@empresa.com' },
          { id: '5', name: 'Pedro Lima', department: '4', email: 'pedro.lima@empresa.com' }
        ]
      }
    }

    // Modo Produção: fazer chamada real para API
    try {
      const response = await fetch(`${this.baseURL}/employees`, {
        method: 'GET',
        headers: this.getHeaders()
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Erro ao obter funcionários:', error)
      throw new Error('Erro ao carregar funcionários')
    }
  }
}

export const questionnaireService = new QuestionnaireService()
export default questionnaireService
