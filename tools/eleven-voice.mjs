// Voices src/story/lines.json with ElevenLabs -> public/vo/<id>.mp3 (same file names as voice-free).
//   node tools/eleven-voice.mjs --plan              count characters still to voice, show credits on all keys, no voicing
//   node tools/eleven-voice.mjs [--only 077,078]     voice (skips lines already voiced with the same text)
//   node tools/eleven-voice.mjs ... --keys 3        use keys 1..3 only;  --keys 2,5 = exactly keys 2 and 5
//   node tools/eleven-voice.mjs ... --key1-only      same as --keys 1
//   node tools/eleven-voice.mjs ... --skip 1,3      never use these key numbers
//   node tools/eleven-voice.mjs ... --force          re-voice even if already done
// Voices come from src/story/voices.json: {"N": {"name": "George", "eleven": "<voice_id>"}, ...}.
// Keys only from the environment: every variable with ELEVENLABS in its name (see tools/eleven-keys.mjs); never printed or stored.
// A line always goes to ONE key. Before every line the remaining credits of the keys are checked in order;
// the first key that covers the whole line is used. 1.2 s between lines; on 429 retries after 3, 6, 12, 24, 48 s.
// The subscription counter on ElevenLabs lags behind, so the remaining credits are also tracked locally
// (credits at start minus characters sent) and the smaller of the two numbers is trusted.
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {findKeys, pickKeys} from './eleven-keys.mjs';
if (!process.env.NODE_USE_ENV_PROXY && process.env.HTTPS_PROXY) {
	const r = spawnSync(process.execPath, process.argv.slice(1), {stdio: 'inherit', env: {...process.env, NODE_USE_ENV_PROXY: '1'}});
	process.exit(r.status ?? 1);
}
const MODEL = 'eleven_multilingual_v2';
const args = process.argv.slice(2);
const plan = args.includes('--plan');
const force = args.includes('--force');
const key1Only = args.includes('--key1-only');
const skip = args.includes('--skip') ? args[args.indexOf('--skip') + 1].split(',').map(Number) : [];
const only = args.includes('--only') ? args[args.indexOf('--only') + 1].split(',') : [];
const root = process.cwd();
const lines = JSON.parse(fs.readFileSync(path.join(root, 'src/story/lines.json'), 'utf8'));
const voices = JSON.parse(fs.readFileSync(path.join(root, 'src/story/voices.json'), 'utf8'));
const outDir = path.join(root, 'public/vo');
fs.mkdirSync(outDir, {recursive: true});
const madeFile = path.join(outDir, '.made-eleven.json');
const made = fs.existsSync(madeFile) ? JSON.parse(fs.readFileSync(madeFile, 'utf8')) : {};

const keysArg = key1Only ? '1' : args.includes('--keys') ? args[args.indexOf('--keys') + 1] : null;
const KEYS = pickKeys(findKeys(), keysArg)
	.filter((k) => !skip.includes(k.n))
	.map((k) => ({...k, sent: 0, start: null}));
if (!KEYS.length) throw new Error('no ElevenLabs key in the environment (a variable with ELEVENLABS in its name)');
console.log(`keys found: ${KEYS.map((k) => `${k.n}=${k.name}`).join(', ')}`);
const BACKOFF = [3000, 6000, 12000, 24000, 48000]; // waits after a 429
// local ledger survives between runs (key number only, never the key): the API counter lags by minutes
const ledgerFile = path.join(outDir, '.eleven-ledger.json');
const ledger = fs.existsSync(ledgerFile) ? JSON.parse(fs.readFileSync(ledgerFile, 'utf8')) : {};
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
const left = async (key) => {
	let r;
	for (let t = 0; t <= BACKOFF.length; t++) {
		r = await fetch('https://api.elevenlabs.io/v1/user/subscription', {headers: {'xi-api-key': key.k}});
		if (r.status !== 429 || t === BACKOFF.length) break;
		await sleep(BACKOFF[t]);
	}
	if (r.status === 429 && key.start !== null) return {used: key.used0 + key.sent, limit: key.limit, tier: key.tier, left: key.start - key.sent, local: true}; // rate-limited: trust the local count
	if (!r.ok) return {error: `key ${key.n}: subscription ${r.status} ${(await r.text()).slice(0, 160)}`};
	const j = await r.json();
	if (key.start === null) {
		const L = ledger[key.n];
		const est = L && L.base + L.sent > j.character_count ? L.base + L.sent : j.character_count;
		if (!L || j.character_count >= L.base + L.sent) ledger[key.n] = {base: j.character_count, sent: 0};
		key.start = j.character_limit - est;
		key.limit = j.character_limit;
		key.tier = j.tier;
		key.used0 = est;
	}
	const api = j.character_limit - j.character_count;
	return {api, used: Math.max(j.character_count, key.used0 + key.sent), limit: j.character_limit, tier: j.tier, left: Math.min(api, key.start - key.sent)};
};
const book = (key, chars) => {
	key.sent += chars;
	ledger[key.n].sent += chars;
	fs.writeFileSync(ledgerFile, JSON.stringify(ledger));
};

