import { NextRequest, NextResponse } from 'next/server';

// This API route handles the LINE OAuth callback
// To use this, you need to:
// 1. Create a LINE Login Channel at https://developers.line.biz/console/
// 2. Set up environment variables in .env.local:
//    - LINE_CHANNEL_ID=your_channel_id
//    - LINE_CHANNEL_SECRET=your_channel_secret
// 3. Configure the redirect URI in LINE Console to: http://localhost:3000/api/line/callback

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  // Handle error from LINE
  if (error) {
    return NextResponse.redirect(
      new URL(`/admin?line_error=${error}`, request.url)
    );
  }

  // Validate state to prevent CSRF attacks
  // Note: In production, verify this against a stored state value
  if (!state || !code) {
    return NextResponse.redirect(
      new URL('/admin?line_error=invalid_request', request.url)
    );
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://api.line.me/oauth2/v2.1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: `${request.nextUrl.origin}/api/line/callback`,
        client_id: process.env.LINE_CHANNEL_ID || '',
        client_secret: process.env.LINE_CHANNEL_SECRET || '',
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Get LINE user profile
    const profileResponse = await fetch('https://api.line.me/v2/profile', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!profileResponse.ok) {
      throw new Error('Failed to fetch LINE profile');
    }

    const profile = await profileResponse.json();

    // Return profile data as URL parameters (to be handled by client-side)
    const responseUrl = new URL('/admin', request.url);
    responseUrl.searchParams.set('line_success', 'true');
    responseUrl.searchParams.set('line_display_name', profile.displayName);
    responseUrl.searchParams.set('line_picture_url', profile.pictureUrl || '');
    responseUrl.searchParams.set('line_user_id', profile.userId);

    // Close the popup window with a success message
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>LINE Login Success</title>
        </head>
        <body>
          <script>
            // Send message to parent window
            if (window.opener) {
              window.opener.postMessage({
                type: 'LINE_LOGIN_SUCCESS',
                profile: ${JSON.stringify(profile)}
              }, window.location.origin);
              window.close();
            } else {
              window.location.href = '${responseUrl.toString()}';
            }
          </script>
          <p>Connecting LINE account... This window will close automatically.</p>
        </body>
      </html>
      `,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  } catch (error) {
    console.error('LINE OAuth error:', error);
    return NextResponse.redirect(
      new URL('/admin?line_error=server_error', request.url)
    );
  }
}
