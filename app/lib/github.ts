interface GitHubRepo {
  name: string
  full_name: string
  description: string | null
  stargazers_count: number
  html_url: string
  archived: boolean
  is_template: boolean
  owner: {
    login: string
  }
}

interface GitHubEvent {
  type: string
  created_at: string
  repo: {
    name: string
    url: string
  }
  payload?: {
    commits?: Array<{
      sha: string
      message: string
    }>
    pull_request?: {
      title: string
      html_url: string
      merged: boolean
      state: string
    }
    ref_type?: string
    issue?: {
      title: string
      html_url: string
    }
  }
}

const GITHUB_API_BASE = 'https://api.github.com'
const GITHUB_USERNAME = 'indragiek'

async function githubFetch(endpoint: string) {
  const token = process.env.GITHUB_TOKEN
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
    headers,
    next: { revalidate: 3600 } // Cache for 1 hour
  })

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`)
  }

  return response.json()
}

export async function getTopRepositories(): Promise<GitHubRepo[]> {
  try {
    const repos = await githubFetch(`/users/${GITHUB_USERNAME}/repos?type=owner&sort=updated&per_page=100`)
    
    // Filter out forks and sort by stars
    const ownRepos = repos
      .filter((repo: any) => !repo.fork)
      .sort((a: GitHubRepo, b: GitHubRepo) => b.stargazers_count - a.stargazers_count)
      .slice(0, 3)
    
    return ownRepos
  } catch (error) {
    console.error('Error fetching repositories:', error)
    return []
  }
}

export interface Contribution {
  repoName: string
  repoUrl: string
  repoDescription: string | null
  type: 'commit' | 'pr'
  title: string
  url: string
  timestamp: string
  prStatus?: 'open' | 'closed' | 'merged'
}

export async function getMostRecentContribution(): Promise<Contribution | null> {
  try {
    // Get recent events
    const events: GitHubEvent[] = await githubFetch(`/users/${GITHUB_USERNAME}/events/public?per_page=100`)
    
    // Filter out old contributions (>6 months) and automated commits
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    
    // Find the most recent meaningful contribution
    for (const event of events) {
      const eventDate = new Date(event.created_at)
      if (eventDate < sixMonthsAgo) continue
      
      const repoUrl = event.repo.url.replace('api.github.com/repos', 'github.com')
      let repoDescription: string | null = null
      
      // Skip automated events
      if (event.type === 'CreateEvent' && event.payload?.ref_type === 'branch') continue
      if (event.type === 'DeleteEvent') continue
      
      // Fetch repository details to get description (with caching)
      try {
        const repoData = await githubFetch(`/repos/${event.repo.name}`)
        repoDescription = repoData.description
      } catch (error) {
        console.error('Error fetching repo details:', error)
      }
      
      if (event.type === 'PushEvent' && event.payload?.commits && event.payload.commits.length > 0) {
        const latestCommit = event.payload.commits[event.payload.commits.length - 1]
        const commitMessage = latestCommit.message.split('\n')[0] // First line only
        
        // Skip automated dependency updates
        if (commitMessage.toLowerCase().includes('dependabot') || 
            commitMessage.toLowerCase().includes('renovate') ||
            commitMessage.toLowerCase().includes('bump') && commitMessage.toLowerCase().includes('version')) {
          continue
        }
        
        return {
          repoName: event.repo.name,
          repoUrl,
          repoDescription,
          type: 'commit',
          title: commitMessage,
          url: `${repoUrl}/commit/${latestCommit.sha}`,
          timestamp: event.created_at
        }
      } else if (event.type === 'PullRequestEvent' && event.payload?.pull_request) {
        const pr = event.payload.pull_request
        const prStatus = pr.merged ? 'merged' : pr.state as 'open' | 'closed'
        
        return {
          repoName: event.repo.name,
          repoUrl,
          repoDescription,
          type: 'pr',
          title: pr.title,
          url: pr.html_url,
          timestamp: event.created_at,
          prStatus
        }
      }
    }
    
    return null
  } catch (error) {
    console.error('Error fetching recent contribution:', error)
    return null
  }
}

export function formatRelativeTime(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'just now'
  
  const minutes = Math.floor(diffInSeconds / 60)
  if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
  
  const hours = Math.floor(diffInSeconds / 3600)
  if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  
  const days = Math.floor(diffInSeconds / 86400)
  if (days < 7) return `${days} ${days === 1 ? 'day' : 'days'} ago`
  
  const weeks = Math.floor(diffInSeconds / 604800)
  if (weeks < 4) return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
  
  const months = Math.floor(diffInSeconds / 2592000)
  if (months < 12) return `${months} ${months === 1 ? 'month' : 'months'} ago`
  
  const years = Math.floor(diffInSeconds / 31536000)
  return `${years} ${years === 1 ? 'year' : 'years'} ago`
}