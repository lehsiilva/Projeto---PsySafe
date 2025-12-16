import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Páginas
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'

// Páginas do Dashboard
import Perfil from './pages/dashboard/Perfil'
import Empresa from './pages/dashboard/Empresa'
import Questionarios from './pages/dashboard/Questionarios'
import ResponderQuestionario from './pages/dashboard/ResponderQuestionario'
import Estatisticas from './pages/dashboard/Estatisticas'
import GestorDashboard from './pages/dashboard/GestorDashboard'
import FuncionarioDashboard from './pages/dashboard/FuncionarioDashboard'
import Denuncia from './pages/dashboard/Denuncia'
import DetalhesDenuncia from './pages/dashboard/DetalhesDenuncia'
import AgendarQuestionario from './pages/dashboard/AgendarQuestionario'
import QuestionarioDetalhes from './pages/dashboard/QuestionarioDetalhes'
import QuestionarioResultados from './pages/dashboard/QuestionarioResultados'
import ResultadosQuestionario from './pages/dashboard/ResultadosQuestionario'

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Rotas protegidas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/perfil"
            element={
              <ProtectedRoute>
                <Perfil />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/empresa"
            element={
              <ProtectedRoute>
                <Empresa />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/denuncia"
            element={
              <ProtectedRoute>
                <Denuncia />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/denuncias/:id"
            element={
              <ProtectedRoute>
                <DetalhesDenuncia />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/questionarios"
            element={
              <ProtectedRoute>
                <Questionarios />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/questionarios/responder"
            element={
              <ProtectedRoute>
                <ResponderQuestionario />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/questionarios/agendar"
            element={
              <ProtectedRoute>
                <AgendarQuestionario />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/questionarios/detalhes"
            element={
              <ProtectedRoute>
                <QuestionarioDetalhes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/questionarios/resultados"
            element={
              <ProtectedRoute>
                <QuestionarioResultados />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/meus-resultados"
            element={
              <ProtectedRoute>
                <ResultadosQuestionario />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/estatisticas"
            element={
              <ProtectedRoute>
                <Estatisticas />
              </ProtectedRoute>
            }
          />

          {/* Capturar tudo - redirecionar para a página inicial */}
          <Route path="*" element={<Landing />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}
