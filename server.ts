import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN || 'automod_fb_secret_token_2026';

// CORS Middleware to allow requests from Vercel Frontend
app.use((req, res, next) => {
  const allowedOrigin = process.env.FRONTEND_URL || '*';
  res.header('Access-Control-Allow-Origin', allowedOrigin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// 1. Health check endpoint for Render
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'AutoMod FB Backend Server on Render',
    version: '1.0.0'
  });
});

// 2. Facebook Webhook Verification (Meta Hub Challenge)
app.get('/webhook', (req: Request, res: Response) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === FB_VERIFY_TOKEN) {
    console.log('[Facebook Webhook] Verified successfully by Meta!');
    return res.status(200).send(challenge);
  }

  res.sendStatus(403);
});

// 3. Facebook Webhook Receiver (Receive real-time feed comments)
app.post('/webhook', (req: Request, res: Response) => {
  const body = req.body;

  if (body.object === 'page') {
    body.entry?.forEach((entry: any) => {
      entry.changes?.forEach((change: any) => {
        if (change.field === 'feed' && change.value?.item === 'comment' && change.value?.verb === 'add') {
          const comment = change.value;
          console.log(`[FB Event] New comment from ${comment.from?.name}: "${comment.message}" (ID: ${comment.comment_id})`);
          // Moderation engine handles auto-hiding here
        }
      });
    });
    return res.status(200).send('EVENT_RECEIVED');
  }

  res.sendStatus(404);
});

// 4. API Proxy to hide comment on Facebook Graph API
app.post('/api/fb/hide', async (req: Request, res: Response) => {
  const { commentId, accessToken } = req.body;
  if (!commentId || !accessToken) {
    return res.status(400).json({ error: 'Missing commentId or accessToken' });
  }

  try {
    const fbRes = await fetch(`https://graph.facebook.com/v21.0/${commentId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_hidden: true, access_token: accessToken })
    }).then(r => r.json());

    return res.status(200).json(fbRes);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Serve frontend if running fullstack monolithic (fallback)
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('AutoMod FB Backend Server is running on Render.');
    }
  });
});

app.listen(PORT, () => {
  console.log(`[AutoMod FB] Server running on port ${PORT}`);
});
