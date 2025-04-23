import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);
oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }
  try {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const eventData = req.body;  // リクエストボディ(JSON)からイベント情報を取得
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: eventData   // リクエストのJSONをそのままイベント情報として利用
    });
    res.status(200).json(response.data);  // 作成されたイベントの詳細を返す
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ error: err.message });
  }
}
