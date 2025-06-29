'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

interface Project {
  name: string
  description: string
  year: string
  image: string
  url: string
}

const projects: Project[] = [
  {
    name: 'Context',
    description: 'native ai dev tools',
    year: '2025',
    image: '/context.png',
    url: 'https://www.contextmcp.app/'
  },
  {
    name: 'Flamingo',
    description: 'modern instant messaging',
    year: '2015',
    image: '/flamingo.png',
    url: 'http://flamingo.im/'
  },
  {
    name: 'Sonora',
    description: 'music, plain and simple',
    year: '2012',
    image: '/sonora.png',
    url: 'https://github.com/sonoramac/Sonora'
  }
]

export function ProjectCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? projects.length - 1 : prevIndex - 1
    )
  }, [])

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === projects.length - 1 ? 0 : prevIndex + 1
    )
  }, [])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        goToPrevious()
      } else if (event.key === 'ArrowRight') {
        goToNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goToPrevious, goToNext])

  // Auto-advance (optional, can be removed if you prefer manual control only)
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(goToNext, 5000) // Change slide every 5 seconds
      return () => clearInterval(interval)
    }
  }, [goToNext, isHovered])

  // Touch/swipe support
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      goToNext()
    } else if (isRightSwipe) {
      goToPrevious()
    }
  }

  const currentProject = projects[currentIndex]

  return (
    <div 
      className="relative w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Single Project Display */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 mb-8">
        <div className="relative h-[300px] md:h-[400px] lg:h-[500px] group">
          <a
            href={projects[currentIndex].url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full h-full"
          >
            <Image
              src={projects[currentIndex].image}
              alt={projects[currentIndex].name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="100vw"
              priority
            />
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300">
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-center p-8">
                  <h3 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                    {projects[currentIndex].name}
                  </h3>
                  <p className="text-xl text-white/90 mb-3 drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
                    {projects[currentIndex].description}
                  </p>
                  <p className="text-base text-white/70 tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
                    {projects[currentIndex].year}
                  </p>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className={`absolute left-4 top-[40%] -translate-y-1/2 p-3 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-sm shadow-lg transition-all hover:scale-110 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label="Previous project"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <button
        onClick={goToNext}
        className={`absolute right-4 top-[40%] -translate-y-1/2 p-3 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-sm shadow-lg transition-all hover:scale-110 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label="Next project"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>

      {/* Project Thumbnails */}
      <div className="grid grid-cols-3 gap-4">
        {projects.map((project, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`relative rounded-lg overflow-hidden transition-all ${
              index === currentIndex 
                ? 'ring-1 ring-neutral-400 dark:ring-neutral-600 scale-105 shadow-lg' 
                : 'opacity-60 hover:opacity-100 hover:scale-105'
            }`}
            aria-label={`Go to ${project.name}`}
          >
            <div className="relative h-24 md:h-32 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900">
              <Image
                src={project.image}
                alt={project.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 33vw, 200px"
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
              <p className="text-xs font-medium text-white truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{project.name}</p>
              <p className="text-[10px] text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{project.year}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}