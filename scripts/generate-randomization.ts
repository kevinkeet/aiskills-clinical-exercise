/**
 * IRB-86737 — Randomization list generator
 *
 * Allocation 1:1 to AI vs CONTROL, stratified by PGY (1, 2, 3),
 * permuted blocks of size 4 within each stratum.
 *
 * Deterministic given the same seed: regenerating with the same
 * RANDOMIZATION_SEED env var produces an identical CSV. The seed
 * MUST be fixed before recruitment opens and never changed.
 *
 * Usage:
 *   RANDOMIZATION_SEED=<seed> npx tsx scripts/generate-randomization.ts \
 *     --pgy1 40 --pgy2 40 --pgy3 40 \
 *     --start 1 \
 *     --out participants_seed.csv
 *
 * Then upload to the running app:
 *   curl -X POST https://aiskills.kevinkeet.com/api/admin/seed-participants \
 *     -H "Authorization: Bearer $COORDINATOR_TOKEN" \
 *     -F "csv=@participants_seed.csv"
 *
 * To add a new batch mid-study, re-run with --start set to the next
 * unused integer (e.g., --start 121) and upload only the new rows.
 */

import seedrandom from 'seedrandom';
import * as fs from 'node:fs';

const BLOCK_SIZE = 4;
const ARMS_PER_BLOCK: ReadonlyArray<'AI' | 'CONTROL'> = [
  'AI',
  'AI',
  'CONTROL',
  'CONTROL',
];

interface Args {
  pgy1: number;
  pgy2: number;
  pgy3: number;
  start: number;
  out: string;
}

function parseArgs(argv: string[]): Args {
  const out: Args = { pgy1: 0, pgy2: 0, pgy3: 0, start: 1, out: 'participants_seed.csv' };
  for (let i = 2; i < argv.length; i += 2) {
    const flag = argv[i];
    const val = argv[i + 1];
    switch (flag) {
      case '--pgy1': out.pgy1 = parseInt(val, 10); break;
      case '--pgy2': out.pgy2 = parseInt(val, 10); break;
      case '--pgy3': out.pgy3 = parseInt(val, 10); break;
      case '--start': out.start = parseInt(val, 10); break;
      case '--out': out.out = val; break;
      default:
        console.error(`Unknown flag: ${flag}`);
        process.exit(1);
    }
  }
  if (out.pgy1 + out.pgy2 + out.pgy3 === 0) {
    console.error('Provide at least one of --pgy1 / --pgy2 / --pgy3 (counts).');
    process.exit(1);
  }
  return out;
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function generateForStratum(
  pgy: 1 | 2 | 3,
  count: number,
  rng: () => number
): Array<'AI' | 'CONTROL'> {
  const out: Array<'AI' | 'CONTROL'> = [];
  // Permuted blocks of 4. If count is not a multiple of 4, the trailing
  // partial block is a shuffled prefix of a full block — still balanced
  // in expectation, and you should set counts to multiples of 4 to keep
  // strict 1:1 allocation within each stratum.
  while (out.length < count) {
    const block = shuffle(ARMS_PER_BLOCK.slice(), rng);
    for (const arm of block) {
      if (out.length >= count) break;
      out.push(arm);
    }
  }
  if (count % BLOCK_SIZE !== 0) {
    console.warn(
      `WARNING: PGY-${pgy} count (${count}) is not a multiple of ${BLOCK_SIZE}; ` +
        `final block is partial and may not be 1:1 balanced.`
    );
  }
  return out;
}

function pad3(n: number): string {
  return n.toString().padStart(3, '0');
}

function main() {
  const seed = process.env.RANDOMIZATION_SEED;
  if (!seed) {
    console.error('RANDOMIZATION_SEED env var is required.');
    process.exit(1);
  }
  const args = parseArgs(process.argv);
  const rng = seedrandom(seed);

  // Generate each stratum independently. We intentionally consume the RNG
  // in PGY-1 → PGY-2 → PGY-3 order so the stream is reproducible.
  const pgy1 = generateForStratum(1, args.pgy1, rng);
  const pgy2 = generateForStratum(2, args.pgy2, rng);
  const pgy3 = generateForStratum(3, args.pgy3, rng);

  // Interleave by enrollment ID. The coordinator decides which P-NNN goes
  // to which PGY by picking from the corresponding stratum in order. Here
  // we emit them grouped by PGY with sequential IDs starting at --start.
  const rows: string[] = ['participant_id,pgy,arm'];
  let idCounter = args.start;
  for (const [pgyVal, list] of [
    [1, pgy1],
    [2, pgy2],
    [3, pgy3],
  ] as Array<[number, Array<'AI' | 'CONTROL'>]>) {
    for (const arm of list) {
      rows.push(`P-${pad3(idCounter)},${pgyVal},${arm}`);
      idCounter += 1;
    }
  }

  fs.writeFileSync(args.out, rows.join('\n') + '\n');
  console.log(`Wrote ${rows.length - 1} participants to ${args.out}`);
  console.log(`  PGY-1: ${args.pgy1}  PGY-2: ${args.pgy2}  PGY-3: ${args.pgy3}`);
  console.log(`  Seed: ${seed}`);
}

main();
