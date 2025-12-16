import React, { useState, useEffect } from 'react'
import { denunciaService } from '../../services/denunciaService'

import { useNavigate, useLocation } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import Card from '../../components/ui/Card'

export default function Denuncia() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [formData, setFormData] = useState({
    descricao: '',
    tipo: 'Comportamental',
    denunciado: ''
  })

  useEffect(() => {
    // Pré-preencher o campo denunciado se informações do membro forem passadas
    if (location.state?.membroDenunciado) {
      const membro = location.state.membroDenunciado
      setFormData(prev => ({
        ...prev,
        denunciado: `${membro.nome} - ${membro.cargo}`
      }))
    }
  }, [location.state])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const denunciaData = {
        titulo: formData.descricao.slice(0, 50), // título opcional
        descricao: formData.descricao,
        tipo: formData.tipo,
        denunciado: formData.denunciado,
        anonima: isAnonymous
      }

      await denunciaService.createDenuncia(denunciaData)

      alert('Denúncia enviada com sucesso!')
      navigate('/dashboard/empresa')
    } catch (error) {
      console.error('Erro ao enviar denúncia:', error)
      alert('Erro ao enviar denúncia. Tente novamente.')
    }
  }


  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-black text-psy mb-2">
                Registrar Denúncia
              </h1>
              <p className="text-gray-600">
                Reportar irregularidades ou comportamentos inadequados de forma segura
              </p>
              {location.state?.membroDenunciado && (
                <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm text-orange-800">
                    <strong>Denúncia pré-selecionada:</strong> {location.state.membroDenunciado.nome} - {location.state.membroDenunciado.cargo}
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={() => navigate('/dashboard/empresa')}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              ← Voltar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Detalhes da Denúncia</h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tipo de denúncia */}
                <div>
                  <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Denúncia *
                  </label>
                  <select
                    id="tipo"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-safe focus:border-transparent"
                    required
                  >
                    <option value="Comportamental">Comportamental</option>
                    <option value="Assédio">Assédio</option>
                    <option value="Discriminação">Discriminação</option>
                    <option value="Infraestrutura">Infraestrutura</option>
                    <option value="Ética">Ética</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                {/* Descrição */}
                <div>
                  <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição Detalhada *
                  </label>
                  <textarea
                    id="descricao"
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-safe focus:border-transparent"
                    placeholder="Descreva em detalhes o que aconteceu, quando, onde, quem estava envolvido..."
                    required
                  />
                </div>

                {/* Pessoa/Área denunciada */}
                <div>
                  <label htmlFor="denunciado" className="block text-sm font-medium text-gray-700 mb-2">
                    Pessoa ou Área Denunciada *
                  </label>
                  <input
                    type="text"
                    id="denunciado"
                    name="denunciado"
                    value={formData.denunciado}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-safe focus:border-transparent"
                    placeholder="Nome da pessoa ou departamento/setor"
                    required
                  />
                </div>

                {/* Botão de envio */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg font-semibold transition-colors duration-200"
                  >
                    Enviar Denúncia
                  </button>
                </div>
              </form>
            </Card>
          </div>

          {/* Barra lateral */}
          <div className="space-y-6">
            {/* Tipo de denúncia - Anônima ou não */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Tipo de Denúncia</h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="anonymous"
                    checked={!isAnonymous}
                    onChange={() => setIsAnonymous(false)}
                    className="mr-3 text-safe focus:ring-safe"
                  />
                  <div>
                    <div className="font-medium text-gray-800">Identificada</div>
                    <div className="text-sm text-gray-600">Sua identidade será revelada</div>
                  </div>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="anonymous"
                    checked={isAnonymous}
                    onChange={() => setIsAnonymous(true)}
                    className="mr-3 text-safe focus:ring-safe"
                  />
                  <div>
                    <div className="font-medium text-gray-800">Anônima</div>
                    <div className="text-sm text-gray-600">Sua identidade será protegida</div>
                  </div>
                </label>
              </div>
            </Card>

            {/* Informações importantes */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Informações Importantes</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• Todas as denúncias são tratadas com confidencialidade</p>
                <p>• Denúncias anônimas são protegidas e não revelam sua identidade</p>
                <p>• Forneça o máximo de detalhes possível para uma investigação eficaz</p>
                <p>• Você receberá atualizações sobre o status da sua denúncia</p>
                <p>• A identidade do denunciante é obtida automaticamente do sistema</p>
              </div>
            </Card>


          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
