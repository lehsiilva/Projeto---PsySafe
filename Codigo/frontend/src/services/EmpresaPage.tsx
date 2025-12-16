import React, { useEffect, useState } from 'react'
import { empresaService, EmpresaData, MembroEquipe, Equipe } from './empresaService'
import { denunciaService, Denuncia } from './denunciaService'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom' // Importar useNavigate

export const EmpresaPage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const role = user?.role?.toLowerCase() || ''
  const isGestor = role === 'gestor'

  const [empresa, setEmpresa] = useState<EmpresaData | null>(null)
  const [gestores, setGestores] = useState<MembroEquipe[]>([])
  const [equipes, setEquipes] = useState<Equipe[]>([])
  const [denuncias, setDenuncias] = useState<Denuncia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedDenuncia, setSelectedDenuncia] = useState<Denuncia | null>(null)

  // 🔹 Carrega todos os dados da empresa
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const empresaData = await empresaService.getMyEmpresa()
        setEmpresa(empresaData)

        const gestoresData = await empresaService.getGestores()
        setGestores(gestoresData)

        const equipesData = await empresaService.getEquipes()
        setEquipes(equipesData)

        if (isGestor) {
          const denunciasData = await denunciaService.getDenuncias()
          // DADOS ESTÃO CHEGANDO AQUI
          setDenuncias(denunciasData) 
        }

        setLoading(false)
      } catch (err: any) {
        console.error(err)
        setError(err.message || 'Erro ao carregar dados')
        setLoading(false)
      }
    }

    if (user) fetchData()
  }, [user, isGestor])

  /**
   * 🛑 CORRIGIDO: Chama denunciaService.toggleResolvido
   */
  const handleToggleStatus = async (id: number, resolvido: boolean) => {
    try {
      // Chama o método corrigido (PUT /status)
      const updatedDenuncia = await denunciaService.toggleResolvido(id, resolvido) 
      
      // Atualiza o estado local com o objeto retornado
      setDenuncias(prev =>
        prev.map(d => (d.id === id ? updatedDenuncia : d))
      )
    } catch (err) {
      console.error('Erro ao atualizar status:', err)
      alert('Erro ao atualizar status. Verifique se você tem permissão.')
    }
  }

  // Função auxiliar para ver detalhes (usaremos o Modal)
  const handleViewDetails = (denuncia: Denuncia) => {
    setSelectedDenuncia(denuncia);
  };
  
  if (loading) return <p>Carregando...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>
  if (!empresa) return <p>Empresa não encontrada</p>

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px' }}>Dados da Empresa</h1>

      {/* ... (Seções de Dados Gerais, Contato, Equipe de Gestão, Equipes - inalteradas) ... */}

      {/* 🔸 Denúncias (somente gestor) */}
      {isGestor && (
        <section style={{ marginTop: '40px' }}>
          <h2>📢 Denúncias Recebidas</h2>

          {/* 🛑 NOVO BLOCO DE RENDERIZAÇÃO ESTRUTURADA */}
          <div style={{ 
            border: '1px solid #e0e0e0', 
            borderRadius: '8px', 
            padding: '20px', 
            backgroundColor: '#fff' 
          }}>

            {denuncias.length === 0 ? (
              // 1. Mensagem de vazio (corresponde ao bloco da imagem)
              <div style={{ textAlign: 'center', padding: '30px' }}>
                <p style={{ fontWeight: 'bold' }}>Nenhuma denúncia encontrada.</p>
                <p style={{ color: '#888' }}>As denúncias recebidas aparecerão aqui.</p>
              </div>
            ) : (
              // 2. Tabela visível para os 11 dados
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                      <tr style={{ borderBottom: '2px solid #ccc' }}>
                          <th style={{ textAlign: 'left', padding: '10px 0' }}>ID</th>
                          <th style={{ textAlign: 'left', padding: '10px 0' }}>Título</th>
                          <th style={{ textAlign: 'left', padding: '10px 0' }}>Tipo</th>
                          <th style={{ textAlign: 'left', padding: '10px 0' }}>Status</th>
                          <th style={{ textAlign: 'left', padding: '10px 0' }}>Ações</th>
                      </tr>
                  </thead>
                  <tbody>
                      {denuncias.map(d => (
                          <tr key={d.id} style={{ borderBottom: '1px dotted #e0e0e0' }}>
                              <td style={{ padding: '10px 0' }}>{d.id}</td>
                              <td style={{ padding: '10px 0', fontWeight: 'bold' }}>{d.titulo || `Sem Título #${d.id}`}</td>
                              <td style={{ padding: '10px 0' }}>{d.tipo}</td>
                              <td style={{ padding: '10px 0' }}>
                                  <span style={{ 
                                      color: d.resolvido ? 'green' : 'orange', 
                                      fontWeight: 'bold' 
                                  }}>
                                      {d.resolvido ? 'Resolvido' : 'Em Análise'}
                                  </span>
                              </td>
                              <td style={{ padding: '10px 0' }}>
                                  <button
                                      style={{ /* ... estilos ... */ }}
                                      onClick={() => handleViewDetails(d)}
                                  >
                                      Detalhes
                                  </button>
                                  <button
                                      style={{ /* ... estilos ... */ }}
                                      onClick={() => handleToggleStatus(d.id, d.resolvido)}
                                  >
                                      {d.resolvido ? 'Reabrir' : 'Marcar Resolvida'}
                                  </button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
            )}
          </div>
        </section>
      )}

      {/* 🔸 Modal simples de detalhes - INALTERADO */}
      {selectedDenuncia && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '10px',
            maxWidth: '500px'
          }}>
            <h2>Detalhes da Denúncia</h2>
            <p><strong>Descrição:</strong> {selectedDenuncia.descricao}</p>
            <p><strong>Denunciado:</strong> {selectedDenuncia.denunciado}</p>
            <p><strong>Data:</strong> {new Date(selectedDenuncia.data).toLocaleDateString('pt-BR')}</p>
            {selectedDenuncia.anonima ? (
              <p><strong>Denunciante:</strong> Anônimo</p>
            ) : (
              <p><strong>Denunciante:</strong> {selectedDenuncia.denunciante}</p>
            )}

            <button
              style={{
                marginTop: '15px',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '8px 15px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedDenuncia(null)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}