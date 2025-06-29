import { BlogPosts } from 'app/components/posts'
import { BackToTop } from 'app/components/back-to-top'
import { GitHubSection } from 'app/components/github-section'
import { ProjectCarousel } from 'app/components/project-carousel'
import Image from 'next/image'

export default async function Page() {
  return (
    <section>
      <div className="flex items-center gap-4 mb-8 sm:block">
        <div className="flex-shrink-0 sm:hidden">
          <Image
            src="/avatar.png"
            alt="Indragie Karunaratne"
            width={60}
            height={60}
            className="rounded-2xl shadow-md"
          />
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Hi, I'm <span className="font-bold">Indragie</span>
        </h1>
      </div>
      <div className="flex items-start gap-4 mb-12">
        <div className="flex-1">
          <p className="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
            I'm a Director of Engineering at <a href="https://sentry.io" target="_blank" rel="noopener noreferrer" className="font-medium text-neutral-900 dark:text-neutral-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Sentry</a> working on observability tools. I started my career as an independent iOS and macOS developer, then worked on mobile infrastructure at Meta before co-founding Specto, a mobile application performance monitoring startup (acquired by Sentry). Lately, I've been exploring AI developer tools and building <a href="https://www.contextmcp.app/" target="_blank" rel="noopener noreferrer" className="font-medium text-neutral-900 dark:text-neutral-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Context</a>, a macOS app for debugging MCP servers.
          </p>
        </div>
        <div className="flex-shrink-0 hidden sm:block">
          <Image
            src="/avatar.png"
            alt="Indragie Karunaratne"
            width={120}
            height={120}
            className="rounded-2xl shadow-md"
          />
        </div>
      </div>
      <section className="mb-14">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight">Projects</h2>
        <ProjectCarousel />
      </section>

      <section className="mb-14">
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">Posts</h2>
        <BlogPosts />
      </section>

      <GitHubSection />
      <BackToTop />
    </section>
  )
}
