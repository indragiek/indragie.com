import { getTopRepositories, getMostRecentContribution, formatRelativeTime } from 'app/lib/github'
import { GitHubError } from './github-error'
import Image from 'next/image'

export async function GitHubSection() {
  try {
    const [topReposResult, contributionResult] = await Promise.allSettled([
      getTopRepositories(),
      getMostRecentContribution()
    ])

    const topRepos = topReposResult.status === 'fulfilled' ? topReposResult.value : []
    const recentContribution = contributionResult.status === 'fulfilled' ? contributionResult.value : null

    if (!topRepos.length && !recentContribution) {
      return <GitHubError />
    }

  return (
    <div className="mb-14">
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">GitHub</h2>
      
      {recentContribution && (
        <div className="mb-8">
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">Most recent contribution</p>
          <div className="p-4 -mx-4 rounded-lg transition-all hover:bg-neutral-50 dark:hover:bg-neutral-950">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-2">
              <a 
                href={recentContribution.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-neutral-900 dark:text-neutral-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors break-words"
              >
                {recentContribution.repoName}
              </a>
              <span className="text-xs text-neutral-500 dark:text-neutral-500 flex-shrink-0">
                {formatRelativeTime(recentContribution.timestamp)}
              </span>
            </div>
            {recentContribution.repoDescription && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                {recentContribution.repoDescription}
              </p>
            )}
            <div className="border-l-2 border-neutral-200 dark:border-neutral-800 pl-3">
              <div className="flex items-center gap-2 mb-2 text-sm text-neutral-600 dark:text-neutral-400">
                <Image
                  src={recentContribution.author.avatarUrl}
                  alt={recentContribution.author.username}
                  width={20}
                  height={20}
                  className="rounded-full"
                />
                <span>
                  {recentContribution.author.username} {' '}
                  {recentContribution.type === 'commit' ? 'committed' : 
                   recentContribution.prStatus === 'merged' ? 'merged' :
                   recentContribution.action === 'opened' ? 'opened' :
                   recentContribution.action === 'closed' ? 'closed' :
                   recentContribution.action || 'updated'}
                </span>
              </div>
              <a
                href={recentContribution.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <div className="flex items-start gap-2">
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors line-clamp-2 flex-1">
                    {recentContribution.title}
                  </p>
                  {recentContribution.type === 'pr' && recentContribution.prStatus && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full whitespace-nowrap ${
                      recentContribution.prStatus === 'merged' 
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                        : recentContribution.prStatus === 'open'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
                    }`}>
                      {recentContribution.prStatus}
                    </span>
                  )}
                </div>
              </a>
            </div>
          </div>
        </div>
      )}

      {topRepos.length > 0 && (
        <div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">Popular repositories</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {topRepos.map((repo) => (
              <a
                key={repo.full_name}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div className="h-full p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 transition-all hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-sm">
                  <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                          {repo.name}
                        </h3>
                        {repo.archived && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 whitespace-nowrap">
                            Archived
                          </span>
                        )}
                        {repo.is_template && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 whitespace-nowrap">
                            Template
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 flex-grow line-clamp-2 mb-3">
                      {repo.description || "No description available"}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                      <div className="flex items-center gap-1">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                        <span>{repo.stargazers_count}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
  } catch (error) {
    console.error('Error in GitHubSection:', error)
    return <GitHubError />
  }
}