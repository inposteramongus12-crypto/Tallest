import React, {createContext} from 'react';
import {random} from 'remotion';
import {AgeBadge, FONT} from '../kit/ui';
import {darken, lighten} from '../engine/color';

/* Locations and set pieces of «Ростом с тень». Outdoor scenes are drawn in METRES:
   ground line GY, PPM pixels per metre (see M()). The hero's height comes from the day table in PROGRESS.md. */
export const HideHud = createContext(false);

export const Tag: React.FC<{x: number; y: number; value: number; f: number; s?: number; label?: string; pop?: number}> = ({x, y, value, s = 0.8, label = 'ДЕНЬ', pop = 1}) => (
	<AgeBadge x={x} y={y} value={value} s={s} pop={pop} label={label} c="#ffc94a" />
);

/* ------------------------------ height maths ------------------------------ */
export const FIG = 371; // px height of a figure at Actor s = 1 (feet to crown)
export const sOf = (h: number, ppm: number) => (h * ppm) / FIG; // Actor scale for a person h metres tall
export const fmtH = (h: number) => h.toFixed(h >= 9.95 ? 1 : 2).replace('.', ',').replace(/,?0+$/, (m) => (m.startsWith(',') ? '' : m));

/* Height badge «РОСТ 12,4 М»: yellow pill, pops when the value changes fast. (x, y) = bottom centre. */
export const HBadge: React.FC<{x: number; y: number; h: number; s?: number; hot?: number; label?: string}> = ({x, y, h, s = 1, hot = 0, label = 'РОСТ'}) => {
	const txt = `${fmtH(h)} М`;
	const w = 64 + txt.length * 26;
	return (
		<g transform={`translate(${x},${y}) scale(${s * (1 + 0.12 * hot)})`}>
			<path d={`M-8,-6 L0,6 L8,-6 Z`} fill="#ffc94a" />
			<rect x={-w / 2 - 70} y={-62} width={w + 140} height={58} rx={29} fill="#1b1f2e" stroke="#ffc94a" strokeWidth={4} />
			<text x={-w / 2 - 44} y={-24} fontFamily={FONT} fontWeight={800} fontSize={20} fill="#ffc94a" letterSpacing={1}>
				{label}
			</text>
			<text x={w / 2 + 50} y={-19} textAnchor="end" fontFamily={FONT} fontWeight={900} fontSize={38} fill={hot > 0.3 ? '#fff6d6' : '#ffffff'}>
				{txt}
			</text>
		</g>
	);
};

/* ---------------------------------- sky ----------------------------------- */
export type Tod = 'dawn' | 'morning' | 'noon' | 'evening' | 'sunset' | 'dusk' | 'night' | 'overcast';
export const SKY: Record<Tod, [string, string, string]> = {
	dawn: ['#6f8fd0', '#f6b98a', '#ffe2b0'],
	morning: ['#5fa6e8', '#a9d4f5', '#e8f4ff'],
	noon: ['#3f8fe6', '#8cc4f2', '#d8ecff'],
	evening: ['#4f86d6', '#f2c48a', '#ffd9a0'],
	sunset: ['#3a4f9a', '#e9786a', '#ffb45a'],
	dusk: ['#1d2a5a', '#40508e', '#8a8fc0'],
	night: ['#0f1736', '#1f2c5c', '#4a4f84'],
	overcast: ['#8f99a8', '#b4bcc8', '#d2d7de'],
};
export const isDark = (t: Tod) => t === 'dusk' || t === 'night';
export const SkyBox: React.FC<{tod: Tod; id: string; sun?: [number, number]; sunR?: number}> = ({tod, id, sun, sunR = 60}) => {
	const [a, b, c] = SKY[tod];
	return (
		<g>
			<defs>
				<linearGradient id={'sky' + id} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor={a} />
					<stop offset="0.62" stopColor={b} />
					<stop offset="1" stopColor={c} />
				</linearGradient>
				<radialGradient id={'sun' + id}>
					<stop offset="0" stopColor="#fffbe8" />
					<stop offset="0.25" stopColor="#ffe9a8" stopOpacity={0.9} />
					<stop offset="1" stopColor="#ffd27a" stopOpacity={0} />
				</radialGradient>
			</defs>
			<rect x={-3000} y={-3000} width={8000} height={7000} fill={`url(#sky${id})`} />
			{tod === 'night' || tod === 'dusk'
				? Array.from({length: 60}).map((_, i) => (
						<circle key={i} cx={-1000 + random(id + 'sx' + i) * 4000} cy={-1500 + random(id + 'sy' + i) * 1900} r={1 + random(id + 'sr' + i) * 1.8} fill="#fff" opacity={tod === 'night' ? 0.7 : 0.35} />
					))
				: null}
			{tod === 'overcast'
				? [0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx={-200 + i * 600} cy={120 + (i % 2) * 70} rx={520} ry={120} fill="#c7cdd6" opacity={0.7} />)
				: null}
			{sun && tod !== 'overcast' && !isDark(tod) ? (
				<g>
					<circle cx={sun[0]} cy={sun[1]} r={sunR * 4} fill={`url(#sun${id})`} />
					<circle cx={sun[0]} cy={sun[1]} r={sunR} fill={tod === 'sunset' || tod === 'dawn' ? '#ffd27a' : '#fffbe8'} />
				</g>
			) : null}
		</g>
	);
};

