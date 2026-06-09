'use client';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function InstallPage() {
  const params = useSearchParams();
  const mallId = params.get('mall_id');

  useEffect(() => {
    if (!mallId) return;
    // Cafe24 관리자에서 열릴 때 바로 OAuth로 이동
    const authUrl = `/api/auth?mall_id=${mallId}`;
    window.location.href = authUrl;
  }, [mallId]);

  if (!mallId) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: '1.6rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', maxWidth: '480px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.6rem' }}>🎬</div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 700, marginBottom: '0.8rem', color: '#111' }}>인별위젯</h1>
          <p style={{ fontSize: '1.5rem', color: '#666', lineHeight: 1.6 }}>
            카페24 앱스토어에서 설치해주세요.<br />
            인플루언서 영상을 쇼핑몰에 쇼츠처럼 보여주는 위젯입니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <p style={{ color: '#666', fontSize: '1.6rem' }}>인증 중... 잠시만 기다려주세요.</p>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense>
      <InstallPage />
    </Suspense>
  );
}
