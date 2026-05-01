import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const savings = searchParams.get('savings') || '0';

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
            backgroundColor: '#f8fafc',
            fontFamily: 'sans-serif',
          }}
        >
          <div style={{ fontSize: 60, fontWeight: 800, color: '#111827', marginBottom: 20 }}>
            SpendLens AI Audit
          </div>
          <div style={{ fontSize: 100, fontWeight: 900, color: '#16a34a' }}>
            Save ${savings}/mo
          </div>
          <div style={{ fontSize: 40, color: '#6b7280', marginTop: 40 }}>
            Stop overpaying for AI tools.
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response('Failed to generate image', { status: 500 });
  }
}
