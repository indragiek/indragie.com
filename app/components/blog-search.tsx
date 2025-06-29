'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { formatDate, calculateReadingTime } from 'app/blog/client-utils'

export function BlogSearch({ posts }) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPosts = useMemo(() => {
    if (!searchTerm) return posts

    const lowercasedSearch = searchTerm.toLowerCase()
    return posts.filter(post => 
      post.metadata.title.toLowerCase().includes(lowercasedSearch) ||
      post.metadata.summary.toLowerCase().includes(lowercasedSearch) ||
      post.content.toLowerCase().includes(lowercasedSearch)
    )
  }, [searchTerm, posts])

  return (
    <>
      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-300 dark:focus:ring-neutral-700 placeholder-neutral-500 dark:placeholder-neutral-500"
        />
        <svg 
          className="absolute right-3 top-2.5 w-4 h-4 text-neutral-500 dark:text-neutral-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div className="space-y-6">
        {filteredPosts.length === 0 ? (
          <p className="text-neutral-600 dark:text-neutral-400 text-center py-8">
            No posts found matching "{searchTerm}"
          </p>
        ) : (
          filteredPosts.map((post) => (
            <Link
              key={post.slug}
              className="block no-underline group"
              href={`/blog/${post.slug}`}
            >
              <div className="p-4 -mx-4 rounded-lg transition-all hover:bg-neutral-50 dark:hover:bg-neutral-950">
                <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2 mb-2">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 tabular-nums">
                    {formatDate(post.metadata.publishedAt, false)}
                  </p>
                  <div>
                    <h3 className="text-neutral-900 dark:text-neutral-100 tracking-tight font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {post.metadata.title}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2">
                      {post.metadata.summary}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-2">
                      {calculateReadingTime(post.content)}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  )
}