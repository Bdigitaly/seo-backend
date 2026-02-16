// lib/oauth.js
import { OAuth2Client } from 'googleapis/build/src/googleapis.js';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const BING_CLIENT_ID = process.env.BING_CLIENT_ID;
const BING_CLIENT_SECRET = process.env.BING_CLIENT_SECRET;

// Google OAuth2 Client
export const googleOauth2Client = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  `${process.env.VERCEL_URL || 'https://seo-backend.vercel.app'}/api/gsc/callback`
);

// Bing OAuth2 Client
export const bingOauth2Client = new OAuth2Client(
  BING_CLIENT_ID,
  BING_CLIENT_SECRET,
  `${process.env.VERCEL_URL || 'https://seo-backend.vercel.app'}/api/bing/callback`
);

// Token Encryption Helper
export async function encryptToken(token) {
  const secret = process.env.ENCRYPTION_KEY || 'your-secret-key-change-this';
  const jose = await import('jose');
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(token));
  
  const jwt = await new jose.SignJWT({ token: JSON.stringify(token) })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(new TextEncoder().encode(secret));
    
  return jwt;
}

export async function decryptToken(encryptedToken) {
  const secret = process.env.ENCRYPTION_KEY || 'your-secret-key-change-this';
  const jose = await import('jose');
  
  try {
    const { payload } = await jose.jwtVerify(encryptedToken, 
      new TextEncoder().encode(secret)
    );
    return JSON.parse(payload.token);
  } catch {
    return null;
  }
}

// Get User Token from Cookie/Headers
export async function getUserToken(req, service = 'gsc') {
  const tokenCookie = req.headers.cookie?.match(new RegExp(`${service}_token=([^;]+)`));
  if (tokenCookie) {
    return await decryptToken(tokenCookie[1]);
  }
  return null;
}

export default {
  googleOauth2Client,
  bingOauth2Client,
  encryptToken,
  decryptToken,
  getUserToken
};
