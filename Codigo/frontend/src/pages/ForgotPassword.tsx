import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import authService from '../services/authService'

interface ForgotPasswordFormData {
  email: string
}

export default function ForgotPassword() {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Limpar mensagens quando o usuário começar a digitar
    if (message) setMessage('')
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
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setError('')
    setMessage('')

    try {
      let response: any

      if (isDemoMode) {
        // Recuperação de senha simulada para fins de demonstração
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simular delay da API

        response = {
          success: true,
          message: `Email de recuperação enviado para ${formData.email}! (Demo Mode)`
        }
      } else {
        // Chamada real da API
        response = await authService.forgotPassword(formData.email)
      }

      if (response.success) {
        setIsSuccess(true)
        setMessage(response.message || 'Email de recuperação enviado com sucesso!')
      } else {
        setError(response.message || 'Erro ao enviar email de recuperação')
      }
    } catch (err) {
      if (isDemoMode) {
        // Mesmo no modo demo, mostrar sucesso
        setTimeout(() => {
          setIsSuccess(true)
          setMessage(`Email de recuperação enviado para ${formData.email}! (Demo Mode)`)
        }, 100)
      } else {
        setError(err instanceof Error ? err.message : 'Erro de conexão. Tente novamente.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = () => {
    setIsSuccess(false)
    setMessage('')
    setError('')
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

          <h2 className="text-3xl font-black text-psy mb-2">
            Recuperar Senha
          </h2>
          <p className="text-gray-600">
            Digite seu email para receber instruções de recuperação
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-8">
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-psy mb-2">
                  Email
                </label>
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
                <p className="mt-1 text-xs text-gray-500">
                  Enviaremos um link para redefinir sua senha
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  <div className="flex items-center gap-2">
                    <span>⚠️</span>
                    {error}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                className="w-full text-lg py-4 font-bold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Enviando...
                  </div>
                ) : (
                  '📧 ENVIAR EMAIL DE RECUPERAÇÃO'
                )}
              </Button>
            </form>
          ) : (
            /* Success State */
            <div className="text-center space-y-6">
              {/* Success Icon */}
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">✅</span>
              </div>

              {/* Success Message */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-800">
                  Email Enviado!
                </h3>
                <p className="text-gray-600">
                  {message}
                </p>
                <p className="text-sm text-gray-500">
                  Verifique sua caixa de entrada e a pasta de spam.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  variant="primary"
                  className="w-full text-base py-3 font-semibold"
                  onClick={handleResend}
                >
                  🔄 ENVIAR NOVAMENTE
                </Button>

                <Link to="/login">
                  <Button
                    variant="outline"
                    className="w-full text-base py-3"
                  >
                    ← VOLTAR AO LOGIN
                  </Button>
                </Link>
              </div>
            </div>
          )}

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


          {/* Additional Links */}
          <div className="mt-6 text-center">
            <div className="text-sm text-gray-600">
              Lembrou sua senha?{' '}
              <Link
                to="/login"
                className="font-medium text-safe hover:text-safe/80 transition-colors duration-200"
              >
                Fazer login
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>© 2024 PsySafe. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  )
}
