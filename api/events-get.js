import { google } from 'googleapis';
import cookie from 'cookie';

export default async function handler(req, res) {
  const cookies = cookie.parse(req.headers.cookie || '');
  if (!cookies.tokens) return res.status(401).send('Unauthorized');
  const tokens = JSON.parse(cookies.tokens);
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials(tokens);
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  const events = await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    maxResults: 10,
  });
  res.json(events.data);
}
