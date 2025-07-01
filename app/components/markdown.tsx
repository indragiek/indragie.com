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
  
  // Check if this is an auto-linked .md file
  // The markdown parser converts text like "CLAUDE.md" to href="https://CLAUDE.md"
  if (href && href.match(/^https?:\/\/[A-Z]+\.md$/)) {
    // Just return the plain text, not a link
    // Extract the filename from the URL
    const filename = href.replace(/^https?:\/\//, '')
    return <>{filename}</>
  }

  if (href && href.startsWith('/')) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    )
  }

  if (href && href.startsWith('#')) {
    return <a {...props} />
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />
}

function RoundedImage(props) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showExpandIcon, setShowExpandIcon] = useState(false)
  const imgRef = React.useRef<HTMLImageElement>(null)
  
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
                const img = e.target as HTMLImageElement
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
  // Check if this is already processed HTML (has dangerouslySetInnerHTML)
  if (props.dangerouslySetInnerHTML) {
    return <code {...props} />
  }
  
  // Only apply syntax highlighting for code blocks (when parent is pre)
  const isCodeBlock = props.className || props.language
  const isWrapBlock = props.className === 'language-wrap'
  
  // For wrap blocks, don't apply syntax highlighting
  if (isWrapBlock) {
    return <code {...props} data-wrap="true">{children}</code>
  }
  
  if (isCodeBlock && typeof children === 'string') {
    let codeHTML = highlight(children)
    return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
  }
  
  // For inline code, just return plain code element
  return <code {...props}>{children}</code>
}

function Pre({ children, ...props }) {
  // Check if this is a wrap code block
  const codeElement = React.Children.toArray(children)[0]
  const isWrapBlock = React.isValidElement(codeElement) && 
                      (codeElement.props?.['data-wrap'] === 'true' || 
                       codeElement.props?.className === 'language-wrap')
  
  if (isWrapBlock) {
    // For wrap blocks, apply wrapping styles
    return (
      <pre {...props} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {children}
      </pre>
    )
  }
  
  // For regular code blocks
  return <pre {...props}>{children}</pre>
}

function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .replace(/^\d+\.\s+/, '') // Remove numeric prefix for slug
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

function createHeading(level) {
  const Heading = ({ children }) => {
    // Extract text content from children
    const extractText = (node) => {
      if (typeof node === 'string') return node
      if (React.isValidElement(node) && node.props.children) {
        return extractText(node.props.children)
      }
      if (Array.isArray(node)) {
        return node.map(extractText).join('')
      }
      return ''
    }
    
    const textContent = extractText(children)
    const slug = slugify(textContent)
    
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
          pre: Pre,
          Table,
        },
        namedCodesToUnicode: {
          amp: '&',
          apos: "'",
          gt: '>',
          lt: '<',
          nbsp: ' ',
          quot: '"',
        },
        disableParsingRawHTML: true,
      }}
    >
      {children}
    </Markdown>
  )
}