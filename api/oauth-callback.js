import { google } from 'googleapis';
import cookie from 'cookie';

export default async function handler(req, res) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    `${process.env.VERCEL_URL}/api/oauth-callback`
  );
  const { tokens } = await oauth2Client.getToken(req.query.code);
  // ブラウザにクッキーでトークンを保存
  res.setHeader('Set-Cookie', cookie.serialize('tokens', JSON.stringify(tokens), {
    httpOnly: true, secure: true, path: '/', maxAge: 60*60*24
  }));
  res.send('認可完了！このウィンドウを閉じて ChatGPT に戻ってください。');
}
