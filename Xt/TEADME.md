# 🎵 M3U Playlist Filter

Filters video formats from https://rkdyiptv.pages.dev/Xt playlist.

## 🚀 Features

- Removes MP4, MKV, AVI, FLV, WebM, TS, MOV, WMV, M4V, MPG, MPEG, 3GP, OGV
- Keeps audio streams
- CORS enabled
- Cloudflare edge network

## 📁 Structure
```
├── functions/
│   └── api.js          # API endpoint
├── index.html          # Homepage
└── README.md
```

## 🌐 Deployment

1. **GitHub:**
   - Create repository
   - Upload these 3 files

2. **Cloudflare Pages:**
   - Dashboard → Workers & Pages → Create
   - Pages → Connect to Git
   - Select repository
   - Deploy

## 📺 Usage
```
https://your-project.pages.dev/api
```

### VLC
```
Media → Open Network Stream
Paste API URL
```

### cURL
```bash
curl "https://your-project.pages.dev/api" -o playlist.m3u
```

## ⚙️ Configuration

Source URL is configured in `functions/api.js`:
```javascript
const M3U_PLAYLIST_URL = 'https://rkdyiptv.pages.dev/Xt';
```

## 📊 Response Headers

- `X-Total-Streams`: Filtered count
- `X-Removed-Streams`: Removed count
- `X-Original-Streams`: Original count

## 🔒 Security

- CORS enabled
- No data stored
- Edge cached (5 min)

## 📝 License

MIT - Free to use

---

Powered by Cloudflare Pages
```

---

# 🎯 DEPLOYMENT STEPS

## **Step 1: GitHub Repository (2 min)**

1. Go to: https://github.com/new
2. Repository name: `m3u-filter`
3. Description: `M3U playlist filter`
4. Visibility: **Public**
5. Click **"Create repository"**

## **Step 2: Upload Files (5 min)**

### **File by file upload:**

**1. Create `functions/api.js`:**
- Click "creating a new file"
- Name: `functions/api.js` (type exactly like this)
- Copy-paste **FILE 1** from above
- Scroll down, click **"Commit new file"**

**2. Create `index.html`:**
- Click "Add file" → "Create new file"
- Name: `index.html`
- Copy-paste **FILE 2** from above
- Click **"Commit new file"**

**3. Create `README.md`:**
- Click "Add file" → "Create new file"
- Name: `README.md`
- Copy-paste **FILE 3** from above
- Click **"Commit new file"**

## **Step 3: Cloudflare Pages (3 min)**

1. Go to: https://dash.cloudflare.com/
2. Click **"Workers & Pages"** (left sidebar)
3. Click **"Create application"**
4. Click **"Pages"** tab
5. Click **"Connect to Git"**
6. Authorize GitHub (if first time)
7. Select repository: `m3u-filter`
8. Click **"Begin setup"**
9. Settings:
   - **Framework preset:** None
   - **Build command:** (leave empty)
   - **Build output directory:** `/`
10. Click **"Save and Deploy"**
11. Wait 2-3 minutes ☕

## **Step 4: Get Your URL ✅**

After deployment completes:
```
https://m3u-filter-xxx.pages.dev/
```

API endpoint:
```
https://m3u-filter-xxx.pages.dev/api
