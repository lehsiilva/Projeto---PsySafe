import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Button from '../components/ui/Button'
import { useAuth } from '../contexts/AuthContext'

interface LoginFormData {
  email: string
  senha: string
}

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, updateUser } = useAuth()
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    senha: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isDemoMode, setIsDemoMode] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError('')
  }

  const validateForm = (): boolean => {
    if (!formData.email) {
      setError('Email é obrigatório')
      return false
    }
    if (!formData.email.includes('@')) {
      setError('Email deve ser válido')
      return false
    }
    if (!formData.senha) {
      setError('Senha é obrigatória')
      return false
    }
    if (formData.senha.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setError('')

    try {
      if (isDemoMode) {
        // Demo mode simulado
        await new Promise(resolve => setTimeout(resolve, 1000))

        const demoUser = {
          id: 'demo-user-123',
          name: 'Usuário Demo',
          email: formData.email,
          role: 'gestor'
        }
        const demoToken = 'demo-jwt-token-12345'

        // Atualiza AuthContext
        updateUser(demoUser)

        // Armazena token e usuário no localStorage
        localStorage.setItem('authToken', demoToken)
        localStorage.setItem('user', JSON.stringify(demoUser))
      } else {
        // Login real via AuthContext
        await login(formData.email, formData.senha)
        // login() já atualiza token, user e localStorage
      }

      const intendedPath = location.state?.from?.pathname || '/dashboard/perfil'
      navigate(intendedPath, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro de conexão. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-psy/5 via-safe/5 to-accent/5 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-3 mb-8">
            <div className="text-3xl font-black">
              <span className="text-safe">Psy</span><span className="text-psy">Safe</span>
            </div>
          </Link>
          <h2 className="text-3xl font-black text-psy mb-2">Bem-vindo de volta</h2>
          <p className="text-gray-600">Entre na sua conta para acessar o sistema</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-psy mb-2">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-safe focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                placeholder="seu@email.com"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="senha" className="block text-sm font-semibold text-psy mb-2">Senha</label>
              <input
                id="senha"
                name="senha"
                type="password"
                required
                value={formData.senha}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-safe focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                <div className="flex items-center gap-2">⚠️ {error}</div>
              </div>
            )}

            <Button type="submit" variant="primary" className="w-full text-lg py-4 font-bold" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Entrando...
                </div>
              ) : '🔐 ENTRAR'}
            </Button>
          </form>

		  {/* Demo Mode Toggle */}
		  {false && (
		    <div className="mt-4 text-center">
		      <button
		        type="button"
		        onClick={() => setIsDemoMode(!isDemoMode)}
		        className={`text-xs px-3 py-1 rounded-full transition-colors duration-200 ${
		          isDemoMode
		            ? 'bg-green-100 text-green-700 border border-green-300'
		            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
		        }`}
		      >
		        {isDemoMode ? '🎭 Demo Mode (ON)' : '🎭 Demo Mode (OFF)'}
		      </button>
		      <p className="text-xs text-gray-500 mt-1">
		        {isDemoMode ? 'Login simulado - sem backend' : 'Login real - requer backend'}
		      </p>
		    </div>
		  )}


          {/* Links */}
          <div className="mt-6 text-center space-y-4">
            <div className="text-sm text-gray-600">
              <Link to="/forgot-password" className="font-medium text-safe hover:text-safe/80 transition-colors duration-200">Esqueceu sua senha?</Link>
            </div>
            <div className="text-sm text-gray-600">
              Não tem uma conta?{' '}
              <Link to="/register" className="font-medium text-safe hover:text-safe/80 transition-colors duration-200">Criar conta</Link>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>© 2025 PsySafe. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  )
}
