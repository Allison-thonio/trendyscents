import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const adminEmail = process.env.ADMIN_EMAIL || 'trendyscents@admin.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'trendyadmin'

    if (email === adminEmail && password === adminPassword) {
      const response = NextResponse.json({ success: true, message: 'Authenticated successfully' })
      
      // Set secure HTTP cookie valid for 7 days
      response.cookies.set('ts-admin-auth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/'
      })

      return response
    }

    return NextResponse.json(
      { success: false, message: 'Invalid admin credentials provided.' },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server authentication error' },
      { status: 500 }
    )
  }
}
