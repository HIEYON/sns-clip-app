import { getVideos } from '@/lib/supabase';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mallId = searchParams.get('mall_id');

  if (!mallId) return Response.json({ videos: [] });

  try {
    const videos = await getVideos(mallId);
    return Response.json({ videos });
  } catch {
    return Response.json({ videos: [] });
  }
}
