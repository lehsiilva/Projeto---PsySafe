import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import DashboardLayout from '../../components/DashboardLayout'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'

export default function GestorDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'overview' | 'scheduled' | 'results'>('overview')

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-psy mb-2">
            Dashboard Gestor
          </h1>
          <p className="text-gray-600">
            Olá, <span className="font-medium text-safe">{user?.name}</span>! Gerencie questionários e acompanhe resultados da equipe.
          </p>

        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-safe text-safe'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Visão Geral
              </button>
              <button
                onClick={() => setActiveTab('scheduled')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'scheduled'
                    ? 'border-safe text-safe'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Questionários Agendados
              </button>
              <button
                onClick={() => setActiveTab('results')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'results'
                    ? 'border-safe text-safe'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Resultados
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Schedule Questionnaire Card */}
            <Card className="p-6 bg-gradient-to-br from-safe/5 to-safe/10 border-safe/20">
              <div className="w-12 h-12 bg-safe rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl text-white">📋</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Agendar Questionário</h3>
              <p className="text-gray-600 text-sm mb-4">
                Agende o questionário de avaliação de riscos psicossociais para sua equipe.
              </p>
              <Button variant="primary" className="w-full" onClick={() => setActiveTab('scheduled')}>
                Agendar Questionário
              </Button>
            </Card>

            {/* View Results Card */}
            <Card className="p-6 bg-gradient-to-br from-psy/5 to-psy/10 border-psy/20">
              <div className="w-12 h-12 bg-psy rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl text-white">📊</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Ver Resultados</h3>
              <p className="text-gray-600 text-sm mb-4">
                Acompanhe os resultados das avaliações realizadas pela equipe.
              </p>
              <Button variant="outline" className="w-full" onClick={() => setActiveTab('results')}>
                Ver Resultados
              </Button>
            </Card>

            {/* Manage Team Card */}
            <Card className="p-6 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
              <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl text-white">👥</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Gerenciar Equipe</h3>
              <p className="text-gray-600 text-sm mb-4">
                Gerencie os membros da sua equipe e seus papéis no sistema.
              </p>
              <Button variant="outline" className="w-full">
                Gerenciar Equipe
              </Button>
            </Card>
          </div>
        )}

        {activeTab === 'scheduled' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Questionários Disponíveis</h2>
              <Button variant="primary">
                📋 Agendar Novo Questionário
              </Button>
            </div>

            {/* Available Questionnaire */}
            <Card className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Avaliação de Riscos Psicossociais - NR-1
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Questionário completo para avaliação de conformidade com a Norma Regulamentadora NR-1.
                    Inclui 25 perguntas sobre diversos aspectos do ambiente de trabalho.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Perguntas:</span> 25
                    </div>
                    <div>
                      <span className="font-medium">Tempo estimado:</span> 15 min
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> <span className="text-green-600">Disponível</span>
                    </div>
                    <div>
                      <span className="font-medium">Última atualização:</span> 15/01/2024
                    </div>
                  </div>
                </div>
                <div className="ml-6">
                  <Button variant="primary" size="lg">
                    📅 Agendar Questionário
                  </Button>
                </div>
              </div>
            </Card>

            {/* Scheduling Info */}
            <Card className="p-6 bg-blue-50 border-blue-200">
              <h3 className="text-lg font-bold text-blue-800 mb-2">💡 Como funciona o agendamento</h3>
              <div className="text-blue-700 text-sm space-y-2">
                <p>• O questionário será enviado automaticamente para todos os funcionários da empresa</p>
                <p>• Os funcionários receberão uma notificação para responder</p>
                <p>• Você poderá acompanhar o progresso em tempo real na aba "Resultados"</p>
                <p>• Os resultados serão consolidados automaticamente após o término do período</p>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Resultados dos Questionários</h2>
              <Button variant="outline">
                📊 Exportar Relatórios
              </Button>
            </div>

            {/* No scheduled questionnaires message */}
            <Card className="p-8 text-center bg-gray-50">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Nenhum questionário agendado ainda
              </h3>
              <p className="text-gray-600 mb-6">
                Agende seu primeiro questionário para começar a acompanhar os resultados da equipe.
              </p>
              <Button variant="primary" onClick={() => setActiveTab('scheduled')}>
                📅 Agendar Questionário
              </Button>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