/* ----------------------- five-storey block (панелька) ----------------------
   x = left edge, gy = ground y, ppm = px per metre. Floors 3 m, 4 bays. Kitchen of our flat: 4th floor, bay 1. */
export const Block: React.FC<{x: number; gy: number; ppm: number; tod: Tod; bays?: number; kitchen?: boolean; tint?: string}> = ({x, gy, ppm, tod, bays = 6, kitchen = true, tint = '#d9c7a8'}) => {
	const fh = 3 * ppm;
	const bw = 3.4 * ppm;
	const W = bays * bw;
	const dark = isDark(tod);
	const wall = tod === 'overcast' ? darken(tint, 0.12) : dark ? darken(tint, 0.55) : tint;
	return (
		<g>
			<rect x={x} y={gy - 5 * fh - 0.6 * ppm} width={W} height={5 * fh + 0.6 * ppm} fill={wall} />
			<rect x={x - 0.3 * ppm} y={gy - 5 * fh - 0.9 * ppm} width={W + 0.6 * ppm} height={0.45 * ppm} fill={darken(wall, 0.25)} />
			{Array.from({length: 5}).map((_, fl) =>
				Array.from({length: bays}).map((_, b) => {
					const wx = x + b * bw + bw * 0.22;
					const wy = gy - (fl + 1) * fh + fh * 0.28;
					const lit = dark && random('w' + fl + b + x) > 0.45;
					const ours = kitchen && fl === 3 && b === 1;
					return (
						<g key={fl + '-' + b}>
							<rect x={wx - 3} y={wy - 3} width={bw * 0.56 + 6} height={fh * 0.46 + 6} fill={darken(wall, 0.2)} />
							<rect x={wx} y={wy} width={bw * 0.56} height={fh * 0.46} fill={ours ? (dark ? '#ffd98a' : '#ffe9b8') : lit ? '#ffd98a' : dark ? '#1f2a4a' : '#9fc4e6'} />
							<line x1={wx + bw * 0.28} y1={wy} x2={wx + bw * 0.28} y2={wy + fh * 0.46} stroke={darken(wall, 0.3)} strokeWidth={Math.max(2, ppm * 0.06)} />
							{fl > 0 ? <rect x={wx - 6} y={wy + fh * 0.46} width={bw * 0.56 + 12} height={Math.max(3, ppm * 0.1)} fill={lighten(wall, 0.2)} /> : null}
						</g>
					);
				}),
			)}
			{/* entrance with canopy */}
			<rect x={x + bw * 3.3} y={gy - 2.3 * ppm} width={1.4 * ppm} height={2.3 * ppm} fill="#6b4a32" />
			<rect x={x + bw * 3.15} y={gy - 2.6 * ppm} width={1.9 * ppm} height={0.25 * ppm} fill={darken(wall, 0.35)} />
		</g>
	);
};
// world position of our kitchen window (centre) for a Block at x, gy
export const kitchenWin = (x: number, gy: number, ppm: number): [number, number] => [x + 3.4 * ppm + 3.4 * ppm * 0.5, gy - 4 * 3 * ppm + 3 * ppm * 0.51];

