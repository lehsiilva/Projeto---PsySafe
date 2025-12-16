import React from 'react'
import Card from './ui/Card'

const audience = [
  {
    title: 'Gestores de RH',
    desc: 'Monitoramento de indicadores e decisões estratégicas baseadas em dados.',
    icon: '👥',
    color: 'blue'
  },
  {
    title: 'Membros da CIPA',
    desc: 'Identificação precoce de riscos e implementação de ações preventivas.',
    icon: '🛡️',
    color: 'green'
  },
  {
    title: 'Colaboradores',
    desc: 'Participam de avaliações anônimas e acompanham seu bem-estar organizacional.',
    icon: '👤',
    color: 'purple'
  },
  {
    title: 'Alta Gestão',
    desc: 'Visão executiva dos riscos psicossociais e impactos nos resultados da empresa.',
    icon: '👔',
    color: 'orange'
  }
]

export default function Audience(){
  return (
    <section id="audience" className="content container mb-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl lg:text-5xl font-black text-psy mb-4">
          Para <span className="text-safe">Quem</span> é o PsySafe?
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Uma solução completa para todos os níveis da organização
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {audience.map((person, index) => (
          <Card key={person.title} className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 text-center border-t-4 border-t-accent">
            <div className="absolute top-0 right-0 w-16 h-16 bg-accent/10 rounded-full -translate-y-8 translate-x-8 opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>

            <div className="relative z-10 py-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 ${
                person.color === 'blue' ? 'bg-blue-100' :
                person.color === 'green' ? 'bg-green-100' :
                person.color === 'purple' ? 'bg-purple-100' :
                'bg-orange-100'
              }`}>
                {person.icon}
              </div>

              <h5 className="text-xl font-bold text-gray-800 mb-3">{person.title}</h5>
              <p className="text-gray-600 leading-relaxed text-sm">{person.desc}</p>

              <div className="mt-4 flex justify-center">
                <div className="w-8 h-1 bg-gradient-to-r from-safe to-accent rounded-full"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
