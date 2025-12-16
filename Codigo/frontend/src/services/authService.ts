import apiClient from './apiClient'

interface LoginRequest {
  email: string
  password: string
}

interface RegisterRequest {
  name: string
  email: string
  password: string
  confirmPassword: string
}

interface AuthResponse {
  success: boolean
  message: string
  user?: {
    id: string
    name: string
    email: string
    role?: string
    createdAt?: string
  }
  token?: string
}

interface User {
  id: string
  name: string
  email: string
  role?: string
  createdAt?: string
}

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const data = await apiClient.post<AuthResponse>('/api/auth/login', credentials)
      
      // Store token and user if login successful
      if (data.success && data.token && data.user) {
        localStorage.setItem('authToken', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
      }
      
      return data
    } catch (error) {
      console.error('Login error:', error)
      throw error instanceof Error ? error : new Error('Erro de conexão. Verifique sua internet e tente novamente.')
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      // Validar se as senhas coincidem
      if (userData.password !== userData.confirmPassword) {
        throw new Error('As senhas não coincidem')
      }

      const data = await apiClient.post<AuthResponse>('/api/auth/register', userData)
      
      // Store token and user if registration successful
      if (data.success && data.token && data.user) {
        localStorage.setItem('authToken', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
      }
      
      return data
    } catch (error) {
      console.error('Register error:', error)
      throw error instanceof Error ? error : new Error('Erro ao criar conta')
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/auth/logout', {}, true)
    } catch (error) {
      console.error('Erro no logout:', error)
      // Não lançar erro no logout - apenas limpar dados locais
    } finally {
      // Sempre limpar localStorage
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
    }
  }

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const updated = await apiClient.post<UserProfile>('/api/auth/update-profile', updates, true)
      // Atualiza localStorage também
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}')
      const newUser = { ...storedUser, ...updates }
      localStorage.setItem('user', JSON.stringify(newUser))
      return updated
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      throw new Error('Erro ao atualizar perfil')
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    try {
      const token = localStorage.getItem('authToken')

      if (!token) {
        throw new Error('No token found')
      }

      const data = await apiClient.post<AuthResponse>('/api/auth/refresh', {}, true)

      if (data.success && data.token) {
        localStorage.setItem('authToken', data.token)
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user))
        }
      }

      return data
    } catch (error) {
      console.error('Erro na renovação do token:', error)
      // Limpar tokens inválidos
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      throw error
    }
  }

  async getCurrentUser(): Promise<UserProfile | null> {
    const user = await apiClient.get('/api/auth/me', true)
    if (!user) return null
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || 'user',
      cargo: user.cargo || '',
      departamento: user.departamento || '',
      telefone: user.telefone || '',
      idEmpresa: user.idEmpresa || '',
      dataAdmissao: user.dataAdmissao || '',
      ultimoLogin: user.ultimoLogin || '',
    }
  }


  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      return await apiClient.post('/api/auth/forgot-password', { email })
    } catch (error) {
      console.error('Forgot password error:', error)
      throw new Error('Erro ao enviar email de recuperação')
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      return await apiClient.post('/api/auth/reset-password', { token, password: newPassword })
    } catch (error) {
      console.error('Reset password error:', error)
      throw new Error('Erro ao redefinir senha')
    }
  }

  // Método utilitário para verificar se o usuário está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken')
    const user = localStorage.getItem('user')
    return !!(token && user)
  }

  // Método utilitário para obter token armazenado
  getToken(): string | null {
    return localStorage.getItem('authToken')
  }

  // Método utilitário para obter usuário armazenado
  getStoredUser(): User | null {
    try {
      const userStr = localStorage.getItem('user')
      return userStr ? JSON.parse(userStr) : null
    } catch {
      return null
    }
  }
}

export const authService = new AuthService()
export default authService
