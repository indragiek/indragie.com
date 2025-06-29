export function GitHubError() {
  return (
    <div className="my-12">
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">GitHub</h2>
      <div className="p-4 -mx-4 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
          Unable to load GitHub activity at the moment.
        </p>
        <a
          href="https://github.com/indragiek"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline underline-offset-4 transition-colors"
        >
          View my GitHub profile →
        </a>
      </div>
    </div>
  )
}