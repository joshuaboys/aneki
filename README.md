# aneki

**Aneki's Software Shack** — a hand-curated index of my public projects.
Live at <https://joshuaboys.github.io/aneki/>.

## What's here

| File | Purpose |
| --- | --- |
| `index.html` | Page structure and copy |
| `styles.css` | All styling — CRT grid, scanlines, neon cards |
| `projects.js` | **The inventory.** The only file you edit to add or drop a project |
| `app.js` | Renders the inventory, fetches the live counts |
| `assets/` | Social icons |
| `.nojekyll` | Tells Pages to serve the files as-is, no Jekyll build |

Static HTML, CSS, and vanilla JS. No build step, no dependencies, no trackers.

## Live counts

Stars, forks, and last-push times are read at page load from one unauthenticated
call to the public GitHub API:

```
GET https://api.github.com/users/joshuaboys/repos?per_page=100&sort=pushed
```

One request covers every ware on the page. The response is cached in
`sessionStorage` for 30 minutes, so a reload inside the same tab costs nothing
and the 60-requests-per-hour anonymous rate limit is never a concern.

Repos are matched by parsing `owner/name` out of each entry's `href`, so nothing
in `projects.js` needs to change when you add a project. Entries that don't
point at GitHub simply get no badges.

If the call fails — offline, rate-limited, GitHub down, JS blocked — the page
renders exactly as it would have otherwise: the badges never appear and the
stat line falls back to a plain count. Nothing is ever left half-drawn.

To turn the whole thing off, delete the `fetchStats()` call at the bottom of
`app.js`. Everything else keeps working.

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

Commit and push to `main`. Pages redeploys in about a minute. Badges and the
language dot colour appear on their own — `lang` only needs to match a key in
the `LANG_COLOR` map in `app.js` to get GitHub's own colour, and falls back to
cyan if it doesn't.

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
