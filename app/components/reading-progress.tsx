'use client'

import { useEffect, useState } from 'react'

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setProgress(Math.min(scrollProgress, 100))
      
      // Show progress bar after scrolling past the header
      setIsVisible(scrollTop > 100)
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-50 h-0.5 bg-neutral-100 dark:bg-neutral-900/50 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 transition-all duration-150 ease-out shadow-sm shadow-blue-500/20"
        style={{ 
          width: `${progress}%`,
          boxShadow: progress > 0 ? '0 0 8px rgba(59, 130, 246, 0.5)' : 'none'
        }}
      />
    </div>
  )
}