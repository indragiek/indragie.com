import { BlogPosts } from 'app/components/posts'
import { BackToTop } from 'app/components/back-to-top'
import { GitHubSection } from 'app/components/github-section'
import Image from 'next/image'

export default async function Page() {
  return (
    <section>
      <h1 className="mb-8 text-4xl font-bold tracking-tighter">
        Hi, I'm <span className="text-neutral-900 dark:text-white">Indragie</span>
      </h1>
      <div className="flex flex-col md:flex-row gap-8 mb-12 items-center relative">
        <div className="flex-1 relative">
          <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="group text-center flex flex-col p-4 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
            <a href="https://www.contextmcp.app/" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center mb-3 h-[200px]">
              <Image
                src="/context.png"
                alt="Context"
                width={200}
                height={200}
                className="bg-transparent group-hover:scale-105 transition-transform object-contain"
              />
            </a>
            <h3 className="font-medium mb-1">
              <a href="https://www.contextmcp.app/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Context
              </a>
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">native ai dev tools</p>
            <p className="text-xs text-neutral-400 dark:text-neutral-600 mt-1">2025</p>
          </div>
          <div className="group text-center flex flex-col p-4 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
            <a href="http://flamingo.im/" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center mb-3 h-[200px]">
              <Image
                src="/flamingo.png"
                alt="Flamingo"
                width={200}
                height={200}
                className="bg-transparent group-hover:scale-105 transition-transform object-contain"
              />
            </a>
            <h3 className="font-medium mb-1">
              <a href="http://flamingo.im/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Flamingo
              </a>
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">modern instant messaging</p>
            <p className="text-xs text-neutral-400 dark:text-neutral-600 mt-1">2015</p>
          </div>
          <div className="group text-center flex flex-col p-4 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
            <a href="https://github.com/sonoramac/Sonora" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center mb-3 h-[200px]">
              <Image
                src="/sonora.png"
                alt="Sonora"
                width={200}
                height={200}
                className="bg-transparent group-hover:scale-105 transition-transform object-contain"
              />
            </a>
            <h3 className="font-medium mb-1">
              <a href="https://github.com/sonoramac/Sonora" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Sonora
              </a>
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">music, plain and simple</p>
            <p className="text-xs text-neutral-400 dark:text-neutral-600 mt-1">2012</p>
          </div>
        </div>
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">Posts</h2>
        <BlogPosts />
        <GitHubSection />
      </div>
      <BackToTop />
    </section>
  )
}
