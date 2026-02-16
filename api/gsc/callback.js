export default async function handler(req, res) {
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  try {
    const oauth2Client = new (await import('googleapis')).google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'https://seo-backend-ecru.vercel.app/api/gsc/callback'
    );

    const { tokens } = await oauth2Client.getToken(code);
    
    // Mock token save
    res.setHeader('Set-Cookie', `gsc_token=${tokens.access_token}; HttpOnly; Secure`);
    
    res.redirect('https://your-sticklight-app.com/integrations?status=connected');
  } catch (error) {
    res.status(500).json({ error: 'OAuth failed', details: error.message });
  }
}
