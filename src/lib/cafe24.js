const CLIENT_ID = process.env.CAFE24_CLIENT_ID;
const CLIENT_SECRET = process.env.CAFE24_CLIENT_SECRET;
const REDIRECT_URI = process.env.CAFE24_REDIRECT_URI;

// OAuth 인증 URL 생성
export function getAuthUrl(mallId) {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: 'mall.read_scripttag,mall.write_scripttag',
    state: mallId,
  });
  return `https://${mallId}.cafe24api.com/api/v2/oauth/authorize?${params}`;
}

// 코드 → 토큰 교환
export async function exchangeCode(mallId, code) {
  const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const res = await fetch(`https://${mallId}.cafe24api.com/api/v2/oauth/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });
  if (!res.ok) throw new Error('토큰 교환 실패');
  return res.json();
}

// 스크립트 태그 등록
export async function registerScriptTag(mallId, accessToken, scriptUrl) {
  const res = await fetch(`https://${mallId}.cafe24api.com/api/v2/admin/scripttags`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Cafe24-Api-Version': '2024-06-01',
    },
    body: JSON.stringify({
      request: {
        event: 'onload',
        src: scriptUrl,
        exclude_path: ['/order/', '/member/login', '/member/join'],
      },
    }),
  });
  const json = await res.json();
  return json.scripttag?.no;
}
