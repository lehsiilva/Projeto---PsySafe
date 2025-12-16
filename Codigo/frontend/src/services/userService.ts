import apiClient from './apiClient'

export interface UserProfile {
  id: string
  name: string
  email: string
  role?: string
  cargo?: string
  telefone?: string
  departamento?: string
  equipe?: string
  dataAdmissao?: string
  idEmpresa?: string
  ultimoLogin?: string
}

// Método para obter o usuário atual
export const getCurrentUser = async (): Promise<UserProfile> => {
  const response = await apiClient.get<{ success: boolean; user: UserProfile }>('/api/auth/me', true)
  if (!response.success) throw new Error('Não foi possível obter dados do usuário')
  return response.user
}

// Novo método para atualizar perfil
const updateProfile = async (data: Partial<UserProfile>): Promise<UserProfile> => {
  const response = await apiClient.put<{ success: boolean; user: UserProfile }>(
    '/api/auth/update',
    data,
    true // envia token
  )
  if (!response.success) throw new Error('Não foi possível atualizar o perfil')
  return response.user
}

export const userService = {
  getCurrentUser,
  updateProfile
}
//estavel