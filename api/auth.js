import { google } from 'googleapis';

// OAuth2クライアントを初期化（リダイレクトURIは後述の環境変数に設定）
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// 要求するOAuthスコープ（予定の閲覧・作成に必要なカレンダーイベント権限）
const SCOPE = ['https://www.googleapis.com/auth/calendar.events'];

export default function handler(req, res) {
  // Googleの認可URLを生成（access_type=offlineでリフレッシュトークン取得を要求）
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPE,
    prompt: 'consent'  // 毎回同意画面を表示して確実にリフレッシュトークンを得る
  });
  console.log('Google Auth URL:', authUrl);
  // ユーザーをGoogleのOAuth同意画面へリダイレクト
  res.redirect(authUrl);
}
