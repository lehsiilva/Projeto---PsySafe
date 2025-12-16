import React from 'react'

export default function Button({ children, variant='primary', className = '', size='md', ...rest }: any){
  const baseStyles = 'inline-flex items-center justify-center font-bold transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-opacity-50'

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm rounded-xl',
    md: 'px-6 py-3 text-base rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-xl'
  }

  const variantStyles = {
    primary: 'bg-gradient-to-r from-accent to-accent/90 text-psy shadow-lg hover:shadow-xl hover:from-accent/90 hover:to-accent focus:ring-accent/30',
    secondary: 'bg-transparent border-2 border-safe text-safe hover:bg-safe hover:text-white focus:ring-safe/30',
    outline: 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-200',
    ghost: 'bg-transparent text-safe hover:bg-safe/10 focus:ring-safe/30'
  }

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
