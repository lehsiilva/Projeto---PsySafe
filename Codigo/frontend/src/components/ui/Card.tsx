import React from 'react'

export default function Card({ children, className = '', variant = 'default' }: any){
  const baseStyles = 'bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 transition-all duration-300 hover:shadow-xl'

  const variantStyles = {
    default: 'p-6',
    feature: 'p-8 hover:-translate-y-1',
    demo: 'p-8 text-center hover:-translate-y-1',
    audience: 'p-6 text-center hover:-translate-y-1'
  }

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  )
}
