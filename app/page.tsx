import { BlogPosts } from 'app/components/posts'
import { BackToTop } from 'app/components/back-to-top'
import { GitHubSection } from 'app/components/github-section'
import { ProjectCarousel } from 'app/components/project-carousel'
import Image from 'next/image'

export default async function Page() {
  return (
    <section>
      <h1 className="mb-8 text-4xl font-bold tracking-tighter">
        Hi, I'm <span className="text-neutral-900 dark:text-white">Indragie</span>
      </h1>
      <div className="flex flex-col md:flex-row gap-8 mb-12 items-center relative">
        <div className="flex-1 relative">
          <p className="text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
            I'm a Director of Engineering at <a href="https://sentry.io" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 dark:text-blue-400 hover:underline underline-offset-4 transition-colors">Sentry</a> working on observability tools. Previously, I co-founded Specto, a mobile application performance monitoring startup (acquired by Sentry) and worked on mobile infrastructure at Meta. Lately, I've been exploring AI developer tools and building <a href="https://www.contextmcp.app/" target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 dark:text-blue-400 hover:underline underline-offset-4 transition-colors">Context</a>, a macOS app for debugging MCP servers.
          </p>
        </div>
        <div className="flex-shrink-0">
          <Image
            src="/avatar.png"
            alt="Indragie Karunaratne"
            width={120}
            height={120}
            className="rounded-2xl shadow-lg"
          />
        </div>
      </div>
      <div className="my-12">
        <h2 className="mb-8 text-2xl font-semibold tracking-tight">Projects</h2>
        <ProjectCarousel />
        <h2 className="mt-16 mb-4 text-2xl font-semibold tracking-tight">Posts</h2>
        <BlogPosts />
        <GitHubSection />
      </div>
      <BackToTop />
    </section>
  )
}
