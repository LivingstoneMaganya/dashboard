import dotenv from 'dotenv';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import { parseCookies, serializeCookie } from '@maganya/cross-cookie';
import { db, initDatabase } from './config/db.js';
import { requireAuth } from './middleware/auth.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

await initDatabase();

app.get('/', (req, res) => {
  const cookies = parseCookies(req.headers.cookie || '');
  if (cookies['session_user']) {
    return res.redirect('/dashboard');
  }
  res.redirect('/login');
});

app.get('/register', (req, res) => {
  res.render('register', { error: null });
});

app.post('/register', async (req, res) => {
  const { email, password, full_name } = req.body;

  if (!db) {
    return res.render('register', { error: 'Database connection is not configured.' });
  }

  try {
    const existing = await db`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
      return res.render('register', { error: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db`INSERT INTO users (email, password_hash, full_name) VALUES (${email}, ${hashedPassword}, ${full_name})`;

    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.render('register', { error: 'Failed to create account.' });
  }
});

app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!db) {
    return res.render('login', { error: 'Database connection is not configured.' });
  }

  try {
    const users = await db`SELECT * FROM users WHERE email = ${email}`;
    if (users.length === 0) {
      return res.render('login', { error: 'Invalid email or password.' });
    }

    const user = users[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.render('login', { error: 'Invalid email or password.' });
    }



    // Use @maganya/cross-cookie to serialize a secure session cookie
    const sessionCookie = serializeCookie('session_user', user.email, {
      httpOnly: true, // Prevents XSS script access in browser
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      path: '/',
      maxAge: 86400 // 24 hours
    });

    res.setHeader('Set-Cookie', sessionCookie);
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Server authentication error.' });
  }
});


app.get('/dashboard', requireAuth, async (req, res) => {
  try {
    const projects = await db`
      SELECT * FROM projects WHERE user_id = ${req.user.id} ORDER BY created_at DESC
    `;
    res.render('dashboard', { user: req.user, projects });
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error loading dashboard.');
  }
});

app.post('/projects', requireAuth, async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.redirect('/dashboard');
  }

  try {
    await db`INSERT INTO projects (user_id, title) VALUES (${req.user.id}, ${title})`;
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Project creation error:', err);
    res.status(500).send('Database error creating project.');
  }
});

// POST: Logout & Clear Cookie
app.post('/logout', (req, res) => {
  const expiredCookie = serializeCookie('session_user', '', { path: '/', maxAge: 0 });
  res.setHeader('Set-Cookie', expiredCookie);
  res.redirect('/login');
});

const server = app.listen(PORT, () => {
  console.log(`Production Dashboard running at http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Stop the other server or set a different PORT in .env.`);
    process.exit(1);
  }

  throw err;
});
