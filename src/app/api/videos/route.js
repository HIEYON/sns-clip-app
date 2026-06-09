import { cookies } from 'next/headers';
import { getVideos, addVideo, deleteVideo } from '@/lib/supabase';

async function getMallId(request) {
  const cookieStore = await cookies();
  let mallId = cookieStore.get('mall_id')?.value;
  if (!mallId) {
    const { searchParams } = new URL(request.url);
    mallId = searchParams.get('mall_id');
  }
  return mallId;
}

export async function GET(request) {
  const mallId = await getMallId(request);
  if (!mallId) return Response.json({ error: '인증 필요' }, { status: 401 });

  const videos = await getVideos(mallId);
  return Response.json({ videos });
}

export async function POST(request) {
  const mallId = await getMallId(request);
  if (!mallId) return Response.json({ error: '인증 필요' }, { status: 401 });

  const body = await request.json();
  const { src_url, thumb_url, handle, caption, insta_url, sort_order } = body;

  if (!src_url) return Response.json({ error: 'src_url 필수' }, { status: 400 });

  const video = await addVideo(mallId, { src_url, thumb_url, handle, caption, insta_url, sort_order: sort_order || 0 });
  return Response.json({ video });
}

export async function DELETE(request) {
  const mallId = await getMallId(request);
  if (!mallId) return Response.json({ error: '인증 필요' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return Response.json({ error: 'id 필수' }, { status: 400 });

  await deleteVideo(id, mallId);
  return Response.json({ ok: true });
}
