import { google } from 'googleapis';

// OAuth2クライアントを初期化（redirectURIは不要なので省略可能）
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);
// 環境変数に保存したrefresh tokenを設定（アクセストークンは自動取得）
oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

export default async function handler(req, res) {
  try {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    // 今からの時間以降の予定を10件取得する例
    const now = new Date();
    const response = await calendar.events.list({
      calendarId: 'primary',               // プライマリカレンダーから取得
      timeMin: now.toISOString(),          // 現在時刻から後の予定を対象
      maxResults: 10,                      // 最大10件取得
      singleEvents: true,                  // 繰り返し予定は個々のイベントに分解
      orderBy: 'startTime'                 // 開始時間順にソート
    });
    // 取得したイベント一覧をそのままJSONでレスポンス
    res.status(200).json(response.data);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ error: err.message });
  }
}
