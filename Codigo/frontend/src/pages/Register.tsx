import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import authService from '../services/authService'

interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

interface RegisterResponse {
  success: boolean
  message: string
  user?: {
    id: string
    email: string
    name: string
  }
  token?: string
}

export default function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isDemoMode, setIsDemoMode] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Nome é obrigatório')
      return false
    }
    if (!formData.email) {
      setError('Email é obrigatório')
      return false
    }
    if (!formData.email.includes('@')) {
      setError('Email deve ser válido')
      return false
    }
    if (!formData.password) {
      setError('Senha é obrigatória')
      return false
    }
    if (formData.password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setError('')
    setSuccessMessage('')

    try {
      let response: any

      if (isDemoMode) {
        // Registro simulado para demo
        await new Promise(resolve => setTimeout(resolve, 1500))
        const mockUser = {
          id: 'demo-user-123',
          name: formData.name.trim(),
          email: formData.email,
          role: 'gestor'
        }
        const mockToken = 'demo-jwt-token-12345'
        response = { success: true, token: mockToken, user: mockUser }
      } else {
        // Chamada real da API
        response = await authService.register({
          name: formData.name.trim(),
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        })
      }

      if (response.success) {
        // Mostrar mensagem de sucesso
        setSuccessMessage('Conta criada com sucesso! Redirecionando para login...')
        // Limpar dados do formulário
        setFormData({ name: '', email: '', password: '', confirmPassword: '' })

        // Redirecionar após 2 segundos
        setTimeout(() => {
          navigate('/login')
        }, 5000)
      } else {
        setError(response.message || 'Erro ao criar conta')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta')
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
          <h2 className="text-3xl font-black text-psy mb-2">Criar conta</h2>
          <p className="text-gray-600">Junte-se ao PsySafe e comece a gerenciar riscos psicossociais</p>
        </div>

        {/* Register Form */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-psy mb-2">Nome completo</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-safe focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                placeholder="Seu nome completo"
                disabled={isLoading}
              />
            </div>

            {/* Email */}
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

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-psy mb-2">Senha</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-safe focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                placeholder="••••••••"
                disabled={isLoading}
              />
              <p className="mt-1 text-xs text-gray-500">Mínimo 6 caracteres</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-psy mb-2">Confirmar senha</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-safe focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                <div className="flex items-center gap-2">⚠️ {error}</div>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
                ✅ {successMessage}
              </div>
            )}

            {/* Submit Button */}
            <Button type="submit" variant="primary" className="w-full text-lg py-4 font-bold" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Criando conta...
                </div>
              ) : '🚀 CRIAR CONTA'}
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


          {/* Login Link */}
          <div className="mt-6 text-center">
            <div className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link to="/login" className="font-medium text-safe hover:text-safe/80 transition-colors duration-200">
                Fazer login
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>© 2025 PsySafe. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  )
}
