import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

async function loadGoogleFont(font: string, text: string, weight: number = 400) {
  const url = `https://fonts.googleapis.com/css2?family=${font}:wght@${weight}&text=${encodeURIComponent(text)}`
  const css = await (await fetch(url)).text()
  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/)

  if (resource) {
    const response = await fetch(resource[1])
    if (response.status == 200) {
      return await response.arrayBuffer()
    }
  }

  throw new Error('failed to load font data')
}

export async function GET(request: Request) {
  let url = new URL(request.url)
  let title = url.searchParams.get('title') || 'Indragie Karunaratne'
  let subtitle = url.searchParams.get('subtitle') || 'Director of Engineering at Sentry'
  let showAvatar = url.searchParams.get('avatar') !== 'false'
  let type = url.searchParams.get('type')
  let date = url.searchParams.get('date')
  let author = url.searchParams.get('author')
  
  // For blog posts, we'll show a different layout
  if (type === 'blog' && date && author) {
    // Format the date
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    
    const blogText = `${title}${author}${formattedDate}`
    
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            position: 'relative',
            overflow: 'hidden',
            padding: '80px',
          }}
        >
          {/* Decorative circles */}
          <div
            style={{
              position: 'absolute',
              width: '600px',
              height: '600px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
              top: '-300px',
              right: '-300px',
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
              bottom: '-200px',
              left: '-200px',
            }}
          />
          
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 32,
              zIndex: 1,
              maxWidth: '900px',
              textAlign: 'center',
            }}
          >
            <h1
              style={{
                fontSize: 64,
                fontWeight: 600,
                margin: 0,
                background: 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                letterSpacing: '-0.05em',
                fontFamily: 'Geist',
                lineHeight: 1.2,
              }}
            >
              {title}
            </h1>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                alignItems: 'center',
              }}
            >
              <p
                style={{
                  fontSize: 28,
                  margin: 0,
                  color: '#525252',
                  fontWeight: 500,
                  fontFamily: 'Geist',
                  lineHeight: 1.4,
                  letterSpacing: '-0.03em',
                }}
              >
                {author}
              </p>
              <p
                style={{
                  fontSize: 24,
                  margin: 0,
                  color: '#6b7280',
                  fontWeight: 400,
                  fontFamily: 'Geist',
                  lineHeight: 1.4,
                  letterSpacing: '-0.02em',
                }}
              >
                {formattedDate}
              </p>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Geist',
            data: await loadGoogleFont('Geist', blogText, 600),
            style: 'normal',
            weight: 600,
          },
          {
            name: 'Geist',
            data: await loadGoogleFont('Geist', `${author}${formattedDate}`, 500),
            style: 'normal',
            weight: 500,
          },
          {
            name: 'Geist',
            data: await loadGoogleFont('Geist', formattedDate, 400),
            style: 'normal',
            weight: 400,
          },
        ],
      }
    )
  }
  
  // Combine all text for font loading
  const allText = `${title}${subtitle}`
  
  // Read avatar image as base64
  const avatarPath = join(process.cwd(), 'public', 'avatar.png')
  const avatarBuffer = readFileSync(avatarPath)
  const avatarBase64 = avatarBuffer.toString('base64')

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
            top: '-300px',
            right: '-300px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
            bottom: '-200px',
            left: '-200px',
          }}
        />
        
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 56,
            padding: '80px',
            zIndex: 1,
          }}
        >
          {showAvatar && (
            <img
              src={`data:image/png;base64,${avatarBase64}`}
              width={220}
              height={220}
              style={{
                borderRadius: '32px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                border: '4px solid rgba(255, 255, 255, 0.9)',
              }}
            />
          )}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <h1
              style={{
                fontSize: 76,
                fontWeight: 600,
                margin: 0,
                background: 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                letterSpacing: '-0.05em',
                fontFamily: 'Geist',
                lineHeight: 1.1,
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: 38,
                margin: 0,
                marginTop: 4,
                color: '#525252',
                fontWeight: 400,
                fontFamily: 'Geist',
                lineHeight: 1.4,
                letterSpacing: '-0.03em',
              }}
            >
              {subtitle}
            </p>
            <div
              style={{
                marginTop: 24,
                display: 'flex',
                gap: 20,
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: '22px',
                  color: '#6b7280',
                  fontFamily: 'Geist',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span style={{ fontWeight: 500 }}>@indragiek</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: '22px',
                  color: '#6b7280',
                  fontFamily: 'Geist',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-10 5L2 7" />
                </svg>
                <span style={{ fontWeight: 500 }}>i@indragie.com</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: '22px',
                  color: '#6b7280',
                  fontFamily: 'Geist',
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span style={{ fontWeight: 500 }}>@indragie</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Geist',
          data: await loadGoogleFont('Geist', `${title}@indragie@indragieki@indragie.com`, 600),
          style: 'normal',
          weight: 600,
        },
        {
          name: 'Geist',
          data: await loadGoogleFont('Geist', subtitle, 400),
          style: 'normal',
          weight: 400,
        },
        {
          name: 'Geist',
          data: await loadGoogleFont('Geist', '@indragie@indragieki@indragie.com', 500),
          style: 'normal',
          weight: 500,
        },
      ],
    }
  )
}
