import { redirect } from 'next/navigation';
import { getAuthUrl } from '@/lib/cafe24';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mallId = searchParams.get('mall_id');
  if (!mallId) return new Response('mall_id 없음', { status: 400 });

  const authUrl = getAuthUrl(mallId);
  return Response.redirect(authUrl);
}
