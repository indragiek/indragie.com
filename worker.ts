// The site is a static export served straight from Workers static assets; this
// script only sees requests that match no file, and wrangler.jsonc's hourly cron,
// which rebuilds the site so the homepage's GitHub section stays current.
export default {
  fetch(request, env) {
    return env.ASSETS.fetch(request)
  },
  scheduled(_controller, env, ctx) {
    ctx.waitUntil(fetch(env.DEPLOY_HOOK_URL, { method: 'POST' }))
  },
}