/* --------------------------------- nature --------------------------------- */
export const Poplar: React.FC<{x: number; gy: number; ppm: number; h?: number; tod: Tod}> = ({x, gy, ppm, h = 14, tod}) => {
	const c = isDark(tod) ? '#1f3a2c' : tod === 'sunset' ? '#5a7a3a' : '#4f8f4a';
	return (
		<g>
			<rect x={x - 0.18 * ppm} y={gy - h * 0.4 * ppm} width={0.36 * ppm} height={h * 0.4 * ppm} fill="#5a4030" />
			<ellipse cx={x} cy={gy - h * 0.62 * ppm} rx={1.9 * ppm} ry={h * 0.42 * ppm} fill={c} />
			<ellipse cx={x - 0.6 * ppm} cy={gy - h * 0.55 * ppm} rx={1.1 * ppm} ry={h * 0.28 * ppm} fill={lighten(c, 0.12)} opacity={0.7} />
		</g>
	);
};
export const Bush: React.FC<{x: number; gy: number; ppm: number; tod: Tod; w?: number}> = ({x, gy, ppm, tod, w = 2.5}) => (
	<ellipse cx={x} cy={gy - 0.5 * ppm} rx={w * 0.5 * ppm} ry={0.7 * ppm} fill={isDark(tod) ? '#1c3326' : '#3f7a44'} />
);
export const Garages: React.FC<{x: number; gy: number; ppm: number; n?: number; tod: Tod}> = ({x, gy, ppm, n = 4, tod}) => (
	<g>
		{Array.from({length: n}).map((_, i) => (
			<g key={i}>
				<rect x={x + i * 3.2 * ppm} y={gy - 2.5 * ppm} width={3.1 * ppm} height={2.5 * ppm} fill={isDark(tod) ? '#3a3f4a' : ['#7a8a96', '#8a7a6a', '#6a7f8a', '#8e8a7a'][i % 4]} />
				<rect x={x + i * 3.2 * ppm + 0.3 * ppm} y={gy - 2.1 * ppm} width={2.5 * ppm} height={2.1 * ppm} fill={isDark(tod) ? '#2a2f38' : '#5a6670'} />
			</g>
		))}
	</g>
);
export const Ground: React.FC<{gy: number; tod: Tod; c?: string}> = ({gy, tod, c}) => {
	const base = c ?? (isDark(tod) ? '#2a2f3e' : tod === 'overcast' ? '#8a8c90' : tod === 'sunset' || tod === 'evening' ? '#8a7a6a' : '#9a9a96');
	return (
		<g>
			<rect x={-3000} y={gy} width={9000} height={2000} fill={base} />
			<rect x={-3000} y={gy} width={9000} height={14} fill={darken(base, 0.18)} />
		</g>
	);
};

/* long cast shadow on the ground: from the feet at fx, away from the sun (dir = -1 left, 1 right) */
export const CastShadow: React.FC<{fx: number; gy: number; len: number; w: number; dir: 1 | -1; o?: number}> = ({fx, gy, len, w, dir, o = 0.32}) => (
	<path d={`M${fx - w * 0.5},${gy + 4} L${fx + dir * len},${gy + 4 - w * 0.12} L${fx + dir * len},${gy + 10 + w * 0.12} L${fx + w * 0.5},${gy + 14} Z`} fill="#0b0e1a" opacity={o} />
);

