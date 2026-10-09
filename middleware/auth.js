import { parseCookies, serializeCookie } from '@maganya/cross-cookie';
import { db } from '../config/db.js';

export async function requireAuth(req, res, next) {
  const cookies = parseCookies(req.headers.cookie || '');
  const sessionToken = cookies['session_token'];

  if (!sessionToken) {
    return res.redirect('/login');
  }

  if (!db) {
    return res.status(503).send('Database connection is not configured.');
  }

  try {
    const users = await db`
      SELECT users.id, users.email, users.full_name
      FROM sessions
      JOIN users ON users.id = sessions.user_id
      WHERE sessions.token = ${sessionToken} AND sessions.expires_at > NOW()
    `;

    if (users.length === 0) {
      const expiredCookie = serializeCookie('session_token', '', { path: '/', maxAge: 0 });
      res.setHeader('Set-Cookie', expiredCookie);
      return res.redirect('/login');
    }

    req.user = users[0];
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    res.status(500).send('Authentication service unavailable.');
  }
}
