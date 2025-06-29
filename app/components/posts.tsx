import Link from 'next/link'
import { formatDate, getBlogPosts, calculateReadingTime } from 'app/blog/utils'

export function BlogPosts() {
  let allBlogs = getBlogPosts()

  return (
    <div className="space-y-6">
      {allBlogs
        .sort((a, b) => {
          if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ) {
            return -1
          }
          return 1
        })
        .map((post) => (
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
        ))}
    </div>
  )
}
