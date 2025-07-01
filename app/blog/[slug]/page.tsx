import { notFound } from 'next/navigation'
import { CustomMarkdown } from 'app/components/markdown'
import { formatDate, getBlogPosts, calculateReadingTime } from 'app/blog/utils'
import { baseUrl } from 'app/sitemap'
import { ScrollToHash } from 'app/components/scroll-to-hash'

export async function generateStaticParams() {
  let posts = getBlogPosts()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }) {
  let { slug } = await params
  let post = getBlogPosts().find((post) => post.slug === slug)
  if (!post) {
    return
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata
  let ogImage = image
    ? image
    : `${baseUrl}/og?title=${encodeURIComponent(title)}&type=blog&date=${encodeURIComponent(publishedTime)}&author=${encodeURIComponent('Indragie Karunaratne')}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${baseUrl}/blog/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function Blog({ params }) {
  let { slug } = await params
  let post = getBlogPosts().find((post) => post.slug === slug)

  if (!post) {
    notFound()
  }

  return (
    <section>
      <ScrollToHash />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${baseUrl}${post.metadata.image}`
              : `${baseUrl}/og?title=${encodeURIComponent(post.metadata.title)}&type=blog&date=${encodeURIComponent(post.metadata.publishedAt)}&author=${encodeURIComponent('Indragie Karunaratne')}`,
            url: `${baseUrl}/blog/${post.slug}`,
            author: {
              '@type': 'Person',
              name: 'Indragie Karunaratne',
            },
          }),
        }}
      />
      <h1 className="title font-semibold text-2xl tracking-tighter">
        {post.metadata.title}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {formatDate(post.metadata.publishedAt)}
        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {calculateReadingTime(post.content)}
        </p>
      </div>
      <div className="mb-8">
        <a 
          href={`https://github.com/indragiek/indragie.com/blob/main/app/blog/posts/${post.slug}.mdx`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors inline-flex items-center gap-1"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
          View source on GitHub
        </a>
      </div>
      <article className="prose">
        <CustomMarkdown>{post.content}</CustomMarkdown>
      </article>
    </section>
  )
}
