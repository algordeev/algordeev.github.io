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

## Pixel character

`pixel-character.js` draws a character refined from Aleksandr’s photos, with
swept-back sandy hair, a detailed oval face, a blue T-shirt, dark trousers, and white shoes. Its canvas sprite needs no external
images or libraries. The interaction is inspired by
[Nisa Kocageniş’s portfolio](https://nisakocagenis.github.io/).

- Run with **← / →** or **A / D**; jump with **↑**, **W**, or **Space**.
- Click an empty part of the page to move there; click the character to jump.
- On mobile, tap **?** for controls, hold the arrow buttons to run, and tap **↑** to jump.
- The compact corner button shows **Hide me / Show pixel me** in English and remembers your choice. Labels follow RU / EN / TR.
- Instructions appear for 2.4 seconds on startup, then on hover or keyboard focus.
  The **?** button also opens them on touch screens.
- Each section, including the introduction, has its own friendly speech bubble
  in RU / EN / TR. Messages appear as you scroll, disappear after a few seconds,
  and appear again when you return to a section. Edit them in `sectionCopy`.
- The character wanders automatically, pauses for menus and dialogs, and clears
  movement when the window loses focus. With reduced motion enabled it starts
  hidden and, when shown, only moves in response to input.

Adjust `palette`, `portrait`, `body`, and `legs` in `pixel-character.js` to change its appearance;
the companion layout is at the end of `style.css`.
