import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import Card from '../../components/ui/Card'
import { useAuth } from '../../contexts/AuthContext'
import { empresaService, EmpresaData, Equipe, MembroEquipe } from '../../services/empresaService'
import { denunciaService, Denuncia } from '../../services/denunciaService'

export default function Empresa() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const isGestor = user?.role === 'gestor'

  const [empresa, setEmpresa] = useState<EmpresaData | null>(null)
  const [gestores, setGestores] = useState<MembroEquipe[]>([])
  const [equipes, setEquipes] = useState<Equipe[]>([])
  const [denuncias, setDenuncias] = useState<Denuncia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const teamsPerPage = 1

  useEffect(() => {
    loadEmpresaData()
  }, [])

  const loadEmpresaData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [empresaData, gestoresData, equipesData] = await Promise.all([
        empresaService.getMyEmpresa(),
        empresaService.getGestores(),
        empresaService.getEquipes()
      ])

      setEmpresa(empresaData)
      setGestores(gestoresData)
      setEquipes(equipesData)

      if (isGestor) {
        // ✔ Correção: agora pega /api/denuncias/recebidas corretamente
        const denunciasData = await denunciaService.getDenuncias()
        setDenuncias(denunciasData || [])
      }
    } catch (err: any) {
      console.error('Erro ao carregar dados da empresa:', err)
      setError(err.response?.data?.message || 'Erro ao carregar dados da empresa')
    } finally {
      setLoading(false)
    }
  }

  const handleDenunciaClick = (membro: MembroEquipe) => {
    navigate('/dashboard/denuncia', {
      state: { membroDenunciado: membro }
    })
  }

  const handleToggleResolvido = async (id: number) => {
    try {
      await denunciaService.toggleResolvido(id)
      await loadEmpresaData()
    } catch (err: any) {
      console.error('Erro ao atualizar denúncia:', err)
      alert('Erro ao atualizar status da denúncia')
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-600">Carregando dados da empresa...</div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <Card className="p-6 bg-red-50 border-red-200">
            <p className="text-red-800">{error}</p>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  if (!empresa) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <Card className="p-6">
            <p className="text-gray-600">Empresa não encontrada</p>
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
          <h1 className="text-3xl font-black text-psy mb-2">
            Informações da Empresa
          </h1>
          <p className="text-gray-600">
            Dados corporativos e configurações da organização
          </p>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Company Info */}
        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Dados Gerais</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Nome:</span>
              <span className="font-medium text-gray-800">{empresa.nome}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">CNPJ:</span>
              <span className="font-medium text-gray-800">{empresa.cnpj}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Setor:</span>
              <span className="font-medium text-gray-800">{empresa.setor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Funcionários:</span>
              <span className="font-medium text-gray-800">{empresa.numeroFuncionarios}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Fundação:</span>
              <span className="font-medium text-gray-800">
                {new Date(empresa.dataFundacao).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        </Card>

        {/* Contact Info */}
        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Contato</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Endereço:</span>
              <span className="font-medium text-gray-800 text-right">{empresa.endereco}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Telefone:</span>
              <span className="font-medium text-gray-800">{empresa.telefone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium text-gray-800">{empresa.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Responsável RH:</span>
              <span className="font-medium text-gray-800">{empresa.responsavelRH}</span>
            </div>
          </div>
        </Card>

        {/* Gestores Section */}
        <Card className="p-4">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Equipe de Gestão</h3>
          <div className="space-y-3">
            {gestores.length > 0 ? (
              gestores.map((gestor) => (
                <div key={gestor.id} className="border-b border-gray-200 last:border-b-0 pb-3 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-800 truncate">{gestor.nome}</div>
                      <div className="text-sm text-gray-600 truncate">{gestor.cargo}</div>
                      <div className="text-sm text-gray-500 truncate">{gestor.email}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Nenhum gestor encontrado</p>
            )}
          </div>
        </Card>

        {/* Equipe Section */}
        <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Equipes da Empresa</h3>
          {equipes.length > 0 ? (
            (() => {
              const totalPages = Math.ceil(equipes.length / teamsPerPage)
              const startIndex = (currentPage - 1) * teamsPerPage
              const endIndex = startIndex + teamsPerPage
              const currentTeams = equipes.slice(startIndex, endIndex)
              
              return (
            <>
              <div className="space-y-6">
                {currentTeams.map((equipe) => (
                  <div key={equipe.idEquipe} className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0">
                    <h4 className="font-semibold text-gray-800 mb-3 text-lg">{equipe.nome}</h4>
                    <div className="space-y-3">
                      {equipe.membros.map((membro) => (
                        <div key={membro.id} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">{membro.nome}</div>
                            <div className="text-sm text-gray-600">{membro.cargo}</div>
                          </div>
                          {!isGestor && (
                            <button
                              onClick={() => handleDenunciaClick(membro)}
                              className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200"
                            >
                              Denúncia
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-4 flex flex-col items-center space-y-2">
                  <div className="text-sm text-gray-600">
                    Equipe {currentPage} de {equipes.length}
                  </div>
                  <div className="flex justify-center items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 rounded-lg text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm"
                    >
                      ← Anterior
                    </button>

                    <div className="flex space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 shadow-sm ${
                            currentPage === page
                              ? 'bg-safe text-white hover:bg-safe/90'
                              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 rounded-lg text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm"
                    >
                      Próximo →
                    </button>
                  </div>
                </div>
              )}
            </>
              )
            })()
          ) : (
            <p className="text-gray-500 text-sm">Nenhuma equipe encontrada</p>
          )}
        </Card>

        {/* Denúncias Section */}
        {isGestor && (
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Denúncias Recebidas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {denuncias.length > 0 ? (
                  denuncias.map((denuncia) => (
                    <div key={denuncia.id} className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-semibold text-gray-800 text-lg leading-tight">{denuncia.titulo}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                          denuncia.resolvido ? 'bg-green-100 text-green-800 border border-green-200' :
                          'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        }`}>
                          {denuncia.resolvido ? 'Resolvido' : 'Em análise'}
                        </span>
                      </div>

                      <p className="text-gray-700 text-sm mb-5 leading-relaxed">{denuncia.descricao}</p>

                      <div className="border-t border-gray-100 pt-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center">
                              <span className="text-gray-500 font-medium">Tipo:</span>
                              <span className="ml-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold">
                                {denuncia.tipo}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-gray-500 font-medium">Data:</span>
                              <span className="ml-1 text-gray-700 font-semibold">
                                {new Date(denuncia.data).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                            {denuncia.anonima ? (
                              <div className="flex items-center text-orange-600">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span className="font-semibold">Denúncia Anônima</span>
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <span className="text-gray-500 font-medium">Denunciante:</span>
                                <span className="ml-1 text-gray-700 font-semibold">{denuncia.denunciante}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex space-x-2">
                            <button
                              onClick={() => navigate(`/dashboard/denuncias/${denuncia.id}`, { state: { denuncia } })}
                              className="bg-safe hover:bg-safe/90 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 shadow-sm hover:shadow-md"
                            >
                              Ver Detalhes
                            </button>
                            <button 
                              onClick={() => handleToggleResolvido(denuncia.id)}
                              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 shadow-sm hover:shadow-md"
                            >
                              {denuncia.resolvido ? 'Reabrir' : 'Resolver'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-lg font-medium">Nenhuma denúncia encontrada</p>
                    <p className="text-sm">As denúncias recebidas aparecerão aqui</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Bottom section */}
        {isGestor && (
          <>
            {/* Subscription Info */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Assinatura</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plano:</span>
                  <span className="font-medium text-safe">{empresa.planoAtivo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600">Ativo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Validade:</span>
                  <span className="font-medium text-gray-800">
                    {new Date(empresa.validadePlano).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <button className="w-full bg-safe hover:bg-safe/90 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 mt-4">
                  Renovar Plano
                </button>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Estatísticas Rápidas</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{equipes.length}</div>
                  <div className="text-sm text-gray-600">Equipes</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{gestores.length}</div>
                  <div className="text-sm text-gray-600">Gestores</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {denuncias.filter(d => !d.resolvido).length}
                  </div>
                  <div className="text-sm text-gray-600">Denúncias Pendentes</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{denuncias.length}</div>
                  <div className="text-sm text-gray-600">Total Denúncias</div>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
      </div>
    </DashboardLayout>
  )
}
