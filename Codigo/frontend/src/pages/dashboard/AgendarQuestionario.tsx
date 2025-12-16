import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import DatePicker from '../../components/ui/DatePicker'
import { questionarioService, Questionario } from '../../services/questionarioService'

export default function AgendarQuestionario() {
  const navigate = useNavigate()
  const location = useLocation()
  const questionnaireId = location.state?.questionnaireId

  const [questionario, setQuestionario] = useState<Questionario | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    versao: 'media' as 'curta' | 'media' | 'longa',
    dataInicio: '',
    dataFim: '',
    departamentos: [] as string[]
  })

  // Available departments (in a real app, fetch from API)
  const availableDepartments = [
    'Desenvolvimento Frontend',
    'Desenvolvimento Backend',
    'Produto e Projetos',
    'Suporte e Infraestrutura',
    'Recursos Humanos',
    'Financeiro',
    'Vendas',
    'Marketing'
  ]

  useEffect(() => {
    if (!questionnaireId) {
      navigate('/dashboard/questionarios')
      return
    }
    loadQuestionario()
  }, [questionnaireId])

  const loadQuestionario = async () => {
    try {
      setLoading(true)
      const data = await questionarioService.getQuestionarioById(questionnaireId)
      setQuestionario(data)
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar questionário')
    } finally {
      setLoading(false)
    }
  }

  const handleDepartmentToggle = (dept: string) => {
    setFormData(prev => ({
      ...prev,
      departamentos: prev.departamentos.includes(dept)
        ? prev.departamentos.filter(d => d !== dept)
        : [...prev.departamentos, dept]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.departamentos.length === 0) {
      alert('Selecione pelo menos um departamento')
      return
    }

    if (!formData.dataInicio || !formData.dataFim) {
      alert('Preencha as datas de início e fim')
      return
    }

    try {
      setSubmitting(true)
      
      await questionarioService.agendarQuestionario({
        idQuestionario: questionnaireId,
        versao: formData.versao,
        dataInicio: new Date(formData.dataInicio).toISOString(),
        dataFim: new Date(formData.dataFim).toISOString(),
        departamentos: formData.departamentos
      })

      alert('Questionário agendado com sucesso!')
      navigate('/dashboard/questionarios')
    } catch (err: any) {
      alert(err.message || 'Erro ao agendar questionário')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-600">Carregando...</div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !questionario) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <Card className="p-6 bg-red-50 border-red-200">
            <p className="text-red-800">{error || 'Questionário não encontrado'}</p>
            <Button onClick={() => navigate('/dashboard/questionarios')} className="mt-4">
              Voltar
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/dashboard/questionarios')}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200 font-medium border border-gray-300 hover:border-gray-400"
            >
              <span className="text-lg">←</span>
              Voltar
            </button>
            <div>
              <h1 className="text-3xl font-black text-psy">
                Agendar Questionário
              </h1>
              <p className="text-gray-600">
                {questionario.titulo}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Version Selection */}
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">1. Escolha a Versão</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.versao === 'curta' 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="versao"
                  value="curta"
                  checked={formData.versao === 'curta'}
                  onChange={(e) => setFormData({ ...formData, versao: e.target.value as any })}
                  className="sr-only"
                />
                <div className="text-center">
                  <div className="text-2xl mb-2">📝</div>
                  <div className="font-bold text-gray-800">Versão Curta</div>
                  <div className="text-sm text-gray-600">~20 perguntas</div>
                  <div className="text-xs text-gray-500">5-10 minutos</div>
                </div>
              </label>

              <label className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.versao === 'media' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="versao"
                  value="media"
                  checked={formData.versao === 'media'}
                  onChange={(e) => setFormData({ ...formData, versao: e.target.value as any })}
                  className="sr-only"
                />
                <div className="text-center">
                  <div className="text-2xl mb-2">📋</div>
                  <div className="font-bold text-gray-800">Versão Média</div>
                  <div className="text-sm text-gray-600">~50 perguntas</div>
                  <div className="text-xs text-gray-500">15-20 minutos</div>
                </div>
              </label>

              <label className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.versao === 'longa' 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="versao"
                  value="longa"
                  checked={formData.versao === 'longa'}
                  onChange={(e) => setFormData({ ...formData, versao: e.target.value as any })}
                  className="sr-only"
                />
                <div className="text-center">
                  <div className="text-2xl mb-2">📚</div>
                  <div className="font-bold text-gray-800">Versão Longa</div>
                  <div className="text-sm text-gray-600">119 perguntas</div>
                  <div className="text-xs text-gray-500">30-40 minutos</div>
                </div>
              </label>
            </div>
          </Card>

          {/* Department Selection */}
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              2. Selecione os Departamentos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableDepartments.map((dept) => (
                <label
                  key={dept}
                  className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.departamentos.includes(dept)
                      ? 'border-safe bg-safe/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.departamentos.includes(dept)}
                    onChange={() => handleDepartmentToggle(dept)}
                    className="w-4 h-4 text-safe border-gray-300 rounded focus:ring-safe mr-3"
                  />
                  <span className="font-medium text-gray-800">{dept}</span>
                </label>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-3">
              {formData.departamentos.length} departamento(s) selecionado(s)
            </p>
          </Card>

          {/* Date Selection */}
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">3. Defina o Período</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Início
                </label>
                <input
                  type="datetime-local"
                  value={formData.dataInicio}
                  onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-safe focus:border-safe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Fim
                </label>
                <input
                  type="datetime-local"
                  value={formData.dataFim}
                  onChange={(e) => setFormData({ ...formData, dataFim: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-safe focus:border-safe"
                  required
                />
              </div>
            </div>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard/questionarios')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
            >
              {submitting ? 'Agendando...' : '📅 Agendar Questionário'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
