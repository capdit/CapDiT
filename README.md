# CapDiT Demo (Anonymous)

This folder contains a static demo website for anonymous paper submission.

## 1) Local Preview

Run from repository root:

```bash
cd paper_demo
python3 -m http.server 8080
```

Open:

- http://127.0.0.1:8080

## 2) Update Audio Entries

Edit `data/samples.json`.

Each sample looks like:

```json
{
  "id": "Sample-001",
  "category": "Laughter",
  "text": "Your sentence",
  "tracks": [
    { "name": "Ground Truth", "tag": "GT", "path": "../demo/gt/xxx.wav" },
    { "name": "CapDiT", "tag": "Ours", "path": "../demo/CosyVoice3_CapDiT/xxx.wav" },
    { "name": "Baseline", "tag": "FT", "path": "../demo/CosyVoice3_FT/xxx.wav" }
  ]
}
```

## 3) Publish on GitHub Pages (Anonymous)

1. Create a new anonymous GitHub account:

- Do not use your real name, email alias, institute, or avatar.
- Use a neutral username, for example `audio-demo-anon`.

2. Create a neutral repository name:

- Suggested names: `tts-audio-demo`, `speech-supplementary-demo`, `anonymous-tts-demo`.

3. Copy the demo folder contents into the new repo root:

```bash
cp -r paper_demo/. /path/to/your/new-repo/
```

4. Commit and push:

```bash
cd /path/to/your/new-repo
git init
git add .
git commit -m "Add anonymous CapDiT demo site"
git branch -M main
git remote add origin https://github.com/<anonymous-user>/<repo-name>.git
git push -u origin main
```

5. Enable Pages in repository settings:

- Go to Settings -> Pages.
- Build and deployment: choose GitHub Actions.
- The workflow file `.github/workflows/pages.yml` will deploy automatically.

6. Wait for deployment (usually 1-3 minutes), then visit:

- `https://<anonymous-user>.github.io/<repo-name>/`

Notes:

- This folder already includes `.github/workflows/pages.yml` and `.nojekyll`.
- If your audio is large, keep only necessary samples for review.

## 4) Anonymity Checklist

- Do not include author names, emails, institute names, lab names.
- Remove links to personal GitHub, homepage, social media.
- Avoid repository names containing your identity.
- Check audio file names for personal IDs.
- Confirm page metadata has no personal markers.
