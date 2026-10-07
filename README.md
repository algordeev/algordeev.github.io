# Personal portfolio (GitHub Pages)

Static site: `index.html` + `style.css`. No build step.

## Folder layout

```
index.html
style.css
assets/
  cv.pdf            <- your CV
  me.jpg            <- optional portrait
  tram-demo.mp4     <- project video
  tram-poster.jpg   <- video thumbnail
  asv-1.jpg ...     <- project images
```

## Deploy on GitHub Pages

1. Create a repo named **`algordeev.github.io`** (your username + `.github.io`) on GitHub. This gives you the URL `https://algordeev.github.io`.
   Any other repo name also works, but the site will then live at `https://algordeev.github.io/<repo-name>/`.
2. Put these files in the repo root and push:
   ```bash
   git init
   git add .
   git commit -m "Add portfolio site"
   git branch -M main
   git remote add origin https://github.com/algordeev/algordeev.github.io.git
   git push -u origin main
   ```
3. On GitHub: **Settings -> Pages -> Build and deployment -> Source: Deploy from a branch -> Branch: `main` / `(root)` -> Save**.
4. After a minute or two the site is live.

## Adding content

- **Project:** copy one `<article class="card">...</article>` block in `index.html`.
- **Video:** use a short `.mp4` (H.264). Keep each file under about 25 MB; GitHub warns above 50 MB and blocks files over 100 MB. For long videos, upload to YouTube and replace the `<video>` tag with the embed `<iframe>`.
- **Images:** resize to about 1600 px wide and export as JPG or WebP to keep the page fast.
- **Placeholders:** search `index.html` for `your.email@example.com`, `href="#"` and the `assets/` file names and replace them with real ones.

## Preview locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```
