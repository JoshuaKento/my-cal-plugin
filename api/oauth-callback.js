import { google } from 'googleapis';
import cookie from 'cookie';

const REDIRECT_URI =
  process.env.REDIRECT_URI || `https://${process.env.VERCEL_URL}/api/oauth-callback`;

export default async function handler(req, res) {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      REDIRECT_URI            // ← auth.js と完全一致させる
    );

    // 認可コードをトークンに交換
    const { tokens } = await oauth2Client.getToken(req.query.code);

    // 取得した refresh_token などを Cookie に保存（開発時用）
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('tokens', JSON.stringify(tokens), {
        httpOnly: true,
        secure: true,
        path: '/',
        maxAge: 60 * 60 * 24
      })
    );

    res.send('認可完了！このウィンドウを閉じて ChatGPT に戻ってください。');
  } catch (err) {
    console.error('OAuth callback error:', err);
    res.status(500).json({ error: 'oauth_callback_error', detail: err.message });
  }
}
