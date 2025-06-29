import { BlogSearch } from 'app/components/blog-search'
import { getBlogPosts } from 'app/blog/utils'

export const metadata = {
  title: 'Blog',
  description: 'Read my blog.',
}

export default function Page() {
  let allBlogs = getBlogPosts()
  
  // Sort posts by date
  const sortedPosts = allBlogs.sort((a, b) => {
    if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
      return -1
    }
    return 1
  })

  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">Posts</h1>
      <BlogSearch posts={sortedPosts} />
    </section>
  )
}