/* goal posts (football yard) */
export const Goal: React.FC<{x: number; gy: number; ppm: number}> = ({x, gy, ppm}) => (
	<g stroke="#f4f4f4" strokeWidth={Math.max(3, 0.1 * ppm)} fill="none">
		<path d={`M${x},${gy} L${x},${gy - 2 * ppm} L${x + 3 * ppm},${gy - 2 * ppm} L${x + 3 * ppm},${gy}`} />
		<path d={`M${x},${gy - 2 * ppm} L${x - 0.6 * ppm},${gy - 1.6 * ppm} L${x - 0.6 * ppm},${gy}`} opacity={0.6} />
	</g>
);
export const Bench: React.FC<{x: number; gy: number; ppm: number}> = ({x, gy, ppm}) => (
	<g>
		<rect x={x - 0.9 * ppm} y={gy - 0.48 * ppm} width={1.8 * ppm} height={0.12 * ppm} fill="#8a5a32" />
		<rect x={x - 0.9 * ppm} y={gy - 0.9 * ppm} width={1.8 * ppm} height={0.1 * ppm} fill="#8a5a32" />
		<rect x={x - 0.8 * ppm} y={gy - 0.48 * ppm} width={0.08 * ppm} height={0.48 * ppm} fill="#2b2f38" />
		<rect x={x + 0.72 * ppm} y={gy - 0.48 * ppm} width={0.08 * ppm} height={0.48 * ppm} fill="#2b2f38" />
	</g>
);
export const StreetLamp: React.FC<{x: number; gy: number; ppm: number; on?: boolean}> = ({x, gy, ppm, on}) => (
	<g>
		<rect x={x - 0.08 * ppm} y={gy - 6 * ppm} width={0.16 * ppm} height={6 * ppm} fill="#2b2f38" />
		<rect x={x - 0.08 * ppm} y={gy - 6 * ppm} width={1 * ppm} height={0.12 * ppm} fill="#2b2f38" />
		<ellipse cx={x + 0.9 * ppm} cy={gy - 5.85 * ppm} rx={0.3 * ppm} ry={0.12 * ppm} fill={on ? '#ffe9a8' : '#555'} />
		{on ? <path d={`M${x + 0.75 * ppm},${gy - 5.8 * ppm} L${x + 0.1 * ppm},${gy} L${x + 1.7 * ppm},${gy} L${x + 1.05 * ppm},${gy - 5.8 * ppm} Z`} fill="#ffe9a8" opacity={0.12} /> : null}
	</g>
);

