import React, { useState, useEffect } from 'react'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from "recharts";
import robo from '../../assets/Robozin-removebg-preview.png'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Audience from '../components/Audience'
import Footer from '../components/Footer'
import Card from '../components/ui/Card'

// Dados mockados para estatísticas
const DADOS_ESTATISTICAS_MOCK = {
  totalAvaliacoes: 8,
  mediaRiscos: 67,
  nivelConformidade: 33,
  alertasAtivos: 6,
  distribuicao: [
    { nivel: "Baixo", colaboradores: 2, cor: "#9AE6B4" },
    { nivel: "Crítico", colaboradores: 4, cor: "#FCA5A5" },
    { nivel: "Alto", colaboradores: 2, cor: "#FCD34D" },
    { nivel: "Médio", colaboradores: 0, cor: "#D1D5DB" }
  ],
  topDepartamentos: [
    { nome: "Marketing", avaliacoes: 3, risco: 54 },
    { nome: "TI", avaliacoes: 3, risco: 78 },
    { nome: "Suporte Técnico", avaliacoes: 2, risco: 64 }
  ],
  alertasRecentes: [
    {
      titulo: "Risco Alto Detectado",
      departamento: "TI",
      descricao: "Departamento de TI apresenta risco psicossocial elevado (4,1/5 - 78%). 3 funcionário(s) afetado(s).",
      data: "26/11/2025",
      status: "Pendente",
      cor: "#EF4444"
    },
    {
      titulo: "Risco Alto Detectado",
      departamento: "Suporte Técnico",
      descricao: "Departamento de Suporte Técnico apresenta risco psicossocial elevado (3,6/5 - 64%). 2 funcionário(s) afetado(s).",
      data: "26/11/2025",
      status: "Pendente",
      cor: "#F97316"
    }
  ]
};

