import { google } from 'googleapis';

export default function handler(req, res) {
  // 本番・プレビューは https:// を付ける
  const prodRedirect = `https://${process.env.VERCEL_URL}/api/oauth-callback`;
  // ローカル開発用
  const localRedirect = 'http://localhost:3000/api/oauth-callback';

  const redirectUri =
    process.env.VERCEL_ENV === 'development' ? localRedirect : prodRedirect;

  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    redirectUri
  );

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar.events']
  });

  res.redirect(url);
}