/* ------------------------- river, embankment, park ------------------------- */
export const River: React.FC<{gy: number; tod: Tod; moonX?: number}> = ({gy, tod, moonX}) => (
	<g>
		<rect x={-3000} y={gy - 40} width={9000} height={60} fill={isDark(tod) ? '#16224a' : tod === 'sunset' ? '#b46a6a' : '#5a8fc0'} />
		{moonX !== undefined ? <rect x={moonX - 30} y={gy - 40} width={60} height={60} fill="#ffe2b0" opacity={0.35} /> : null}
	</g>
);
/* Ferris wheel, 25 m: hub at (cx, gy - 13.5 m), radius 11.5 m, 12 cabins; rot in degrees; lights on/off */
export const WHEEL = {hub: 13.5, r: 11.5, n: 12};
export const cabinPos = (cx: number, gy: number, ppm: number, rot: number, i: number): [number, number] => {
	const a = ((rot + (i * 360) / WHEEL.n) * Math.PI) / 180;
	return [cx + Math.sin(a) * WHEEL.r * ppm, gy - WHEEL.hub * ppm - Math.cos(a) * WHEEL.r * ppm];
};
export const Wheel: React.FC<{cx: number; gy: number; ppm: number; rot: number; lights: number; tod: Tod; ours?: number}> = ({cx, gy, ppm, rot, lights, tod, ours = 0}) => {
	const hy = gy - WHEEL.hub * ppm;
	const R = WHEEL.r * ppm;
	const steel = isDark(tod) ? '#9aa6c4' : '#e8eef6';
	return (
		<g>
			<path d={`M${cx - 6 * ppm},${gy} L${cx},${hy} L${cx + 6 * ppm},${gy}`} stroke={steel} strokeWidth={0.35 * ppm} fill="none" />
			<circle cx={cx} cy={hy} r={R} fill="none" stroke={steel} strokeWidth={0.28 * ppm} />
			<circle cx={cx} cy={hy} r={R * 0.92} fill="none" stroke={steel} strokeWidth={0.12 * ppm} opacity={0.8} />
			{Array.from({length: WHEEL.n}).map((_, i) => {
				const a = ((rot + (i * 360) / WHEEL.n) * Math.PI) / 180;
				return <line key={'s' + i} x1={cx} y1={hy} x2={cx + Math.sin(a) * R} y2={hy - Math.cos(a) * R} stroke={steel} strokeWidth={0.09 * ppm} />;
			})}
			{lights > 0
				? Array.from({length: 36}).map((_, i) => {
						const a = (i * 10 * Math.PI) / 180;
						return <circle key={'l' + i} cx={cx + Math.sin(a) * R} cy={hy - Math.cos(a) * R} r={0.16 * ppm} fill="#ffe98a" opacity={lights} />;
					})
				: null}
			<circle cx={cx} cy={hy} r={0.7 * ppm} fill={steel} />
			{Array.from({length: WHEEL.n}).map((_, i) => {
				const [x, y] = cabinPos(cx, gy, ppm, rot, i);
				const c = i === ours ? '#e8524a' : ['#3b7dd8', '#f2b21c', '#4fb35f'][i % 3];
				return (
					<g key={'c' + i}>
						<line x1={x} y1={y} x2={x} y2={y + 0.5 * ppm} stroke={steel} strokeWidth={0.08 * ppm} />
						<rect x={x - 0.9 * ppm} y={y + 0.5 * ppm} width={1.8 * ppm} height={1.6 * ppm} rx={0.35 * ppm} fill={isDark(tod) ? darken(c, 0.35) : c} />
						<rect x={x - 0.65 * ppm} y={y + 0.75 * ppm} width={1.3 * ppm} height={0.7 * ppm} rx={0.15 * ppm} fill={lights > 0.5 ? '#ffe9b8' : isDark(tod) ? '#2a3560' : '#cfe6ff'} />
					</g>
				);
			})}
		</g>
	);
};
export const ParkTrees: React.FC<{x0: number; x1: number; gy: number; ppm: number; tod: Tod; seed: string}> = ({x0, x1, gy, ppm, tod, seed}) => (
	<g>
		{Array.from({length: Math.ceil((x1 - x0) / (3 * ppm))}).map((_, i) => {
			const x = x0 + i * 3 * ppm + random(seed + i) * ppm;
			const h = 7 + random(seed + 'h' + i) * 4;
			const c = isDark(tod) ? '#14261c' : '#3f7a44';
			return (
				<g key={i}>
					<rect x={x - 0.15 * ppm} y={gy - h * 0.45 * ppm} width={0.3 * ppm} height={h * 0.45 * ppm} fill="#3a2a20" />
					<circle cx={x} cy={gy - h * 0.7 * ppm} r={h * 0.32 * ppm} fill={c} />
				</g>
			);
		})}
	</g>
);
export const Parapet: React.FC<{gy: number; ppm: number; tod: Tod}> = ({gy, ppm, tod}) => (
	<g>
		<rect x={-3000} y={gy - 1.1 * ppm} width={9000} height={1.1 * ppm} fill={isDark(tod) ? '#4a4a5a' : '#c9b89a'} />
		<rect x={-3000} y={gy - 1.2 * ppm} width={9000} height={0.18 * ppm} fill={isDark(tod) ? '#6a6a7a' : '#e2d4b8'} />
	</g>
);

/* --------------------------------- interiors --------------------------------
   Plain room box at normal scale (floor 900). Walls and light by time of day. */