// Componente do Dashboard Completo
function DashboardModal({ onClose }) {
  const [periodoSelecionado, setPeriodoSelecionado] = useState("6 Meses");
  const stats = DADOS_ESTATISTICAS_MOCK;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col my-4">
        {/* Header do Modal */}
        <div className="flex items-center justify-between p-6 bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
          <div>
            <h2 className="text-3xl font-black text-gray-800">
              Estatísticas e Relatórios
            </h2>
            <p className="text-sm text-gray-600">Análise detalhada dos dados de riscos psicossociais</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <span className="text-3xl text-gray-600">×</span>
          </button>
        </div>

        {/* Conteúdo do Dashboard */}
        <div className="flex-1 overflow-auto p-6">
          {/* Filtros de Período */}
          <div className="flex gap-3 mb-6">
            {["30 Dias", "3 Meses", "6 Meses", "1 Ano"].map((periodo) => (
              <button
                key={periodo}
                onClick={() => setPeriodoSelecionado(periodo)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  periodoSelecionado === periodo
                    ? "bg-pink-500 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {periodo}
              </button>
            ))}
          </div>

          {/* Cards de Estatísticas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-white hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total de Avaliações</p>
                  <h3 className="text-4xl font-bold text-gray-800">{stats.totalAvaliacoes}</h3>
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">📋</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Média de Riscos</p>
                  <h3 className="text-4xl font-bold text-yellow-600">{stats.mediaRiscos}%</h3>
                </div>
                <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">⚠️</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Nível de Conformidade</p>
                  <h3 className="text-4xl font-bold text-green-600">{stats.nivelConformidade}%</h3>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">✅</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Alertas Ativos</p>
                  <h3 className="text-4xl font-bold text-red-600">{stats.alertasAtivos}</h3>
                </div>
                <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">🔔</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Grid de Distribuição e Top Departamentos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Distribuição de Riscos */}
            <Card className="p-6 bg-white">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Distribuição de Riscos</h3>
              <div className="space-y-4">
                {stats.distribuicao.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.cor }}
                        ></span>
                        <span className="font-semibold text-gray-700">{item.nivel}</span>
                      </div>
                      <span className="text-gray-600">{item.colaboradores} colaboradores</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(item.colaboradores / 8) * 100}%`,
                          backgroundColor: item.cor
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Top Departamentos */}
            <Card className="p-6 bg-white">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Top Departamentos</h3>
              <div className="space-y-4">
                {stats.topDepartamentos.map((dept, idx) => (
                  <div key={idx} className="border-l-4 border-pink-400 pl-4 py-2 bg-pink-50 rounded-r-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-pink-200 rounded-full flex items-center justify-center text-xs font-bold text-pink-700">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-gray-800">{dept.nome}</span>
                      </div>
                      <span className="text-sm text-gray-600">{dept.avaliacoes} avaliações</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-600">Risco: </span>
                      <span className="font-bold text-orange-600">{dept.risco}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Alertas Recentes */}
          <Card className="p-6 bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Alertas Recentes</h3>
              <span className="text-sm text-gray-500 flex items-center gap-2">
                <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
                Ações geradas por IA
              </span>
            </div>
            
            <div className="space-y-4">
              {stats.alertasRecentes.map((alerta, idx) => (
                <div key={idx} className="border-l-4 p-4 rounded-r-lg" style={{ borderColor: alerta.cor, backgroundColor: `${alerta.cor}10` }}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: alerta.cor }}
                      ></div>
                      <h4 className="font-bold text-gray-800">{alerta.titulo}</h4>
                    </div>
                    <span className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold">
                      {alerta.status}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-3">{alerta.descricao}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span>{alerta.departamento}</span>
                      <span>•</span>
                      <span>{alerta.data}</span>
                    </div>
                    <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2">
                      <span>🤖</span>
                      Gerar Ação com IA
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
// Componente Principal Landing
export default function Landing(){
  const [showDashboard, setShowDashboard] = useState(false)
  const [showVideo, setShowVideo] = useState(false)

  return (
    <div className="page-root min-h-screen">
      <Header />
      <main>
        <Hero />
        <section id="features" className="content container mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-black text-psy mb-4">
              Por que <span className="text-safe">PsySafe</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transformando a gestão de riscos psicossociais com tecnologia avançada e conformidade total
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-l-4 border-l-red-400 bg-gradient-to-br from-red-50 to-white">
              <div className="absolute top-0 right-0 w-20 h-20 bg-red-100 rounded-full -translate-y-10 translate-x-10 opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">O Problema</h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Empresas enfrentam <strong className="text-red-600">dificuldade em identificar riscos psicossociais</strong>,
                  falta de métricas claras e <strong className="text-red-600">processos manuais</strong> que atrasam ações preventivas,
                  impactando a produtividade e o bem-estar dos colaboradores.
                </p>
              </div>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-l-4 border-l-green-400 bg-gradient-to-br from-green-50 to-white">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-100 rounded-full -translate-y-10 translate-x-10 opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">✅</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">A Solução</h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">
                  <strong className="text-safe font-semibold">PsySafe</strong> oferece <strong className="text-green-600">avaliações padronizadas</strong>,
                  dashboards interativos, <strong className="text-green-600">alertas automáticos</strong> e
                  recomendações baseadas em <strong className="text-green-600">dados e IA</strong> para mitigar riscos
                  de forma proativa e eficiente.
                </p>
              </div>
            </Card>
          </div>
        </section>
        <Features />
        <Audience />
        <section id="demo" className="content container mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-black text-psy mb-4">
              Veja o <span className="text-safe">PsySafe</span> em Ação
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore nossa plataforma completa e descubra como revolucionamos a gestão de riscos psicossociais
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-white border-t-4 border-t-blue-400">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-full -translate-y-12 translate-x-12 opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative z-10 text-center py-8">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📊</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Dashboard Interativo</h3>
                <p className="text-gray-600 mb-6">
                  Visualizações avançadas com gráficos dinâmicos, filtros inteligentes e relatórios em tempo real
                </p>
                <button 
                  onClick={() => setShowDashboard(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-300"
                >
                  Ver Demonstração
                </button>
              </div>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-white border-t-4 border-t-purple-400">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100 rounded-full -translate-y-12 translate-x-12 opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="relative z-10 text-center py-8">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎥</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Vídeo Demonstrativo</h3>
                <p className="text-gray-600 mb-6">
                  Tour completo pela plataforma mostrando todas as funcionalidades e benefícios do PsySafe
                </p>
                <button 
                  onClick={() => setShowVideo(true)}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-300"
                >
                  Assistir Vídeo
                </button>
              </div>
            </Card>
          </div>
        </section>

        {/* Modern stats/testimonial section */}
        <section className="content container mb-16">
          <div className="bg-gradient-to-r from-safe/10 via-accent/10 to-psy/10 rounded-3xl p-8 lg:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent"></div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Stats */}
              <div>
                <h3 className="text-3xl lg:text-4xl font-black text-psy mb-6">
                  Números que <span className="text-safe">Falam</span> por Si
                </h3>

                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-4xl lg:text-5xl font-black text-safe mb-2">98%</div>
                    <p className="text-gray-600">Conformidade NR-1</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl lg:text-5xl font-black text-accent mb-2">50%</div>
                    <p className="text-gray-600">Redução de Riscos</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl lg:text-5xl font-black text-psy mb-2">24h</div>
                    <p className="text-gray-600">Alertas em Tempo Real</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl lg:text-5xl font-black text-safe mb-2">∞</div>
                    <p className="text-gray-600">Escalabilidade</p>
                  </div>
                </div>
              </div>

              {/* Testimonial */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-safe to-accent rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">RH</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Maria Silva</h4>
                    <p className="text-sm text-gray-600">Diretora de RH - Empresa Tech</p>
                  </div>
                </div>

                <p className="text-gray-700 italic leading-relaxed mb-4">
                  "O PsySafe revolucionou nossa gestão de riscos psicossociais. Agora temos dados concretos
                  e ações preventivas que realmente fazem a diferença no bem-estar dos nossos colaboradores."
                </p>

                <div className="flex text-yellow-400">
                  {'★'.repeat(5)}
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>

      {/* Modal Dashboard */}
      {showDashboard && (
        <DashboardModal onClose={() => setShowDashboard(false)} />
      )}

      {/* Modal Vídeo */}
      {showVideo && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <h3 className="text-xl font-bold">🎥 PsySafe - Demonstração Completa</h3>
              <button
                onClick={() => setShowVideo(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-purple-700 transition-colors"
              >
                <span className="text-3xl">×</span>
              </button>
            </div>
            
            <div className="aspect-video w-full bg-black">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/nA2akjd6brM?autoplay=1"
                title="PsySafe Demonstração"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}