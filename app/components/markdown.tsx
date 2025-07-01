'use client'

import Link from 'next/link'
import Image from 'next/image'
import Markdown from 'markdown-to-jsx'
import { highlight } from 'sugar-high'
import React, { useState } from 'react'
import { createPortal } from 'react-dom'

function Table({ data }) {
  let headers = data.headers.map((header, index) => (
    <th key={index}>{header}</th>
  ))
  let rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ))

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  )
}

function CustomLink(props) {
  let href = props.href

  if (href.startsWith('/')) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    )
  }

  if (href.startsWith('#')) {
    return <a {...props} />
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />
}

function RoundedImage(props) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showExpandIcon, setShowExpandIcon] = useState(false)
  const imgRef = React.useRef(null)
  
  // Check if image is scaled down
  React.useEffect(() => {
    const checkImageSize = () => {
      if (imgRef.current) {
        const img = imgRef.current
        // Check if the displayed size is smaller than natural size
        const isScaledDown = img.naturalWidth > img.width || img.naturalHeight > img.height
        setShowExpandIcon(isScaledDown)
      }
    }
    
    // Check on load and resize
    if (imgRef.current?.complete) {
      checkImageSize()
    }
    
    window.addEventListener('resize', checkImageSize)
    return () => window.removeEventListener('resize', checkImageSize)
  }, [])
  
  // For blog images, add expandable functionality
  if (props.src && props.src.startsWith('/blog/')) {
    return (
      <>
        <span className="block relative w-full h-auto flex justify-center group">
          <span className="relative inline-block">
            <Image 
              ref={imgRef}
              alt={props.alt} 
              src={props.src}
              width={0}
              height={0}
              sizes="100vw"
              className={`rounded-lg w-auto h-auto max-w-full ${showExpandIcon ? 'cursor-pointer' : ''}`}
              style={{
                maxWidth: '100%',
                height: 'auto'
              }}
              onClick={() => showExpandIcon && setIsExpanded(true)}
              onLoad={(e) => {
                const img = e.target
                const isScaledDown = img.naturalWidth > img.width || img.naturalHeight > img.height
                setShowExpandIcon(isScaledDown)
              }}
            />
            {/* Expand icon on hover - only show if image is scaled down */}
            {showExpandIcon && (
              <span className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/50 rounded-lg p-2 pointer-events-none inline-flex">
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="white" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <polyline points="9 21 3 21 3 15"></polyline>
                  <line x1="21" y1="3" x2="14" y2="10"></line>
                  <line x1="3" y1="21" x2="10" y2="14"></line>
                </svg>
              </span>
            )}
          </span>
        </span>
        
        {/* Full-size overlay - render outside of DOM hierarchy using Portal */}
        {isExpanded && typeof document !== 'undefined' && createPortal(
          <div 
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setIsExpanded(false)}
          >
            <div className="relative max-w-[90vw] max-h-[90vh]">
              <Image 
                alt={props.alt} 
                src={props.src}
                width={0}
                height={0}
                sizes="100vw"
                className="w-auto h-auto max-w-full max-h-[90vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              {/* Close button */}
              <button
                onClick={() => setIsExpanded(false)}
                className="absolute top-4 right-4 bg-black/50 rounded-lg p-2 hover:bg-black/70 transition-colors"
              >
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="white" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>,
          document.body
        )}
      </>
    )
  }
  
  // For other images, use default behavior
  return <Image alt={props.alt} className="rounded-lg" {...props} />
}

function Code({ children, ...props }) {
  // Only apply syntax highlighting for code blocks (when parent is pre)
  const isCodeBlock = props.className || props.language
  
  if (isCodeBlock && typeof children === 'string') {
    let codeHTML = highlight(children)
    return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
  }
  
  // For inline code, just return plain code element
  return <code {...props}>{children}</code>
}

function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

function createHeading(level) {
  const Heading = ({ children }) => {
    let slug = slugify(children)
    return React.createElement(
      `h${level}`,
      { id: slug },
      React.createElement('a', {
        href: `#${slug}`,
        key: `link-${slug}`,
        className: 'anchor',
      }),
      children
    )
  }

  Heading.displayName = `Heading${level}`

  return Heading
}

export function CustomMarkdown({ children }: { children: string }) {
  return (
    <Markdown
      options={{
        overrides: {
          h1: createHeading(1),
          h2: createHeading(2),
          h3: createHeading(3),
          h4: createHeading(4),
          h5: createHeading(5),
          h6: createHeading(6),
          img: RoundedImage,
          a: CustomLink,
          code: Code,
          Table,
        },
      }}
    >
      {children}
    </Markdown>
  )
}