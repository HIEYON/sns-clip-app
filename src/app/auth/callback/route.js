import { NextResponse } from 'next/server';
import { exchangeCode } from '@/lib/cafe24';
import { registerScriptTag } from '@/lib/cafe24';
import { upsertStore, saveScriptTagNo } from '@/lib/supabase';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const mallId = searchParams.get('state'); // state에 mall_id 담았음

  if (!code || !mallId) {
    return new Response('잘못된 요청입니다.', { status: 400 });
  }

  try {
    // 1. 코드 → 액세스 토큰 교환
    const tokenData = await exchangeCode(mallId, code);
    const { access_token, refresh_token, expires_at } = tokenData;

    // 2. DB에 스토어 정보 저장
    await upsertStore({ mall_id: mallId, access_token, refresh_token, expires_at });

    // 3. 스크립트 태그 등록 (쇼핑몰에 위젯 자동 삽입)
    const scriptUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/widget-script?mall_id=${mallId}`;
    const scriptTagNo = await registerScriptTag(mallId, access_token, scriptUrl);
    if (scriptTagNo) await saveScriptTagNo(mallId, scriptTagNo);

    // 4. 관리자 페이지로 이동 (쿠키에 mall_id 저장)
    const res = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/admin?mall_id=${mallId}`);
    res.cookies.set('mall_id', mallId, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 60 * 60 * 24 * 30 });
    return res;
  } catch (e) {
    console.error('OAuth 처리 오류:', e);
    return new Response('인증 처리 중 오류가 발생했습니다: ' + e.message, { status: 500 });
  }
}
