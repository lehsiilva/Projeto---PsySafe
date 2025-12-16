import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Button from './ui/Button'

// Função de rolagem suave com cálculo de offset melhorado
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    // Obter a altura real do cabeçalho dinamicamente
    const header = document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : 100; // Fallback para 100px
    const buffer = 20; // Pequeno buffer para garantir que o conteúdo seja totalmente visível

    // Calcular a posição exata para rolar
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerHeight - buffer;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

export default function Header(){
  const navigate = useNavigate()
  const location = useLocation()

  const handleLoginClick = () => {
    navigate('/login')
  }

  const handleNavClick = (sectionId: string) => {
    // Se já estivermos na página inicial, rolar para a seção
    if (window.location.pathname === '/') {
      scrollToSection(sectionId)
    } else {
      // Navegar para a página inicial com a âncora da seção
      navigate(`/#${sectionId}`)
    }
  }

  const handleHomeClick = () => {
    navigate('/')
  }

  // Verificar se estamos em páginas do dashboard
  const isDashboardPage = location.pathname.startsWith('/dashboard')

  // Não renderizar navegação em páginas do dashboard

  return (
    <header className="w-full bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="container flex items-center justify-between py-4 lg:py-6">
        {/* Branding da empresa melhorado - ocultar no dashboard */}
        {!isDashboardPage && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleHomeClick}
              className="text-2xl lg:text-3xl font-black hover:opacity-80 transition-opacity duration-200"
            >
              <span className="text-safe">Psy</span><span className="text-psy">Safe</span>
            </button>
            <div className="hidden sm:block h-6 w-px bg-gradient-to-b from-safe to-accent opacity-50"></div>
            <span className="hidden sm:block text-sm font-medium text-gray-600">Psicossocial</span>
          </div>
        )}

        {/* Navegação melhorada */}
        <nav className="flex items-center gap-6">
          {!isDashboardPage && (
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => handleNavClick('features')}
                className="text-gray-700 hover:text-safe font-medium transition-colors duration-200 relative group cursor-pointer"
              >
                Recursos
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-safe transition-all duration-300 group-hover:w-full"></span>
              </button>
              <button
                onClick={() => handleNavClick('audience')}
                className="text-gray-700 hover:text-safe font-medium transition-colors duration-200 relative group cursor-pointer"
              >
                Para Quem
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-safe transition-all duration-300 group-hover:w-full"></span>
              </button>
              <button
                onClick={() => handleNavClick('demo')}
                className="text-gray-700 hover:text-safe font-medium transition-colors duration-200 relative group cursor-pointer"
              >
                Demonstração
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-safe transition-all duration-300 group-hover:w-full"></span>
              </button>
            </div>
          )}

          {/* Botão de login melhorado - ocultar no dashboard */}
          {!isDashboardPage && (
            <Button
              variant="primary"
              className="font-bold px-6 py-2.5 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              onClick={handleLoginClick}
            >
              🔐 LOGIN
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}
