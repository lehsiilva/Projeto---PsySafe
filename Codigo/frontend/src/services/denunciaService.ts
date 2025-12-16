import apiClient from './apiClient'

export interface Denuncia {
  id: number
  titulo: string
  descricao: string
  tipo: string
  data: string
  resolvido: boolean
  anonima: boolean
  denunciante?: string
  denunciado: string
}

export interface CreateDenunciaRequest {
  titulo: string
  descricao: string
  tipo: string
  anonima: boolean
  denunciado: string
}

export const denunciaService = {
  /**
   * Listar todas as denúncias recebidas (gestores)
   */
  async getDenuncias(): Promise<Denuncia[]> {
    // requiresAuth = true garante envio do token
    const response = await apiClient.get<Denuncia[]>('/api/denuncias/recebidas', true)
    return response // já retorna os dados do backend
  },

  /**
   * Obter uma denúncia pelo ID
   */
  async getDenunciaById(id: number): Promise<Denuncia> {
    const response = await apiClient.get<Denuncia>(`/api/denuncias/${id}`, true)
    return response
  },

  /**
   * Criar denúncia (anonima ou não)
   */
  async createDenuncia(data: CreateDenunciaRequest, token?: string): Promise<Denuncia> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await apiClient.post<Denuncia>('/api/denuncias', data, {
      headers,
      requiresAuth: !!token // se token fornecido, envia Authorization
    })
    return response
  },

  /**
   * Alterar status "resolvido" de uma denúncia
   */
  async toggleResolvido(id: number, currentStatus: boolean): Promise<Denuncia> {
    const newStatus = !currentStatus

    const response = await apiClient.put<Denuncia>(
      `/api/denuncias/${id}/status`,
      { resolvido: newStatus },
      { requiresAuth: true }
    )
    return response
  }
}
