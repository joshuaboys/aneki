/* Renders the shack from projects.js. No dependencies, no build step.
 *
 * Live counts (stars / forks / last push) come from one unauthenticated call
 * to the public GitHub API, cached in sessionStorage for the tab. If the call
 * fails, is rate-limited, or the visitor is offline, the page renders exactly
 * as it did before — the badges simply never appear.
 */
(function () {
  'use strict';

  var GH_USER   = 'joshuaboys';
  var GH_CACHE  = 'shack.gh.v1';
  var GH_TTL_MS = 30 * 60 * 1000;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* GitHub's own language colours, for the wares we actually stock. */
  var LANG_COLOR = {
    rust:       '#dea584',
    typescript: '#3178c6',
    javascript: '#f1e05a',
    python:     '#3572a5',
    shell:      '#89e051',
    go:         '#00add8',
    lua:        '#000080',
    html:       '#e34c26',
    css:        '#563d7c',
    skill:      '#00f0ff',
  };

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function link(href, text) {
    var a = el('a', null, text);
    a.href = href;
    if (/^https?:/.test(href)) { a.rel = 'noopener'; }
    return a;
  }

  /* ---- github plumbing ---- */

  /* 'https://github.com/joshuaboys/gx' -> 'joshuaboys/gx' (null if not a repo) */
  function slugOf(href) {
    var m = /^https?:\/\/github\.com\/([^\/]+)\/([^\/?#]+)/.exec(href || '');
    if (!m) return null;
    return (m[1] + '/' + m[2]).replace(/\.git$/, '').toLowerCase();
  }

  function cacheRead() {
    try {
      var raw = sessionStorage.getItem(GH_CACHE);
      if (!raw) return null;
      var o = JSON.parse(raw);
      if (!o || typeof o.t !== 'number' || (Date.now() - o.t) > GH_TTL_MS) return null;
      return o.d;
    } catch (e) { return null; }
  }

  function cacheWrite(data) {
    try { sessionStorage.setItem(GH_CACHE, JSON.stringify({ t: Date.now(), d: data })); }
    catch (e) { /* private mode, quota, whatever — the cache is optional */ }
  }

  function fetchStats() {
    var cached = cacheRead();
    if (cached) return Promise.resolve(cached);
    if (typeof fetch !== 'function') return Promise.resolve(null);

    var url = 'https://api.github.com/users/' + GH_USER + '/repos?per_page=100&sort=pushed';
    return fetch(url, { headers: { Accept: 'application/vnd.github+json' } })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (list) {
        if (!Array.isArray(list)) return null;
        var out = {};
        list.forEach(function (r) {
          if (!r || !r.full_name) return;
          out[r.full_name.toLowerCase()] = {
            stars:  r.stargazers_count || 0,
            forks:  r.forks_count || 0,
            pushed: r.pushed_at || null,
          };
        });
        cacheWrite(out);
        return out;
      })
      .catch(function () { return null; });
  }

  /* 90061 seconds ago -> '1d'. Terse on purpose; it sits in a badge. */
  function ago(iso) {
    if (!iso) return null;
    var secs = (Date.now() - new Date(iso).getTime()) / 1000;
    if (!isFinite(secs) || secs < 0) return null;
    var units = [['y', 31536000], ['mo', 2592000], ['w', 604800], ['d', 86400], ['h', 3600], ['m', 60]];
    for (var i = 0; i < units.length; i++) {
      if (secs >= units[i][1]) return Math.floor(secs / units[i][1]) + units[i][0];
    }
    return 'now';
  }

  /* 1248 -> '1.2k'. Four-digit star counts would blow out the badge row. */
  function compact(n) {
    if (n < 1000) return String(n);
    return (n / 1000).toFixed(n < 10000 ? 1 : 0).replace(/\.0$/, '') + 'k';
  }

  function plural(n, word) { return n + ' ' + word + (n === 1 ? '' : 's'); }

  function badge(cls, glyph, value, title) {
    var li = el('li', 'badge ' + cls);
    li.title = title;
    var g = el('span', 'badge-glyph', glyph);
    g.setAttribute('aria-hidden', 'true');
    li.appendChild(g);
    li.appendChild(el('span', 'badge-value', value));
    var sr = el('span', 'sr-only', ' ' + title);
    li.appendChild(sr);
    return li;
  }

  /* Fills every [data-repo] holder on the page once the counts land. */
  function paintBadges(stats) {
    if (!stats) return;
    var holders = document.querySelectorAll('[data-repo]');
    Array.prototype.forEach.call(holders, function (node) {
      var s = stats[node.getAttribute('data-repo')];
      if (!s) return;
      var mount = node.querySelector('.badges');
      if (!mount) return;

      if (s.stars) mount.appendChild(badge('badge-star', '★', compact(s.stars), plural(s.stars, 'star')));
      if (s.forks) mount.appendChild(badge('badge-fork', '⑂', compact(s.forks), plural(s.forks, 'fork')));
      var when = ago(s.pushed);
      if (when) mount.appendChild(badge('badge-time', '↻', when, 'last push ' + when + ' ago'));

      if (mount.childNodes.length) mount.classList.add('is-lit');
    });
  }

  /* ---- clone button ---- */

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      ok ? resolve() : reject(new Error('copy failed'));
    });
  }

  function cloneButton(href, name) {
    var cmd = 'git clone ' + href.replace(/\/$/, '') + '.git';
    var b = el('button', 'clone');
    b.type = 'button';
    b.title = cmd;
    b.setAttribute('aria-label', 'Copy the git clone command for ' + name);

    var glyph = el('span', 'clone-glyph', '⧉');
    glyph.setAttribute('aria-hidden', 'true');
    b.appendChild(glyph);
    b.appendChild(el('span', 'clone-label', 'clone'));

    b.addEventListener('click', function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      copyText(cmd).then(function () {
        b.classList.add('is-copied');
        b.querySelector('.clone-label').textContent = 'copied';
        b.querySelector('.clone-glyph').textContent = '✓';
        setTimeout(function () {
          b.classList.remove('is-copied');
          b.querySelector('.clone-label').textContent = 'clone';
          b.querySelector('.clone-glyph').textContent = '⧉';
        }, 1500);
      }).catch(function () {
        b.querySelector('.clone-label').textContent = 'copy failed';
        setTimeout(function () { b.querySelector('.clone-label').textContent = 'clone'; }, 1500);
      });
    });

    return b;
  }

  /* ---- featured cards ---- */

  function langChip(lang) {
    var chip = el('li', 'chip chip-lang', lang);
    var color = LANG_COLOR[String(lang).toLowerCase()];
    if (color) chip.style.setProperty('--lang', color);
    return chip;
  }

  function renderCards(list, mount) {
    list.forEach(function (p) {
      var li = el('li', 'card');
      var slug = slugOf(p.href);
      if (slug) li.setAttribute('data-repo', slug);

      var top = el('div', 'card-top');
      var h3 = el('h3', 'card-name');
      h3.appendChild(link(p.href, p.name));
      top.appendChild(h3);

      var st = p.status || 'live';
      var label = { live: 'in stock', wip: 'on the bench', cold: 'cold storage' }[st] || st;
      top.appendChild(el('span', 'status status-' + st, label));
      li.appendChild(top);

      li.appendChild(el('p', 'card-blurb', p.blurb));

      var chips = el('ul', 'chips');
      if (p.lang) chips.appendChild(langChip(p.lang));
      (p.tags || []).forEach(function (t) { chips.appendChild(el('li', 'chip', t)); });
      li.appendChild(chips);

      var foot = el('div', 'card-foot');
      foot.appendChild(el('ul', 'badges'));          /* filled once the API answers */
      if (slug) foot.appendChild(cloneButton(p.href, p.name));
      li.appendChild(foot);

      mount.appendChild(li);
    });
  }

  /* ---- back room rows ---- */

  function renderRows(list, mount) {
    list.forEach(function (p) {
      var li = el('li', 'row');
      var slug = slugOf(p.href);
      if (slug) li.setAttribute('data-repo', slug);

      var name = el('span', 'row-name');
      name.appendChild(link(p.href, p.name));
      li.appendChild(name);

      li.appendChild(el('span', 'row-blurb', p.blurb));

      var meta = el('span', 'row-meta');
      meta.appendChild(el('ul', 'badges'));
      var lang = el('span', 'row-lang', p.lang || '');
      var color = LANG_COLOR[String(p.lang).toLowerCase()];
      if (color) lang.style.setProperty('--lang', color);
      if (p.lang) lang.classList.add('has-dot');
      meta.appendChild(lang);
      li.appendChild(meta);

      mount.appendChild(li);
    });
  }

  /* ---- comms ---- */

  function renderComms(list, mount) {
    list.forEach(function (c) {
      var li = el('li', 'comm');

      if (c.icon) {
        var img = el('img');
        img.src = c.icon;
        img.alt = '';
        img.setAttribute('aria-hidden', 'true');
        img.width = 20; img.height = 20;
        li.appendChild(img);
      } else {
        var g = el('span', 'glyph', '◈');
        g.setAttribute('aria-hidden', 'true');
        li.appendChild(g);
      }

      var text = el('span', 'comm-text');
      text.appendChild(el('span', 'comm-name', c.name));
      var handle = el('span', 'comm-handle');
      handle.appendChild(link(c.href, c.handle));
      text.appendChild(handle);
      li.appendChild(text);

      mount.appendChild(li);
    });
  }

  /* ---- the stat line in the boot terminal ---- */

  function renderTally(all, stats) {
    var mount = document.getElementById('tally-out');
    if (!mount) return;

    var parts = [all.length + ' wares indexed'];

    if (stats) {
      var stars = 0, newest = 0;
      all.forEach(function (p) {
        var s = stats[slugOf(p.href) || ''];
        if (!s) return;
        stars += s.stars;
        var t = s.pushed ? new Date(s.pushed).getTime() : 0;
        if (t > newest) newest = t;
      });
      if (stars) parts.push('★ ' + stars + ' collected');
      var when = newest ? ago(new Date(newest).toISOString()) : null;
      if (when) parts.push('last push ' + when + ' ago');
    }

    mount.textContent = parts.join(' · ');
    mount.classList.add('is-lit');
  }

  /* ---- title glitch: once on load, then on hover ---- */

  function wireGlitch() {
    var title = document.querySelector('.title');
    if (!title || reduced) return;

    function fire() {
      title.classList.remove('glitching');
      void title.offsetWidth;            // restart the animation
      title.classList.add('glitching');
    }
    title.addEventListener('mouseenter', fire);
    setTimeout(fire, 700);
  }

  /* ---- boot lines type themselves in ---- */

  function wireBoot() {
    var lines = Array.prototype.slice.call(document.querySelectorAll('.boot-line'));
    if (!lines.length || reduced) return;

    lines.forEach(function (l, i) {
      l.style.opacity = '0';
      setTimeout(function () {
        l.style.transition = 'opacity .18s ease';
        l.style.opacity = '1';
      }, 120 * i);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var featured = typeof FEATURED !== 'undefined' ? FEATURED : [];
    var backRoom = typeof BACK_ROOM !== 'undefined' ? BACK_ROOM : [];

    renderCards(featured, document.getElementById('cards'));
    renderRows(backRoom, document.getElementById('stack'));
    renderComms(typeof COMMS !== 'undefined' ? COMMS : [], document.getElementById('comms-list'));
    wireBoot();
    wireGlitch();

    var all = featured.concat(backRoom);
    renderTally(all, null);                          /* honest count with no network */
    fetchStats().then(function (stats) {
      paintBadges(stats);
      if (stats) renderTally(all, stats);
    });
  });
})();