export const Room: React.FC<{wall: string; floor: string; tod: Tod; win?: {x: number; w: number; h?: number}; id: string; ceil?: number}> = ({wall, floor, tod, win, id, ceil}) => {
	const dark = isDark(tod);
	const w = dark ? darken(wall, 0.5) : wall;
	return (
		<g>
			<rect x={-800} y={-400} width={3600} height={1300} fill={w} />
			{ceil !== undefined ? <rect x={-800} y={-400} width={3600} height={ceil + 400} fill={darken(w, 0.12)} /> : null}
			<rect x={-800} y={900} width={3600} height={500} fill={dark ? darken(floor, 0.5) : floor} />
			<rect x={-800} y={890} width={3600} height={14} fill={darken(floor, 0.25)} />
			{win ? (
				<g>
					<rect x={win.x - 14} y={226} width={win.w + 28} height={(win.h ?? 360) + 28} fill="#f4f1ea" />
					<g>
						<SkyBox tod={tod} id={'r' + id} />
					</g>
					<rect x={win.x} y={240} width={win.w} height={win.h ?? 360} fill="none" stroke="#f4f1ea" strokeWidth={12} />
					<line x1={win.x + win.w / 2} y1={240} x2={win.x + win.w / 2} y2={240 + (win.h ?? 360)} stroke="#f4f1ea" strokeWidth={10} />
				</g>
			) : null}
		</g>
	);
};
/* window with its own clipped sky (use inside rooms) */
export const RoomWin: React.FC<{x: number; y?: number; w: number; h?: number; tod: Tod; id: string; sun?: [number, number]; curtains?: number}> = ({x, y = 240, w, h = 360, tod, id, sun, curtains = 0}) => (
	<g>
		<defs>
			<clipPath id={'cw' + id}>
				<rect x={x} y={y} width={w} height={h} />
			</clipPath>
		</defs>
		<rect x={x - 16} y={y - 16} width={w + 32} height={h + 32} fill="#f4f1ea" />
		<g clipPath={`url(#cw${id})`}>
			<SkyBox tod={tod} id={'w' + id} sun={sun} sunR={36} />
			<rect x={x} y={y + h * 0.62} width={w} height={h} fill={isDark(tod) ? '#1a2238' : '#8aa0b8'} opacity={0.7} />
		</g>
		<rect x={x} y={y} width={w} height={h} fill="none" stroke="#f4f1ea" strokeWidth={10} />
		<line x1={x + w / 2} y1={y} x2={x + w / 2} y2={y + h} stroke="#f4f1ea" strokeWidth={9} />
		<rect x={x - 60} y={y - 30} width={60 + (w / 2) * curtains} height={h + 80} fill="#3a4a7a" />
		<rect x={x + w - (w / 2) * curtains} y={y - 30} width={60 + (w / 2) * curtains} height={h + 80} fill="#3a4a7a" />
	</g>
);
/* sunbeam / sun patch on the floor through a window */
export const SunPatch: React.FC<{x0: number; x1: number; y?: number; o?: number; slant?: number}> = ({x0, x1, y = 900, o = 0.55, slant = 120}) => (
	<g>
		<path d={`M${x0},${y} L${x1},${y} L${x1 + slant},${y + 90} L${x0 + slant},${y + 90} Z`} fill="#ffd98a" opacity={o} />
	</g>
);
export const Fridge: React.FC<{x: number; y?: number}> = ({x, y = 900}) => (
	<g>
		<rect x={x - 110} y={y - 560} width={220} height={560} rx={16} fill="#eef2f6" stroke="#b8c2cc" strokeWidth={4} />
		<line x1={x - 110} y1={y - 380} x2={x + 110} y2={y - 380} stroke="#b8c2cc" strokeWidth={4} />
		<rect x={x + 80} y={y - 520} width={10} height={100} rx={4} fill="#9aa6b2" />
		<rect x={x + 80} y={y - 340} width={10} height={140} rx={4} fill="#9aa6b2" />
	</g>
);
export const Bed: React.FC<{x: number; y?: number; w?: number}> = ({x, y = 900, w = 620}) => (
	<g>
		<rect x={x} y={y - 200} width={30} height={200} fill="#7a5a3a" />
		<rect x={x} y={y - 120} width={w} height={70} rx={10} fill="#e9e4f5" />
		<rect x={x} y={y - 60} width={w} height={60} fill="#7a5a3a" />
		<rect x={x + 30} y={y - 150} width={130} height={40} rx={16} fill="#ffffff" />
	</g>
);

/* simple stylised big digits / caption on a world sign */
export const Sign: React.FC<{x: number; y: number; text: string; s?: number; c?: string; bg?: string}> = ({x, y, text, s = 1, c = '#1b1f2e', bg = '#ffffff'}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<rect x={-text.length * 13 - 20} y={-36} width={text.length * 26 + 40} height={52} rx={8} fill={bg} stroke={c} strokeWidth={3} />
		<text x={0} y={2} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={c}>
			{text}
		</text>
	</g>
);