const todo = lines.filter((l) => !(only.length && !only.some((o) => l.id.startsWith(o))) && (force || made[l.id] !== l.t));
const need = todo.reduce((a, l) => a + [...l.t].length, 0);
const all = lines.reduce((a, l) => a + [...l.t].length, 0);
console.log(`lines: ${lines.length}, characters in all lines: ${all}`);
console.log(`to voice now: ${todo.length} lines, ${need} characters (not selected or already voiced: ${lines.length - todo.length} lines)`);
let have = 0;
for (const key of KEYS) {
	const s = await left(key);
	if (s.error) console.log(s.error);
	else {
		have += s.left;
		console.log(`key ${key.n}: ${s.tier}, used ${s.used} of ${s.limit}, left ${s.left}`);
	}
}
console.log(`credits available on ${KEYS.length} keys: ${have}, needed: ${need}, reserve: ${have - need}`);
if (plan) process.exit(0);
if (have < need) {
	console.log('NOT ENOUGH CREDITS for everything: nothing voiced. Shorten the text or voice part of it with --only.');
	process.exit(1);
}

const failed = [];
for (const l of todo) {
	const v = voices[l.sp]?.eleven;
	if (!v) {
		failed.push(`${l.id} (no voice for ${l.sp})`);
		continue;
	}
	const chars = [...l.t].length;
	let done = false;
	for (const key of KEYS) {
		const s = await left(key);
		if (s.error || s.left < chars) {
			console.log(`${l.id}: key ${key.n} skipped (${s.error ?? 'left ' + s.left + ' < ' + chars})`);
			continue; // not enough on this key: try the next one
		}
		let r;
		for (let t = 0; t <= BACKOFF.length; t++) {
			r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${v}?output_format=mp3_44100_128`, {
				method: 'POST',
				headers: {'xi-api-key': key.k, 'content-type': 'application/json'},
				body: JSON.stringify({text: l.t, model_id: MODEL}),
			});
			if (r.status !== 429 || t === BACKOFF.length) break;
			console.log(`${l.id}: 429, retry in ${BACKOFF[t] / 1000} s`);
			await sleep(BACKOFF[t]);
		}
		if (!r.ok) {
			const msg = (await r.text()).slice(0, 200);
			console.log(`key ${key.n} refused ${l.id}: ${r.status} ${msg}`);
			if (/quota|credits|limit/i.test(msg)) continue; // out of credits after all: next key
			break;
		}
		const buf = Buffer.from(await r.arrayBuffer());
		if (buf.length < 2000) {
			console.log(`${l.id}: empty audio`);
			break;
		}
		fs.writeFileSync(path.join(outDir, l.id + '.mp3'), buf);
		book(key, chars);
		made[l.id] = l.t;
		fs.writeFileSync(madeFile, JSON.stringify(made, null, 1));
		console.log(`voiced ${l.id} ${l.sp} (${voices[l.sp].name}) ${chars} chars, key ${key.n}`);
		done = true;
		await sleep(1200); // stay under the request rate limit
		break;
	}
	if (!done) failed.push(l.id);
}
for (const key of KEYS) console.log(`key ${key.n}: characters sent this run ${key.sent}`);
if (failed.length) console.log('FAILED: ' + failed.join(', ') + ' — run the same command again: finished lines are kept.');
