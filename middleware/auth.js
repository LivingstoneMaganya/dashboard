import { parseCookies, serializeCookie } from '@maganya/cross-cookie';
import { db } from '../config/db.js';

export async function requireAuth(req, res, next) {
  const cookies = parseCookies(req.headers.cookie || '');
  const sessionUserEmail = cookies['session_user'];

  if (!sessionUserEmail) {
    return res.redirect('/login');
  }

  if (!db) {
    return res.status(503).send('Database connection is not configured.');
  }

  try {
    const user = await db`SELECT id, email, full_name FROM users WHERE email = ${sessionUserEmail}`;

    if (user.length === 0) {
      const expiredCookie = serializeCookie('session_user', '', { path: '/', maxAge: 0 });
      res.setHeader('Set-Cookie', expiredCookie);
      return res.redirect('/login');
    }

    req.user = user[0];
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    res.status(500).send('Authentication service unavailable.');
  }
}
