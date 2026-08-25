# aneki

**Aneki's Software Shack** — a hand-curated index of my public projects.
Live at <https://joshuaboys.github.io/aneki/>.

## What's here

| File | Purpose |
| --- | --- |
| `index.html` | Page structure and copy |
| `styles.css` | All styling — CRT grid, scanlines, neon cards |
| `projects.js` | **The inventory.** The only file you edit to add or drop a project |
| `app.js` | Renders the inventory into the page |
| `assets/` | Social icons |
| `.nojekyll` | Tells Pages to serve the files as-is, no Jekyll build |

Static HTML, CSS, and vanilla JS. No build step, no dependencies, no trackers.

## Adding a project

Open `projects.js` and add an entry to `FEATURED` (the big cards) or
`BACK_ROOM` (the compact list):

```js
{
  name: 'thing',
  href: 'https://github.com/joshuaboys/thing',
  lang: 'Rust',
  tags: ['cli', 'agents'],
  blurb: 'One or two sentences. Present tense.',
  status: 'live',        // 'live' | 'wip' | 'cold'
}
```

Commit and push to `main`. Pages redeploys in about a minute.

## Working on it locally

Everything is same-origin and script-tag loaded, so opening `index.html`
straight off the filesystem works. If you'd rather serve it:

```sh
python3 -m http.server 8000
```

## Deployment

GitHub Pages, from the default branch of this repo.
Settings → Pages → *Deploy from a branch* → `main` / `/ (root)`.

Because the repo is named `aneki` rather than `joshuaboys.github.io`, the
site is served from the `/aneki/` subpath. Every path in the page is
relative, so it works there unchanged — and would work just as well at a
domain root or behind a custom domain if you ever move it.
