'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const s = {
  wrap: { minHeight: '100vh', background: '#f5f5f5', padding: '2rem' },
  header: { background: '#fff', borderRadius: '1.2rem', padding: '2rem 2.4rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  title: { fontSize: '2rem', fontWeight: 700, color: '#111' },
  badge: { background: '#f0f0f0', color: '#666', fontSize: '1.2rem', padding: '0.4rem 1rem', borderRadius: '2rem' },
  card: { background: '#fff', borderRadius: '1.2rem', padding: '2.4rem', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  label: { display: 'block', fontSize: '1.3rem', fontWeight: 600, color: '#333', marginBottom: '0.6rem' },
  input: { width: '100%', padding: '1rem 1.2rem', border: '1.5px solid #e0e0e0', borderRadius: '0.8rem', fontSize: '1.4rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.6rem' },
  btn: { padding: '1.2rem 2.4rem', borderRadius: '0.8rem', border: 'none', cursor: 'pointer', fontSize: '1.4rem', fontWeight: 600, transition: 'all 0.2s' },
  btnPrimary: { background: '#111', color: '#fff' },
  btnDanger: { background: '#fff', color: '#e53e3e', border: '1.5px solid #e53e3e', padding: '0.6rem 1.2rem', borderRadius: '0.6rem', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 600 },
  videoList: { display: 'flex', flexDirection: 'column', gap: '1.2rem' },
  videoItem: { display: 'flex', alignItems: 'center', gap: '1.6rem', padding: '1.4rem', border: '1.5px solid #f0f0f0', borderRadius: '1rem', background: '#fafafa' },
  thumb: { width: '6rem', height: '8rem', objectFit: 'cover', borderRadius: '0.6rem', background: '#e0e0e0', flexShrink: 0 },
  empty: { textAlign: 'center', padding: '4rem', color: '#999', fontSize: '1.4rem' },
};

function AdminPage() {
  const params = useSearchParams();
  const mallId = params.get('mall_id');

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({ src_url: '', thumb_url: '', handle: '', caption: '', insta_url: '' });

  useEffect(() => { fetchVideos(); }, []);

  async function fetchVideos() {
    setLoading(true);
    const r = await fetch(`/api/videos?mall_id=${mallId}`);
    const data = await r.json();
    setVideos(data.videos || []);
    setLoading(false);
  }

  async function addVideo(e) {
    e.preventDefault();
    if (!form.src_url) return setMsg('⚠️ 영상 URL은 필수입니다.');
    setSaving(true);
    const r = await fetch('/api/videos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, sort_order: videos.length }),
    });
    const data = await r.json();
    if (data.video) {
      setVideos(prev => [...prev, data.video]);
      setForm({ src_url: '', thumb_url: '', handle: '', caption: '', insta_url: '' });
      setMsg('✅ 영상이 추가되었습니다!');
    } else {
      setMsg('❌ 추가 실패: ' + JSON.stringify(data));
    }
    setSaving(false);
    setTimeout(() => setMsg(''), 3000);
  }

  async function removeVideo(id) {
    if (!confirm('이 영상을 삭제할까요?')) return;
    await fetch(`/api/videos?id=${id}&mall_id=${mallId}`, { method: 'DELETE' });
    setVideos(prev => prev.filter(v => v.id !== id));
    setMsg('🗑️ 삭제되었습니다.');
    setTimeout(() => setMsg(''), 2000);
  }

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <div>
          <div style={s.title}>🎬 인별위젯 관리</div>
          <div style={{ fontSize: '1.3rem', color: '#888', marginTop: '0.3rem' }}>쇼핑몰: {mallId}</div>
        </div>
        <div style={s.badge}>영상 {videos.length}개</div>
      </div>

      {/* 영상 추가 폼 */}
      <div style={s.card}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '2rem', color: '#111' }}>➕ 영상 추가</h2>
        <form onSubmit={addVideo}>
          <div style={{ marginBottom: '1.6rem' }}>
            <label style={s.label}>영상 URL (MP4) *</label>
            <input style={s.input} type="url" placeholder="https://yourshop.cafe24.com/web/upload/video.mp4" value={form.src_url} onChange={e => setForm(p => ({ ...p, src_url: e.target.value }))} required />
            <div style={{ fontSize: '1.2rem', color: '#999', marginTop: '0.4rem' }}>카페24 파일 매니저에 업로드한 MP4 URL</div>
          </div>
          <div style={{ marginBottom: '1.6rem' }}>
            <label style={s.label}>썸네일 이미지 URL (선택)</label>
            <input style={s.input} type="url" placeholder="비워두면 영상 첫 프레임 사용" value={form.thumb_url} onChange={e => setForm(p => ({ ...p, thumb_url: e.target.value }))} />
          </div>
          <div style={{ ...s.grid, marginBottom: '1.6rem' }}>
            <div>
              <label style={s.label}>인플루언서 계정명</label>
              <input style={s.input} type="text" placeholder="@ 빼고 입력 (예: influencer1)" value={form.handle} onChange={e => setForm(p => ({ ...p, handle: e.target.value }))} />
            </div>
            <div>
              <label style={s.label}>인스타 원본 링크 (선택)</label>
              <input style={s.input} type="url" placeholder="https://www.instagram.com/p/XXXXX/" value={form.insta_url} onChange={e => setForm(p => ({ ...p, insta_url: e.target.value }))} />
            </div>
          </div>
          <div style={{ marginBottom: '2rem' }}>
            <label style={s.label}>캡션 (게시물 설명)</label>
            <input style={s.input} type="text" placeholder="영상 아래에 표시될 설명 문구" value={form.caption} onChange={e => setForm(p => ({ ...p, caption: e.target.value }))} />
          </div>
          {msg && <div style={{ marginBottom: '1.2rem', padding: '1rem 1.4rem', background: msg.startsWith('✅') ? '#f0fff4' : msg.startsWith('❌') ? '#fff5f5' : '#fffbea', borderRadius: '0.8rem', fontSize: '1.3rem', color: '#333' }}>{msg}</div>}
          <button style={{ ...s.btn, ...s.btnPrimary, opacity: saving ? 0.7 : 1 }} type="submit" disabled={saving}>
            {saving ? '저장 중...' : '영상 추가'}
          </button>
        </form>
      </div>

      {/* 영상 목록 */}
      <div style={s.card}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '2rem', color: '#111' }}>📋 등록된 영상</h2>
        {loading ? (
          <div style={s.empty}>불러오는 중...</div>
        ) : videos.length === 0 ? (
          <div style={s.empty}>아직 등록된 영상이 없습니다.<br />위에서 영상을 추가해보세요!</div>
        ) : (
          <div style={s.videoList}>
            {videos.map((v, i) => (
              <div key={v.id} style={s.videoItem}>
                <div style={{ ...s.thumb, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#ccc' }}>
                  {v.thumb_url
                    ? <img src={v.thumb_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                    : '🎬'
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '1.4rem', marginBottom: '0.4rem' }}>@{v.handle || '(계정명 없음)'}</div>
                  <div style={{ color: '#666', fontSize: '1.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.caption || '(캡션 없음)'}</div>
                  <div style={{ color: '#aaa', fontSize: '1.1rem', marginTop: '0.4rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.src_url}</div>
                </div>
                <button style={s.btnDanger} onClick={() => removeVideo(v.id)}>삭제</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ ...s.card, background: '#f0f9ff', border: '1.5px solid #bae6fd' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0369a1', marginBottom: '1rem' }}>💡 영상 업로드 방법</h3>
        <ol style={{ fontSize: '1.3rem', color: '#0369a1', lineHeight: 2, paddingLeft: '1.6rem' }}>
          <li>카페24 관리자 → 상품 → 파일 매니저</li>
          <li>MP4 파일 업로드</li>
          <li>업로드된 파일 우클릭 → URL 복사</li>
          <li>위 "영상 URL" 칸에 붙여넣기</li>
        </ol>
      </div>
    </div>
  );
}

export default function Admin() {
  return <Suspense><AdminPage /></Suspense>;
}
