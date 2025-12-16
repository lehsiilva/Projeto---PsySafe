import React from 'react'
import robot from '../../../assets/robot.png'

export default function Hero(){
  return (
    <section className="hero hero-bg relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-accent/10 to-safe/10"></div>

      <div className="container relative z-10 flex flex-col lg:flex-row items-center gap-12 py-16 lg:py-24">
        <div className="lg:w-1/2 text-center lg:text-left">
          {/* Enhanced company title with modern styling */}
          <div className="mb-8">
            <h1 className="text-7xl lg:text-8xl font-black leading-tight tracking-tight">
              <span className="text-safe">Psy</span><span className="text-psy drop-shadow-lg">Safe</span>
            </h1>
          </div>

          {/* Subtitle with better hierarchy */}
          <h2 className="text-2xl lg:text-3xl font-bold text-psy mb-6 leading-tight">
            Sistema de Gestão e Monitoramento de<br />
            <span className="text-safe">Riscos Psicossociais</span>
          </h2>

          <p className="text-lg text-gray-700 max-w-xl mb-8 leading-relaxed opacity-90">
            O <strong className="text-psy">PsySafe</strong> nasceu para ajudar empresas a cumprir a NR-1,
            centralizando e automatizando a gestão de riscos psicossociais.
            Uma solução <strong className="text-safe">simples, eficiente e segura</strong> para cuidar do bem-estar organizacional.
          </p>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap justify-center lg:justify-start items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Conformidade NR-1</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>IA Avançada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Dashboards Interativos</span>
            </div>
          </div>
        </div>

        {/* Enhanced robot image section */}
        <div className="lg:w-full flex justify-center w-full relative mt-8 lg:mt-0">
          <div className="relative w-full flex justify-center">
            {/* Glow effect behind robot */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent/30 to-safe/30 rounded-full blur-3xl scale-150 opacity-60 animate-pulse"></div>
            <img
              src={robot}
              alt="PsySafe Robot Assistant"
              className="relative z-10 w-full h-auto max-w-sm drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
              style={{ maxWidth: '384px' }}
            />
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/20 to-transparent"></div>
    </section>
  )
}
