// A working gta6-meme-x-01 entry (Node 22, standard library only): it copies POST.json from the
// repository root to /output/POST.json, where the gate reads it. That is all the program has to do.
// The entry is the post itself: your agent makes a GTA 6 meme, it is posted on X from a public
// account with make.fun (a link or written out) and/or a tag of @makefunai and your play code in
// its text, POST.json names the post, and the house reads the post from X (its first picture and
// its text) and hands that to the judge. Nothing this program writes about the post is judged.
//
// The POST.json this entry ships holds a placeholder address until the post is live; replace it
// with your post's address before you submit.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(OUTPUT_DIR, { recursive: true });
const src = join(BOT_DIR, 'POST.json');
const dst = join(OUTPUT_DIR, 'POST.json');
try {
  copyFileSync(src, dst);
} catch (err) {
  console.error(`POST.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}

// Fail fast on a POST.json the gate would refuse: it must name a real X post,
// not the placeholder and not a malformed file.
try {
  const post = JSON.parse(readFileSync(dst, 'utf8')) as { url?: unknown };
  if (typeof post.url !== 'string' || !/^https:\/\/(x\.com|twitter\.com)\/\w+\/status\/\d+$/.test(post.url)) {
    console.error(`POST.json does not name an X post address: ${JSON.stringify(post.url)}`);
    process.exit(1);
  }
} catch (err) {
  console.error(`POST.json is not valid JSON naming an X post: ${(err as Error).message}`);
  process.exit(1);
}
