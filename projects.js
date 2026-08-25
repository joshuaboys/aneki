/* ---------------------------------------------------------------------------
 * THE INVENTORY  —  hand-curated. This is the only file you edit to add wares.
 *
 * Each entry:
 *   name  : display name (shown in the card header)
 *   href  : where the card links to
 *   lang  : language chip, or null to hide it
 *   tags  : short chips, keep to 2-3 or the card gets noisy
 *   blurb : one or two sentences, present tense, no marketing voice
 *   status: "live" | "wip" | "cold"  -> drives the little status dot
 * ------------------------------------------------------------------------- */

const FEATURED = [
  {
    name: 'gx',
    href: 'https://github.com/joshuaboys/gx',
    lang: 'Rust',
    tags: ['cli', 'git'],
    blurb: 'A fast git projects manager. Clone, jump, and organise every repo on the box from the terminal, without ever remembering where you put it.',
    status: 'live',
  },
  {
    name: 'forgekit',
    href: 'https://github.com/joshuaboys/forgekit',
    lang: 'Rust',
    tags: ['git', 'agents'],
    blurb: 'A share-nothing Git host for the agent era. Agents push to cheap durable storage, you review checkpoints, and only releases get promoted to GitHub. One static binary.',
    status: 'live',
  },
  {
    name: 'harness-router',
    href: 'https://github.com/joshuaboys/harness-router',
    lang: 'Rust',
    tags: ['cli', 'agents'],
    blurb: 'Routes multiple AI coding harness accounts and commands predictably, so the right job lands on the right account every time.',
    status: 'live',
  },
  {
    name: 'distil',
    href: 'https://github.com/joshuaboys/distil',
    lang: 'TypeScript',
    tags: ['mcp', 'tree-sitter'],
    blurb: 'Token-efficient code analysis for LLMs. Extracts structure instead of dumping text, so context windows go further.',
    status: 'live',
  },
  {
    name: 'occam',
    href: 'https://github.com/joshuaboys/occam',
    lang: 'Rust',
    tags: ['runtime', 'agents'],
    blurb: 'A stateless, Unix-style execution layer for bounded single-shot agent work. Drives local coding-agent CLIs — codex, claude, grok.',
    status: 'wip',
  },
  {
    name: 'steward',
    href: 'https://github.com/joshuaboys/steward',
    lang: 'TypeScript',
    tags: ['cli', 'agents'],
    blurb: 'A persistent identity that holds standing responsibility for one repository. It wakes when the world changes, does only the work required, records evidence, and returns to idle.',
    status: 'live',
  },
];

const BACK_ROOM = [
  {
    name: 'auto-aneki',
    href: 'https://github.com/joshuaboys/auto-aneki',
    lang: 'Python',
    blurb: 'Autonomous LLM pretraining on consumer GPUs. Built on the great work by @karpathy.',
  },
  {
    name: 'llm-wiki-stack',
    href: 'https://github.com/joshuaboys/llm-wiki-stack',
    lang: 'Shell',
    blurb: 'A production build of the Karpathy LLM Wiki pattern on a headless Linux server.',
  },
  {
    name: 'SITREP',
    href: 'https://github.com/joshuaboys/SITREP',
    lang: 'Skill',
    blurb: 'Terse structured output for coding agents across brief / sitrep / flash intensity levels.',
  },
  {
    name: 'wezterm-switcher',
    href: 'https://github.com/joshuaboys/wezterm-switcher',
    lang: 'Rust',
    blurb: 'Session switching for WezTerm.',
  },
  {
    name: 'tabby-switcher',
    href: 'https://github.com/joshuaboys/tabby-switcher',
    lang: 'Shell',
    blurb: 'The same idea, wired into Tabby.',
  },
  {
    name: 'dictate',
    href: 'https://github.com/joshuaboys/dictate',
    lang: 'Shell',
    blurb: 'Talk at the machine instead of typing at it.',
  },
  {
    name: 'github-stats',
    href: 'https://github.com/joshuaboys/github-stats',
    lang: 'Python',
    blurb: 'Generated stat cards for the profile readme.',
  },
];

const COMMS = [
  { name: 'GitHub',   handle: '@joshuaboys', href: 'https://github.com/joshuaboys',        icon: 'assets/github.svg'   },
  { name: 'LinkedIn', handle: 'joshboys',    href: 'https://linkedin.com/in/joshboys',     icon: 'assets/linkedin.svg' },
  { name: 'X / Twitter', handle: '@aneki',    href: 'https://twitter.com/aneki',            icon: 'assets/twitter.svg'  },
  { name: 'Arkahna',  handle: 'arkahna.io',  href: 'https://arkahna.io',                   icon: null                  },
];
