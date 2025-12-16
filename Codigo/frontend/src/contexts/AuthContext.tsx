import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string
  role?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  switchRole: (role: 'gestor' | 'funcionario') => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar dados de autenticação armazenados ao iniciar o app
    const storedToken = localStorage.getItem('authToken')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setToken(storedToken)
        setUser(userData)
      } catch (error) {
        console.error('Erro ao analisar dados de usuário armazenados:', error)
        // Limpar dados inválidos
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
      }
    } else {
      // Modo demo: criar usuário demo se não existirem dados armazenados
      const isDemoMode = import.meta.env?.VITE_DEMO_MODE === 'true'
      if (isDemoMode) {
        const demoUser: User = {
          id: 'demo-user-123',
          name: 'Usuário Demo',
          email: 'demo@psysafe.com',
          role: 'gestor' // Função padrão para demo
        }
        const demoToken = 'demo-jwt-token-12345'

        setToken(demoToken)
        setUser(demoUser)

        // Armazenar no localStorage
        localStorage.setItem('authToken', demoToken)
        localStorage.setItem('user', JSON.stringify(demoUser))

        console.log('🎭 Modo demo: Usuário demo criado com função "gestor"')
      }
    }

    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4567'
      const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Falha no login')
      }

      const data = await response.json()

      if (data.success && data.token && data.user) {
        // Armazenar dados de autenticação
        localStorage.setItem('authToken', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))

        setToken(data.token)
        setUser(data.user)
      } else {
        throw new Error(data.message || 'Falha no login')
      }
    } catch (error) {
      console.error('Erro de login:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4567'
      const storedToken = localStorage.getItem('authToken')
      
      if (storedToken) {
        await fetch(`${apiBaseUrl}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json',
          }
        }).catch(err => console.error('Logout request failed:', err))
      }
    } catch (error) {
      console.error('Erro no logout:', error)
    } finally {
      // Sempre limpar dados armazenados
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')

      // Limpar estado
      setToken(null)
      setUser(null)
    }
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
  }

  const switchRole = (role: 'gestor' | 'funcionario') => {
    if (user) {
      const updatedUser = { ...user, role }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      console.log(`🎭 Demo mode: Switched role to "${role}"`)
    }
  }

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    logout,
    updateUser,
    switchRole
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
