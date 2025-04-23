import { google } from 'googleapis';

// OAuth2クライアントを再度初期化（認可フローと同じ値を使用）
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export default async function handler(req, res) {
  const code = req.query.code;  // GoogleからのリダイレクトURLに含まれる認可コード
  if (!code) {
    return res.status(400).send("Missing code parameter");
  }
  try {
    // 認可コードと引き換えにアクセストークン＆リフレッシュトークンを取得
    const { tokens } = await oauth2Client.getToken(code);
    const refreshToken = tokens.refresh_token;
    // 取得したリフレッシュトークンを表示（JSONで応答）
    res.status(200).json({ "refresh_token": refreshToken });
    // ※この出力されたrefresh_tokenをコピーし、後述する環境変数GOOGLE_REFRESH_TOKENに設定します
  } catch (err) {
    console.error('Error exchanging code for tokens:', err);
    res.status(500).send("Authentication failed");
  }
}
