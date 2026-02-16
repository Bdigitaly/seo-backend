export default async function handler(req, res) {
  const oauth2Client = new (await import('googleapis')).google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'https://seo-backend-ecru.vercel.app/api/gsc/callback'
  );

  const authUrl = oauth2Client.generateAuthUrl({
    scope: ['https://www.googleapis.com/auth/webmasters.readonly'],
    state: 'integrations',
    access_type: 'offline',
    prompt: 'consent'
  });

  res.json({ authUrl });
}
