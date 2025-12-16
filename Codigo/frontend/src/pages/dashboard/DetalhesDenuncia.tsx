import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import Card from '../../components/ui/Card'
import { denunciaService, Denuncia } from '../../services/denunciaService' // Importa o serviço e a interface

// A interface Denuncia foi movida para denunciaService.ts, mas mantida aqui por conveniência
// interface Denuncia { ... }

export default function DetalhesDenuncia() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()

  // 1. Usa o estado de navegação como valor inicial
  const initialDenuncia: Denuncia | null = location.state?.denuncia || null;
  const [currentDenuncia, setCurrentDenuncia] = useState<Denuncia | null>(initialDenuncia);
  
  // Usa currentDenuncia para o restante do componente
  const denunciaData = currentDenuncia;

  // 2. Função para alternar o status
  const handleToggleResolvido = async () => {
    if (!denunciaData) return;

    try {
      // Chama o método corrigido, passando o ID e o status atual
      const updatedDenuncia = await denunciaService.toggleResolvido(denunciaData.id, denunciaData.resolvido); 
      
      // Atualiza o estado local para refletir a mudança na UI
      setCurrentDenuncia(updatedDenuncia); 

      alert(`Status da denúncia alterado para: ${updatedDenuncia.resolvido ? 'Resolvido' : 'Em análise'}`);
    } catch (error) {
      console.error('Erro ao alternar status:', error);
      alert('Erro ao atualizar o status da denúncia.');
    }
  };


  // If no denuncia data is provided, show error
  if (!denunciaData) {
    // ... (Código para "Denúncia não encontrada" permanece o mesmo) ...
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="mb-8">
              <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Denúncia não encontrada</h1>
            <p className="text-gray-600 mb-8">Não foi possível carregar os detalhes da denúncia solicitada.</p>
            <button
              onClick={() => navigate('/dashboard/empresa')}
              className="bg-safe hover:bg-safe/90 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Voltar para Empresa
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const getStatusColor = (resolvido: boolean) => {
    return resolvido
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-yellow-100 text-yellow-800 border-yellow-200'
  }

  const getTipoIcon = (tipo: string) => {
    const iconMap: { [key: string]: string } = {
      'Comportamental': 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
      'Assédio': 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
      'Infraestrutura': 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      'Ética': 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      'Discriminação': 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z'
    }
    return iconMap[denunciaData.tipo] || 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-black text-psy mb-2">
                Detalhes da Denúncia
              </h1>
              <p className="text-gray-600">
                Informações completas sobre a denúncia #{denunciaData.id}
              </p>
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
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Informações Gerais</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold border whitespace-nowrap ${getStatusColor(denunciaData.resolvido)}`}>
                  {denunciaData.resolvido ? 'Resolvido' : 'Em análise'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                  <p className="text-gray-900 font-medium">{denunciaData.titulo}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getTipoIcon(denunciaData.tipo)} />
                    </svg>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                      {denunciaData.tipo}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data da Denúncia</label>
                  <p className="text-gray-900 font-medium">
                    {new Date(denunciaData.data).toLocaleDateString('pt-BR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Denunciado</label>
                  <p className="text-gray-900 font-medium">{denunciaData.denunciado}</p>
                </div>
              </div>
            </Card>

            {/* Description */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Descrição Detalhada</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{denunciaData.descricao}</p>
              </div>
            </Card>

            {/* Timeline/History */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Histórico</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Denúncia Registrada</div>
                    <div className="text-sm text-gray-500">
                      {new Date(denunciaData.data).toLocaleDateString('pt-BR', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>

                {!denunciaData.resolvido && (
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">Em Análise</div>
                      <div className="text-sm text-gray-500">Denúncia sendo avaliada pela equipe responsável</div>
                    </div>
                  </div>
                )}

                {denunciaData.resolvido && (
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">Resolvido</div>
                      <div className="text-sm text-gray-500">Denúncia foi tratada e resolvida</div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Resumo</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">ID da Denúncia:</span>
                  <span className="font-medium text-gray-800">#{denunciaData.id.toString().padStart(4, '0')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${getStatusColor(denunciaData.resolvido)}`}>
                    {denunciaData.resolvido ? 'Resolvido' : 'Em análise'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tipo:</span>
                  <span className="font-medium text-gray-800">{denunciaData.tipo}</span>
                </div>
                {denunciaData.anonima ? (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Natureza:</span>
                    <div className="flex items-center text-orange-600">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Anônima</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Denunciante:</span>
                    <span className="font-medium text-gray-800">{denunciaData.denunciante}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Ações</h3>
              <div className="space-y-3">
                <button 
                  onClick={handleToggleResolvido} // <-- Chama a função corrigida
                  className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200"
                >
                  {denunciaData.resolvido ? 'Reabrir Denúncia' : 'Marcar como Resolvido'}
                </button>
                <button className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200">
                  Exportar Detalhes
                </button>
              </div>
            </Card>

            {/* Important Notes */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Observações</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p>Todas as ações nesta denúncia são registradas no histórico.</p>
                </div>
                <div className="flex items-start space-x-2">
                  <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p>A confidencialidade é mantida em todas as etapas do processo.</p>
                </div>
                {denunciaData.anonima && (
                  <div className="flex items-start space-x-2">
                    <svg className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p>Esta é uma denúncia anônima - a identidade do denunciante está protegida.</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}