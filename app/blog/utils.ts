import fs from 'fs'
import path from 'path'

type Metadata = {
  title: string
  publishedAt: string
  summary: string
  image?: string
}

function parseFrontmatter(fileContent: string) {
  let frontmatterRegex = /---\s*([\s\S]*?)\s*---/
  let match = frontmatterRegex.exec(fileContent)
  
  if (!match) {
    throw new Error('No frontmatter found in file')
  }
  
  let frontMatterBlock = match[1]
  let content = fileContent.replace(frontmatterRegex, '').trim()
  let frontMatterLines = frontMatterBlock.trim().split('\n')
  let metadata: Partial<Metadata> = {}

  frontMatterLines.forEach((line) => {
    let [key, ...valueArr] = line.split(': ')
    let value = valueArr.join(': ').trim()
    value = value.replace(/^['"](.*)['"]$/, '$1') // Remove quotes
    metadata[key.trim() as keyof Metadata] = value
  })

  return { metadata: metadata as Metadata, content }
}

function getMDXFiles(dir) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx')
}

function readMDXFile(filePath) {
  let rawContent = fs.readFileSync(filePath, 'utf-8')
  return parseFrontmatter(rawContent)
}

function getMDXData(dir) {
  let mdxFiles = getMDXFiles(dir)
  return mdxFiles.map((file) => {
    let { metadata, content } = readMDXFile(path.join(dir, file))
    let slug = path.basename(file, path.extname(file))
    
    // Process content to replace {{TOC}} with generated table of contents
    const processedContent = processContent(content)

    return {
      metadata,
      slug,
      content: processedContent,
    }
  })
}

export function getBlogPosts() {
  return getMDXData(path.join(process.cwd(), 'app', 'blog', 'posts'))
}

export function formatDate(date: string, includeRelative = false) {
  let currentDate = new Date()
  if (!date.includes('T')) {
    date = `${date}T00:00:00`
  }
  let targetDate = new Date(date)

  let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear()
  let monthsAgo = currentDate.getMonth() - targetDate.getMonth()
  let daysAgo = currentDate.getDate() - targetDate.getDate()

  let formattedDate = ''

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`
  } else {
    formattedDate = 'Today'
  }

  let fullDate = targetDate.toLocaleString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  if (!includeRelative) {
    return fullDate
  }

  return `${fullDate} (${formattedDate})`
}

export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}

function generateTableOfContents(content: string): string {
  // Extract all headings
  const headingRegex = /^##\s+(.+)$/gm
  const headings: { level: number; text: string; slug: string }[] = []
  
  let match
  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[1].trim()
    // Create slug from heading text
    const slug = text
      .toLowerCase()
      .replace(/^\d+\.\s+/, '') // Remove numeric prefix for slug
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim()
    
    headings.push({
      level: 2, // All are ## level
      text,
      slug
    })
  }
  
  if (headings.length === 0) return ''
  
  // Check if headings have numeric prefixes
  const hasNumericPrefixes = headings.every(h => /^\d+\.\s/.test(h.text))
  
  // Generate TOC
  let toc = ''
  
  if (hasNumericPrefixes) {
    // Use numbered list
    headings.forEach((heading, index) => {
      const number = index + 1
      const text = heading.text.replace(/^\d+\.\s+/, '') // Remove the prefix from display
      toc += `${number}. [${text}](#${heading.slug})\n`
    })
  } else {
    // Use bullet list
    headings.forEach(heading => {
      toc += `- [${heading.text}](#${heading.slug})\n`
    })
  }
  
  return toc.trim()
}

function processFootnotes(content: string): string {
  // Find all footnote references [^1], [^2], etc.
  const footnoteRefRegex = /\[\^(\d+)\]/g
  const footnoteDefRegex = /^\[\^(\d+)\]:\s*(.+)$/gm
  
  // Extract footnote definitions
  const footnotes: { [key: string]: string } = {}
  let match
  
  while ((match = footnoteDefRegex.exec(content)) !== null) {
    footnotes[match[1]] = match[2]
  }
  
  // If we don't have footnotes, return original content
  if (Object.keys(footnotes).length === 0) {
    return content
  }
  
  // Remove footnote definitions from content
  let processedContent = content.replace(footnoteDefRegex, '')
  
  // Replace footnote references with proper links
  processedContent = processedContent.replace(footnoteRefRegex, (match, num) => {
    return `<sup id="fnref-${num}"><a href="#fn-${num}">${num}</a></sup>`
  })
  
  // Build footnotes HTML
  let footnotesHtml = '\n\n<footer class="footnotes">\n'
  footnotesHtml += '<h3>Notes</h3>\n'
  footnotesHtml += '<div class="footnote-list">\n'
  
  Object.entries(footnotes).forEach(([num, text]) => {
    footnotesHtml += `<div class="footnote-item" id="fn-${num}">\n`
    footnotesHtml += `<span class="footnote-number">${num}.</span>\n`
    footnotesHtml += `<span class="footnote-content">${text} <a href="#fnref-${num}" class="footnote-backref">↩</a></span>\n`
    footnotesHtml += `</div>\n`
  })
  
  footnotesHtml += '</div>\n</footer>'
  
  return processedContent.trim() + footnotesHtml
}

export function processContent(content: string): string {
  // Replace {{TOC}} with generated table of contents
  const toc = generateTableOfContents(content)
  let processedContent = content.replace('{{TOC}}', toc)
  
  // Process footnotes
  processedContent = processFootnotes(processedContent)
  
  return processedContent
}
