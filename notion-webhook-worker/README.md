# Notion Webhook Worker

This Cloudflare Worker receives webhooks from Notion and triggers GitHub Actions deployment via GitHub Repository Dispatch API.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Set up GitHub Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` scope
3. Copy the token

### 3. Configure Worker secrets

```bash
npx wrangler secret put GITHUB_TOKEN
# Paste your GitHub PAT when prompted
```

### 4. Deploy the Worker

```bash
npm run deploy
```

After deployment, note the Worker URL (e.g., `https://notion-webhook-worker.your-account.workers.dev`)

### 5. Configure Notion Webhook

1. Go to [Notion My Integrations](https://www.notion.so/my-integrations)
2. Select `blog-integraton2`
3. Go to "Webhook" tab
4. Click "Add subscription"
5. Set:
   - Endpoint URL: Your Worker URL
   - Events: `data_source.content_updated`
   - API version: `2022-06-28`
6. Save

## How it works

1. Notion sends webhook when database content is updated
2. Worker receives the webhook
3. Worker calls GitHub Repository Dispatch API
4. GitHub Actions workflow is triggered
5. Blog is built and deployed to Cloudflare Pages

## Development

```bash
# Start local development server
npm run dev

# Deploy to production
npm run deploy

# View logs
npx wrangler tail
```

