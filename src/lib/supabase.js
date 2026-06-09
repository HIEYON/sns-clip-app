import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 스토어 저장/업데이트
export async function upsertStore({ mall_id, access_token, refresh_token, expires_at }) {
  const { data, error } = await supabase
    .from('stores')
    .upsert({ mall_id, access_token, refresh_token, expires_at }, { onConflict: 'mall_id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// 스토어 조회
export async function getStore(mall_id) {
  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .eq('mall_id', mall_id)
    .single();
  if (error) return null;
  return data;
}

// 스크립트태그 번호 저장
export async function saveScriptTagNo(mall_id, script_tag_no) {
  await supabase
    .from('stores')
    .update({ script_tag_no })
    .eq('mall_id', mall_id);
}

// 영상 목록 조회
export async function getVideos(mall_id) {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('mall_id', mall_id)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

// 영상 추가
export async function addVideo(mall_id, video) {
  const { data, error } = await supabase
    .from('videos')
    .insert({ mall_id, ...video })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// 영상 삭제
export async function deleteVideo(id, mall_id) {
  const { error } = await supabase
    .from('videos')
    .delete()
    .eq('id', id)
    .eq('mall_id', mall_id);
  if (error) throw error;
}

// 영상 순서 업데이트
export async function updateVideoOrder(id, mall_id, sort_order) {
  const { error } = await supabase
    .from('videos')
    .update({ sort_order })
    .eq('id', id)
    .eq('mall_id', mall_id);
  if (error) throw error;
}
