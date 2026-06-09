import { createClient } from '@supabase/supabase-js';

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function upsertStore({ mall_id, access_token, refresh_token, expires_at }) {
  const { data, error } = await getClient()
    .from('stores')
    .upsert({ mall_id, access_token, refresh_token, expires_at }, { onConflict: 'mall_id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getStore(mall_id) {
  const { data, error } = await getClient()
    .from('stores')
    .select('*')
    .eq('mall_id', mall_id)
    .single();
  if (error) return null;
  return data;
}

export async function saveScriptTagNo(mall_id, script_tag_no) {
  await getClient()
    .from('stores')
    .update({ script_tag_no })
    .eq('mall_id', mall_id);
}

export async function getVideos(mall_id) {
  const { data, error } = await getClient()
    .from('videos')
    .select('*')
    .eq('mall_id', mall_id)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function addVideo(mall_id, video) {
  const { data, error } = await getClient()
    .from('videos')
    .insert({ mall_id, ...video })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteVideo(id, mall_id) {
  const { error } = await getClient()
    .from('videos')
    .delete()
    .eq('id', id)
    .eq('mall_id', mall_id);
  if (error) throw error;
}
