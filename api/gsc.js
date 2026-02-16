import { google } from 'googleapis';

export default async function handler(req, res) {
  const { action } = req.query;

  if (action === 'auth_url') {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${req.headers.host}/api/gsc/callback`
    );
    
    const url = oauth2Client.generateAuthUrl({
      scope: ['https://www.googleapis.com/auth/webmasters.readonly'],
      state: req.headers.referer || '/integrations'
    });
    
    res.json({ authUrl: url });
  }

  res.status(400).json({ error: 'Unknown action' });
}
