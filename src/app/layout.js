export const metadata = { title: '인별위젯 - SNS 클립 갤러리' };

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', background: '#f5f5f5' }}>
        {children}
      </body>
    </html>
  );
}
