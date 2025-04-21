import { google } from 'googleapis';

export default function handler(req, res) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    `${process.env.VERCEL_URL}/api/oauth-callback`
  );
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar.events'],
  });
  res.redirect(url);
}
