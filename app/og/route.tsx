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
          backgroundColor: '#fafafa',
          backgroundImage: 'radial-gradient(circle at 25px 25px, #e5e7eb 2%, transparent 2%), radial-gradient(circle at 75px 75px, #e5e7eb 2%, transparent 2%)',
          backgroundSize: '100px 100px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 48,
            padding: '80px',
          }}
        >
          {showAvatar && (
            <img
              src={`data:image/png;base64,${avatarBase64}`}
              width={200}
              height={200}
              style={{
                borderRadius: '24px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
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
                fontSize: 72,
                fontWeight: 500,
                margin: 0,
                color: '#171717',
                letterSpacing: '-0.025em',
                fontFamily: 'Geist',
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: 36,
                margin: 0,
                color: '#525252',
                fontWeight: 400,
                fontFamily: 'Geist',
                lineHeight: 1.5,
              }}
            >
              {subtitle}
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
          data: await loadGoogleFont('Geist', title, 500),
          style: 'normal',
          weight: 500,
        },
        {
          name: 'Geist',
          data: await loadGoogleFont('Geist', subtitle, 400),
          style: 'normal',
          weight: 400,
        },
      ],
    }
  )
}
