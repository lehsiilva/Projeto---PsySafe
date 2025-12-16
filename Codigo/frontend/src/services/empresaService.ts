import apiClient from './apiClient'

export interface EmpresaData {
  idEmpresa: number
  nome: string
  cnpj: string
  endereco: string
  telefone: string
  email: string
  setor: string
  numeroFuncionarios: number
  dataFundacao: string
  responsavelRH: string
  planoAtivo: string
  validadePlano: string
}

export interface MembroEquipe {
  id: number
  nome: string
  cargo: string
  email: string
}

export interface Equipe {
  idEquipe: number
  nome: string
  membros: MembroEquipe[]
}

export const empresaService = {
  async getMyEmpresa(): Promise<EmpresaData> {
    return await apiClient.get('/api/empresas/me', true)
  },

  async getGestores(): Promise<MembroEquipe[]> {
    return await apiClient.get('/api/empresas/me/gestores', true)
  },

  async getEquipes(): Promise<Equipe[]> {
    return await apiClient.get('/api/empresas/me/equipes', true)
  }

}
