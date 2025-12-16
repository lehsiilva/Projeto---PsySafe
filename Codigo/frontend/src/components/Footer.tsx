import React from 'react'

export default function Footer(){
  return (
    <footer className="bg-gradient-to-r from-psy/5 to-safe/5 border-t border-gray-200">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl font-black">
                <span className="text-safe">Psy</span><span className="text-psy">Safe</span>
              </div>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              Sistema avançado de gestão e monitoramento de riscos psicossociais,
              ajudando empresas a cumprir a NR-1 com tecnologia de ponta.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>100% Conformidade NR-1</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-gray-800 mb-4">Produto</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-600 hover:text-safe transition-colors duration-200">Recursos</a></li>
              <li><a href="#demo" className="text-gray-600 hover:text-safe transition-colors duration-200">Demonstração</a></li>
              <li><a href="#audience" className="text-gray-600 hover:text-safe transition-colors duration-200">Para Quem</a></li>
              <li><a href="#" className="text-gray-600 hover:text-safe transition-colors duration-200">Preços</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-800 mb-4">Suporte</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-safe transition-colors duration-200">Documentação</a></li>
              <li><a href="#" className="text-gray-600 hover:text-safe transition-colors duration-200">Central de Ajuda</a></li>
              <li><a href="#" className="text-gray-600 hover:text-safe transition-colors duration-200">Contato</a></li>
              <li><a href="#" className="text-gray-600 hover:text-safe transition-colors duration-200">Status</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-600">
              © {new Date().getFullYear()} PsySafe. Todos os direitos reservados.
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-500 hover:text-safe transition-colors duration-200">Privacidade</a>
              <a href="#" className="text-gray-500 hover:text-safe transition-colors duration-200">Termos</a>
              <a href="#" className="text-gray-500 hover:text-safe transition-colors duration-200">Contato</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
