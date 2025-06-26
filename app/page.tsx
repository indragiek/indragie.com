import { BlogPosts } from 'app/components/posts'
import Image from 'next/image'

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-3xl font-semibold tracking-tighter">
        Hi, I'm <span className="font-bold text-black dark:text-white">Indragie</span>
      </h1>
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-1">
          <p>
            I'm a Director of Engineering at <a href="https://sentry.io" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-neutral-600 dark:hover:text-neutral-400">Sentry</a> working on observability tools. Previously, I co-founded Specto, a mobile application performance monitoring startup (acquired by Sentry) and worked on mobile infrastructure at Meta. Lately, I've been exploring AI developer tools and building <a href="https://www.contextmcp.app/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-neutral-600 dark:hover:text-neutral-400">Context</a>, a macOS app for debugging MCP servers.
          </p>
        </div>
        <div className="flex-shrink-0">
          <Image
            src="/avatar.png"
            alt="Indragie Karunaratne"
            width={120}
            height={120}
            className="rounded-2xl"
          />
        </div>
      </div>
      <div className="my-8">
        <h2 className="mb-6 text-xl font-semibold tracking-tighter">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="text-center flex flex-col">
            <a href="https://www.contextmcp.app/" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center mb-3">
              <Image
                src="/context.png"
                alt="Context"
                width={200}
                height={200}
                className="bg-transparent"
              />
            </a>
            <h3 className="font-medium mb-1">
              <a href="https://www.contextmcp.app/" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-600 dark:hover:text-neutral-400 transition-all">
                Context
              </a>
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">native ai dev tools</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-500">2025</p>
          </div>
          <div className="text-center flex flex-col">
            <a href="http://flamingo.im/" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center mb-3">
              <Image
                src="/flamingo.png"
                alt="Flamingo"
                width={200}
                height={200}
                className="bg-transparent"
              />
            </a>
            <h3 className="font-medium mb-1">
              <a href="http://flamingo.im/" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-600 dark:hover:text-neutral-400 transition-all">
                Flamingo
              </a>
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">modern instant messaging</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-500">2015</p>
          </div>
          <div className="text-center flex flex-col">
            <a href="https://github.com/sonoramac/Sonora" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center mb-3">
              <Image
                src="/sonora.png"
                alt="Sonora"
                width={200}
                height={200}
                className="bg-transparent"
              />
            </a>
            <h3 className="font-medium mb-1">
              <a href="https://github.com/sonoramac/Sonora" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-600 dark:hover:text-neutral-400 transition-all">
                Sonora
              </a>
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">music, plain and simple</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-500">2012</p>
          </div>
        </div>
        <h2 className="mb-6 text-xl font-semibold tracking-tighter">Posts</h2>
        <BlogPosts />
      </div>
    </section>
  )
}
