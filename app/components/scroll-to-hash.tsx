'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function ScrollToHash() {
  const pathname = usePathname()

  useEffect(() => {
    // Function to scroll to hash
    const scrollToHash = () => {
      const hash = window.location.hash
      if (hash) {
        // Wait a bit for images to load and layout to stabilize
        setTimeout(() => {
          const element = document.querySelector(hash)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 100)
      }
    }

    // Handle initial page load with hash
    scrollToHash()

    // Handle hash changes (clicking TOC links)
    const handleHashChange = () => {
      scrollToHash()
    }

    window.addEventListener('hashchange', handleHashChange)
    
    // Also handle click events on anchor links to ensure proper scrolling
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')
      if (link && link.hash && link.pathname === pathname) {
        e.preventDefault()
        window.location.hash = link.hash
      }
    }

    document.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
      document.removeEventListener('click', handleClick)
    }
  }, [pathname])

  return null
}