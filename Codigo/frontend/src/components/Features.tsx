import React from 'react'
import Card from './ui/Card'

const features = [
  {
    title: 'Questionários Validados',
    desc: 'Formulários baseados em pesquisa científica para identificar assédio, sobrecarga e causas organizacionais com precisão.',
    icon: '📋',
    color: 'blue'
  },
  {
    title: 'Dashboards Interativos',
    desc: 'Visões por setor, tendência temporal e filtros avançados para análise profunda e tomada de decisão estratégica.',
    icon: '📊',
    color: 'green'
  },
  {
    title: 'IA e Predição',
    desc: 'Modelos de predição e análise de sentimento para priorizar ações e identificar padrões antes que se tornem problemas.',
    icon: '🤖',
    color: 'purple'
  }
]

export default function Features(){
  return (
    <section className="content container mb-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl lg:text-5xl font-black text-psy mb-4">
          Recursos <span className="text-safe">Avançados</span>
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Tecnologia de ponta para gestão completa de riscos psicossociais
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={feature.title} className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 border-l-4 border-l-accent">
            <div className="absolute top-0 right-0 w-20 h-20 bg-accent/10 rounded-full -translate-y-10 translate-x-10 opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${
                  feature.color === 'blue' ? 'bg-blue-100' :
                  feature.color === 'green' ? 'bg-green-100' :
                  'bg-purple-100'
                }`}>
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-800">{feature.title}</h4>
              </div>

              <p className="text-gray-700 leading-relaxed text-base">{feature.desc}</p>

              <div className="mt-6 flex items-center text-sm text-gray-500">
                <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
                <span>Funcionalidade Ativa</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
