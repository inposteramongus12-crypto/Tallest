import React from 'react';
import {darken, lighten} from './color';

export type Expr = 'normal' | 'angry' | 'sad' | 'sleepy' | 'wide' | 'worried';
export type Hair = 'none' | 'spiky' | 'bun' | 'cap' | 'ponytail' | 'grey' | 'bob' | 'short' | 'curly' | 'pigtails' | 'receding' | 'beanie' | 'helmet';
export type Outfit = 'hoodie' | 'suit' | 'gown' | 'coat' | 'apron' | 'tee' | 'polo' | 'dress' | 'vest' | 'shirt' | 'hivis';
export type Acc = 'headphones' | 'mustache' | 'glasses' | 'foreheadGlasses' | 'beard' | 'tape' | 'apronOver';
/* body proportions: w = width of torso and limbs, head = head size, leg = leg length (Actor keeps the feet on the floor) */
export type Build = {w?: number; head?: number; leg?: number};
export type Mouth = 'line' | 'frown' | 'open' | 'smile' | 'flat' | 'smirk' | 'none';
export type HandShape = 'fist' | 'point' | 'snap';
// knuckle state of the big fist glyph: white = clenched, skin = relaxed natural colour
export type Knuckles = 'white' | 'skin';

// Angles in degrees: 0 = limb points straight down, + = swings toward facing direction.
// Arm/leg pairs: [upper angle, joint bend]. Elbows bend forward, knees bend backward.
export type Pose = {
	lean: number;
	head: number;
	armB: [number, number];
	armF: [number, number];
	legB: [number, number];
	legF: [number, number];
};

export const POSES: Record<string, Pose> = {
	stand: {lean: 0, head: 0, armB: [-8, 10], armF: [8, 10], legB: [-4, 0], legF: [4, 0]},
	sit: {lean: -4, head: 0, armB: [25, 70], armF: [35, 65], legB: [88, 85], legF: [92, 90]},
};

const T = 125; // torso
const R = 50; // head radius
const UA = 60;
const FA = 56;
const TH = 76;
const SH = 72;

type V = [number, number];
const rad = (a: number) => (a * Math.PI) / 180;
const dir = (a: number): V => [Math.sin(rad(a)), Math.cos(rad(a))];
const add = (a: V, b: V, k = 1): V => [a[0] + b[0] * k, a[1] + b[1] * k];

type Props = {
	x: number;
	y: number;
	scale?: number;
	facing?: 1 | -1;
	pose: Pose;
	color: string;
	outfit?: Outfit;
	hair?: Hair;
	hairColor?: string;
	expr?: Expr;
	look?: V;
	blink?: number;
	mouth?: Mouth;
	faceTurn?: number;
	rim?: string;
	rimW?: number;
	light?: V;
	shoe?: string;
	legColor?: string;
	handItem?: React.ReactNode;
	id: string;
	hideLegs?: boolean;
	hood?: boolean;
	handF?: HandShape;
	lidL?: number;
	lidR?: number;
	squash?: number;
	// 0 = sixteen, 1 = mid-thirties: stubble, wrinkles, eye bags, grey temples, broader frame
	age?: number;
	// 0..1 speech loudness; opens the mouth while the character talks
	talk?: number;
	acc?: Acc[];
	chestText?: string;
	// draw the front arm over the face (hand to cheek, facepalm, finger to lips)
	armOver?: boolean;
	// replaces the small dark hands with a large fist whose knuckle colour reads at medium shot
	fist?: Knuckles;
	// fist glyph size multiplier (default 1.3); raise it on medium shots so the knuckle colour reads
fistK?: number;
	build?: Build;
	// colour of the flat cuff band at the wrist (default: sleeve colour, darker)
	cuff?: string;
	// trim colour of new outfits (polo collar, dress belt, vest panels, hi-vis stripes)
	trim?: string;
};

/* Visible hand: flat cuff band across the wrist + mitten palm with a thumb. Local +y runs along the forearm. */
export const Hand: React.FC<{at: V; ang: number; cuff: string; thumb?: 1 | -1; open?: boolean}> = ({at, ang, cuff, thumb = 1, open}) => (
	<g transform={`translate(${at[0]},${at[1]}) rotate(${-ang})`}>
		<rect x={-14} y={-9} width={28} height={8} rx={2.5} fill={cuff} />
		<path d={open ? 'M-8,-2 L-9,14 Q-8,22 0,23 Q8,22 9,14 L8,-2 Z' : 'M-8,-2 L-8.5,9 Q-8,17 0,18 Q8,17 8.5,9 L8,-2 Z'} fill="#0b0b0d" />
		<path d={`M${thumb * 6},1 q${thumb * 9},2 ${thumb * 9},10 q0,4 ${-thumb * 4},3`} stroke="#0b0b0d" strokeWidth={6.5} fill="none" strokeLinecap="round" />
		{open ? <path d="M-4,20 L-4,26 M1,21 L1,28 M6,19 L6,25" stroke="#0b0b0d" strokeWidth={4.5} strokeLinecap="round" /> : null}
	</g>
);

const Limb: React.FC<{pts: V[]; w: number; c: string; hi?: string; hiSide?: number}> = ({pts, w, c, hi, hiSide = -1}) => {
	const d = 'M' + pts.map((p) => p.join(',')).join(' L');
	return (
		<>
			<path d={d} stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" fill="none" />
			{hi
				? pts.slice(0, -1).map((p, i) => {
						const q = pts[i + 1];
						const dx = q[0] - p[0];
						const dy = q[1] - p[1];
						const L = Math.hypot(dx, dy) || 1;
						const n: V = [(-dy / L) * hiSide * w * 0.28, (dx / L) * hiSide * w * 0.28];
						return (
							<line
								key={i}
								x1={p[0] + n[0] + (dx / L) * 4}
								y1={p[1] + n[1] + (dy / L) * 4}
								x2={q[0] + n[0] - (dx / L) * 4}
								y2={q[1] + n[1] - (dy / L) * 4}
								stroke={hi}
								strokeWidth={w * 0.22}
								strokeLinecap="round"
								opacity={0.85}
							/>
						);
					})
				: null}
		</>
	);
};

const Eye: React.FC<{cx: number; cy: number; rx: number; ry: number; pr: number; look: V; lid: number}> = ({
	cx,
	cy,
	rx,
	ry,
	pr,
	look,
	lid,
}) => (
	<>
		<ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#fff" />
		<circle cx={cx + look[0] * (rx - pr - 1)} cy={cy + look[1] * (ry - pr - 1)} r={pr} fill="#000" />
		{lid > 0.01 ? <rect x={cx - rx - 2} y={cy - ry - 3} width={rx * 2 + 4} height={2 * ry * lid + 3} fill="#000" /> : null}
		{lid > 0.25 && lid < 0.95 ? (
			<line x1={cx - rx} y1={cy - ry + 2 * ry * lid} x2={cx + rx} y2={cy - ry + 2 * ry * lid} stroke="#fff" strokeWidth={2.5} strokeLinecap="round" />
		) : null}
	</>
);

const HeadShape: React.FC<{hair: Hair; hairColor: string; front: boolean}> = ({hair, hairColor, front}) => {
	if (hair === 'curly')
		return front ? (
			<g fill="#000">
				{[[-40, -22, 17], [-30, -42, 18], [-10, -54, 19], [12, -54, 18], [32, -44, 17], [44, -24, 14], [-48, -2, 12]].map(([x, y, r], i) => (
					<circle key={i} cx={x} cy={y} r={r} />
				))}
			</g>
		) : (
			<g fill="#000">
				{[[-52, 6, 14], [-50, -30, 16], [-20, -58, 16], [28, -58, 14]].map(([x, y, r], i) => (
					<circle key={i} cx={x} cy={y} r={r} />
				))}
			</g>
		);
	if (hair === 'pigtails')
		return front ? (
			<>
				<path d={`M${-R},${-4} C${-R - 4},${-R - 8} ${R + 4},${-R - 12} ${R},${-8} C${R - 26},${-R + 16} ${-R + 20},${-R + 12} ${-R + 6},${2} Z`} fill="#000" />
				<circle cx={-R - 4} cy={-14} r={6} fill={hairColor} />
				<circle cx={R + 4} cy={-14} r={6} fill={hairColor} />
			</>
		) : (
			<>
				<path d={`M${-R - 6},${-14} C${-R - 36},${-8} ${-R - 34},${30} ${-R - 16},${46} C${-R - 20},${20} ${-R - 12},${0} ${-R - 2},${-6} Z`} fill="#000" />
				<path d={`M${R + 6},${-14} C${R + 36},${-8} ${R + 34},${30} ${R + 16},${46} C${R + 20},${20} ${R + 12},${0} ${R + 2},${-6} Z`} fill="#000" />
			</>
		);
	if (hair === 'receding')
		return front ? (
			<>
				<path d={`M${-R - 3},${-2} C${-R - 6},${-26} ${-R + 4},${-34} ${-R + 14},${-30} L${-R + 6},${4} Z`} fill={hairColor} />
				<path d={`M${R + 3},${-2} C${R + 6},${-26} ${R - 4},${-34} ${R - 14},${-30} L${R - 6},${4} Z`} fill={hairColor} />
				<ellipse cx={-12} cy={-R + 12} rx={14} ry={5} fill="#3a3d48" opacity={0.9} />
			</>
		) : null;
	if (hair === 'beanie')
		return front ? (
			<>
				<path d={`M${-R - 2},${-10} C${-R - 2},${-R - 22} ${R + 2},${-R - 22} ${R + 2},${-10} Z`} fill={hairColor} />
				<rect x={-R - 4} y={-18} width={2 * R + 8} height={14} rx={6} fill={darken(hairColor, 0.18)} />
				<circle cx={0} cy={-R - 14} r={11} fill={lighten(hairColor, 0.25)} />
			</>
		) : null;
	if (hair === 'helmet')
		return front ? (
			<>
				<path d={`M${-R - 4},${-8} C${-R - 4},${-R - 24} ${R + 4},${-R - 24} ${R + 4},${-8} Z`} fill={hairColor} />
				<rect x={-R - 10} y={-14} width={2 * R + 20} height={9} rx={4} fill={darken(hairColor, 0.2)} />
				<rect x={-6} y={-R - 18} width={12} height={R + 2} rx={4} fill={lighten(hairColor, 0.3)} />
			</>
		) : null;
	if (!front) {
		if (hair === 'bun') return <circle cx={-6} cy={-R - 6} r={17} fill="#000" />;
		if (hair === 'ponytail')
			return (
				<>
					<path d={`M${-R + 14},${-R + 8} C${-R - 30},${-R - 10} ${-R - 40},${20} ${-R - 18},${42} C${-R - 10},${10} ${-R + 4},${-10} ${-R + 20},${-12} Z`} fill="#000" />
					<circle cx={-R + 6} cy={-R + 14} r={7} fill={hairColor} />
				</>
			);
		if (hair === 'spiky')
			return (
				<path
					d={`M${-R},${-8} L${-R - 26},${-24} L${-R + 4},${-30} L${-R - 6},${-58} L${-18},${-44} L${-14},${-R - 30} L${4},${-R + 2} L${16},${-R - 24} L${24},${-R + 4} L${44},${-R - 12} L${R - 6},${-22} Z`}
					fill="#000"
				/>
			);
		if (hair === 'bob')
			return <path d={`M${-R - 6},${10} C${-R - 8},${-R - 10} ${R + 8},${-R - 10} ${R + 6},${10} L${R - 4},${18} L${-R + 4},${18} Z`} fill="#000" />;
		return null;
	}
	if (hair === 'cap')
		return (
			<>
				<path d={`M${-R + 2},${-14} C${-R + 2},${-R - 14} ${R - 2},${-R - 14} ${R - 2},${-14} Z`} fill={hairColor} />
				<path d={`M${R - 20},${-16} Q${R + 34},${-20} ${R + 40},${-6} L${R - 6},${-6} Z`} fill={darken(hairColor, 0.15)} />
				<circle cx={0} cy={-R - 4} r={4} fill={darken(hairColor, 0.2)} />
			</>
		);
	if (hair === 'grey')
		return (
			<path
				d={`M${-R + 2},${-6} C${-R - 8},${-40} ${-28},${-R - 10} ${0},${-R - 6} C${20},${-R - 10} ${36},${-R + 2} ${30},${-R + 12} C${10},${-R + 2} ${-20},${-R + 6} ${-R + 10},${-4} Z`}
				fill={hairColor}
				opacity={0.9}
			/>
		);
	if (hair === 'short')
		return <path d={`M${-R},${-2} C${-R - 6},${-R - 6} ${R + 6},${-R - 10} ${R},${-12} C${R - 20},${-R + 10} ${-R + 22},${-R + 4} ${-R + 8},${0} Z`} fill="#000" />;
	return null;
};


/* Big fist glyph at the end of a forearm. Local +y runs along the forearm (down), knuckles face +y.
   white: clenched, bloodless knuckles; skin: normal skin tone. Outline + highlight keep the colour readable at medium shot. */
export const Fist: React.FC<{at: V; ang: number; k: Knuckles; size?: number}> = ({at, ang, k, size = 1.3}) => {
	const white = k === 'white';
	const base = white ? '#fdf6e3' : '#e9a373';
	const edge = '#a85a32';
	const kn = white ? '#fffbf0' : '#f0b189';
	const shade = white ? '#f1e4c4' : '#cf8658';
	return (
		<g transform={`translate(${at[0]},${at[1]}) rotate(${-ang}) scale(${size})`}>
			<rect x={-17} y={-4} width={34} height={34} rx={12} fill={base} stroke={edge} strokeWidth={3} />
			<rect x={-17} y={14} width={34} height={14} rx={7} fill={shade} opacity={0.55} />
			{[-12.5, -4.2, 4.2, 12.5].map((cx) => (
				<circle key={cx} cx={cx} cy={30} r={7.2} fill={kn} stroke={edge} strokeWidth={2.6} />
			))}
			<path d="M-17,6 q-9,2 -8,12 q1,8 9,8" fill={base} stroke={edge} strokeWidth={3} strokeLinecap="round" />
			{[-8.4, 0, 8.4].map((cx) => (
				<line key={cx} x1={cx} y1={4} x2={cx} y2={14} stroke={edge} strokeWidth={1.8} strokeLinecap="round" opacity={0.55} />
			))}
		</g>
	);
};

export const Stickman: React.FC<Props> = (p) => {
	const {
		pose,
		color,
		outfit = 'hoodie',
		hair = 'none',
hairColor = '#d9d9d9',
		build = {},
		expr = 'normal',
		look = [0.2, 0],
		blink = 0,
		mouth = 'line',
		faceTurn = 0.6,
		rim = '#f6d6a6',
		rimW = 3.2,
		light = [2, -1.5],
		legColor = '#0b0b0d',
		scale = 1,
		facing = 1,
	} = p;
const shoe = p.shoe ?? color;
	const BW = build.w ?? 1;
	const HK = build.head ?? 1;
	const LK = build.leg ?? 1;
	const cuff = p.cuff ?? darken(color, 0.32);
	const trim = p.trim ?? '#f4f1ea';
	const hi = lighten(color, 0.35);
	const sh = darken(color, 0.22);
	const back = darken(color, 0.28);
	const lean = pose.lean;
	const up: V = [Math.sin(rad(lean)), -Math.cos(rad(lean))];
	const fwd: V = [Math.cos(rad(lean)), Math.sin(rad(lean))];
	const hip: V = [0, 0];
	const shoulder = add(add(hip, up, T - 18), fwd, 2);
	const shB = add(shoulder, fwd, -8);
const headC = add(hip, up, T + R * 0.78 * HK);

	const arm = (s: V, a: [number, number]) => {
		const e = add(s, dir(a[0]), UA);
		const h = add(e, dir(a[0] + a[1]), FA);
		return [s, e, h] as V[];
	};
	const leg = (s: V, a: [number, number]) => {
const k = add(s, dir(a[0]), TH * LK);
		const f = add(k, dir(a[0] - a[1]), SH * LK);
		return [s, k, f] as V[];
	};
	const aB = arm(shB, pose.armB);
	const aF = arm(shoulder, pose.armF);
	const lB = leg(add(hip, fwd, -6), pose.legB);
	const lF = leg(add(hip, fwd, 6), pose.legF);

	const ex = faceTurn * 11;
	const wide = expr === 'wide';
	const erx = wide ? 11 : 9.5;
	const ery = wide ? 13 : 11;
	const pr = wide ? 3.6 : 5;
	const baseLid = expr === 'sleepy' ? 0.5 : expr === 'angry' ? 0.22 : 0;
	const lid = Math.max(baseLid, blink);
	const eL: V = [-15 + ex, -4];
	const eR: V = [15 + ex, -4];

	const brow = (e: V, side: -1 | 1) => {
		const y = e[1] - ery - 7;
		let a = 0;
		if (expr === 'angry') a = 9;
		if (expr === 'sad' || expr === 'worried') a = -8;
		if (expr === 'normal' || expr === 'wide' || expr === 'sleepy') return null;
		const inner = side === -1 ? e[0] + 9 : e[0] - 9;
		const outer = side === -1 ? e[0] - 10 : e[0] + 10;
		return <line x1={outer} y1={y - a * 0.4} x2={inner} y2={y + a * 0.6} stroke="#fff" strokeWidth={5} strokeLinecap="round" />;
	};

	const mx = ex * 0.7;
	const mouthEl = (() => {
		const y = 24;
		switch (mouth) {
			case 'line':
				return <line x1={mx - 7} y1={y} x2={mx + 7} y2={y - 1} stroke="#fff" strokeWidth={3.5} strokeLinecap="round" />;
			case 'flat':
				return <line x1={mx - 4} y1={y} x2={mx + 5} y2={y} stroke="#fff" strokeWidth={3} strokeLinecap="round" />;
			case 'frown':
				return <path d={`M${mx - 8},${y + 3} Q${mx},${y - 5} ${mx + 8},${y + 3}`} stroke="#fff" strokeWidth={3.5} fill="none" strokeLinecap="round" />;
			case 'smile':
				return <path d={`M${mx - 8},${y - 2} Q${mx},${y + 6} ${mx + 8},${y - 2}`} stroke="#fff" strokeWidth={3.5} fill="none" strokeLinecap="round" />;
			case 'smirk':
				return <path d={`M${mx - 9},${y + 1} Q${mx + 2},${y + 4} ${mx + 10},${y - 5}`} stroke="#fff" strokeWidth={3.5} fill="none" strokeLinecap="round" />;
			case 'open':
				return <ellipse cx={mx} cy={y + 1} rx={5} ry={6.5} fill="#fff" />;
			default:
				return null;
		}
	})();

	const fid = 'rim-' + p.id;
	const torsoTop = -T - 6;
	const age = p.age ?? 0;
const bw = 30 * (1 + 0.18 * age) * BW;
	const acc = p.acc ?? [];
	return (
		<g transform={`translate(${p.x},${p.y}) scale(${scale * facing * (1 + (p.squash ?? 0))},${scale * (1 - (p.squash ?? 0))})`}>
			<defs>
				<filter id={fid} x="-40%" y="-40%" width="180%" height="180%">
					<feMorphology in="SourceAlpha" operator="dilate" radius={rimW} result="d" />
					<feOffset in="d" dx={light[0] * facing} dy={light[1]} result="o" />
					<feFlood floodColor={rim} />
					<feComposite in2="o" operator="in" result="r" />
					<feMerge>
						<feMergeNode in="r" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
			</defs>
			<g filter={`url(#${fid})`}>
				{/* back limbs */}
				{p.hideLegs ? null : (
					<>
<Limb pts={lB} w={13 * BW} c={darken(legColor, 0.2)} />
						<ellipse cx={lB[2][0] + 9} cy={lB[2][1] + 2} rx={17} ry={9} fill={darken(shoe, 0.25)} />
					</>
				)}
<Limb pts={aB} w={23 * BW} c={back} />
				{p.fist ? <Fist at={aB[2]} ang={pose.armB[0] + pose.armB[1]} k={p.fist} size={p.fistK} /> : <Hand at={aB[2]} ang={pose.armB[0] + pose.armB[1]} cuff={darken(cuff, 0.15)} thumb={-1} />}
				{/* front leg */}
				{p.hideLegs ? null : (
					<>
<Limb pts={lF} w={13 * BW} c={legColor} />
						<ellipse cx={lF[2][0] + 9} cy={lF[2][1] + 2} rx={17} ry={9} fill={shoe} />
						<ellipse cx={lF[2][0] + 12} cy={lF[2][1] - 2} rx={9} ry={3} fill={lighten(shoe, 0.35)} opacity={0.7} />
					</>
				)}
				{/* torso */}
				<g transform={`rotate(${lean})`}>
					{outfit === 'hoodie' ? <ellipse cx={-14} cy={torsoTop + 12} rx={25} ry={17} fill={sh} /> : null}
					<rect x={-bw} y={torsoTop} width={bw * 2} height={-torsoTop + 12} rx={22} fill={color} />
					<rect x={-30} y={torsoTop + 10} width={11} height={-torsoTop - 6} rx={5} fill={sh} opacity={0.45} />
					<rect x={18} y={torsoTop + 12} width={8} height={-torsoTop - 16} rx={4} fill={hi} opacity={0.7} />
					{outfit === 'hoodie' ? (
						<>
							<rect x={-4} y={-50} width={30} height={26} rx={6} fill="none" stroke={sh} strokeWidth={2.5} />
							<line x1={6} y1={torsoTop + 10} x2={5} y2={torsoTop + 46} stroke={lighten(color, 0.7)} strokeWidth={3} strokeLinecap="round" />
							<line x1={14} y1={torsoTop + 10} x2={14} y2={torsoTop + 42} stroke={lighten(color, 0.7)} strokeWidth={3} strokeLinecap="round" />
						</>
					) : null}
					{outfit === 'suit' ? (
						<>
							<path d={`M${-4},${torsoTop + 2} L${22},${torsoTop + 2} L${10},${torsoTop + 46} Z`} fill="#f2efe8" />
							<path d={`M${7},${torsoTop + 8} L${13},${torsoTop + 8} L${15},${torsoTop + 50} L${10},${torsoTop + 58} L${5},${torsoTop + 50} Z`} fill="#d23b3b" />
							<line x1={-4} y1={torsoTop + 2} x2={10} y2={torsoTop + 60} stroke={darken(color, 0.4)} strokeWidth={2.5} />
						</>
					) : null}
					{outfit === 'coat' ? (
						<>
							<path d={`M${-2},${torsoTop + 2} L${20},${torsoTop + 2} L${9},${torsoTop + 40} Z`} fill={darken(color, 0.12)} />
							<line x1={9} y1={torsoTop + 40} x2={9} y2={6} stroke={darken(color, 0.18)} strokeWidth={2.5} />
							<rect x={14} y={-70} width={14} height={16} rx={2} fill="none" stroke={darken(color, 0.2)} strokeWidth={2} />
							<rect x={-6} y={torsoTop + 22} width={12} height={4} rx={2} fill="#3fae8f" />
						</>
					) : null}
					{outfit === 'apron' ? (
						<>
							<rect x={-14} y={torsoTop + 34} width={40} height={-torsoTop - 28} rx={6} fill="#f1ede4" />
							<line x1={-10} y1={torsoTop + 36} x2={-2} y2={torsoTop + 6} stroke="#f1ede4" strokeWidth={3} />
							<line x1={22} y1={torsoTop + 36} x2={18} y2={torsoTop + 6} stroke="#f1ede4" strokeWidth={3} />
						</>
					) : null}
					{outfit === 'gown' ? (
						<>
							<circle cx={0} cy={-60} r={3} fill={darken(color, 0.15)} />
							<circle cx={14} cy={-30} r={3} fill={darken(color, 0.15)} />
							<circle cx={-12} cy={-90} r={3} fill={darken(color, 0.15)} />
						</>
					) : null}
{outfit === 'polo' ? (
						<>
							<path d={`M${-16},${torsoTop + 2} L${0},${torsoTop + 16} L${16},${torsoTop + 2} L${10},${torsoTop - 2} L${0},${torsoTop + 6} L${-10},${torsoTop - 2} Z`} fill={trim} />
							<circle cx={0} cy={torsoTop + 24} r={2.6} fill={trim} />
							<circle cx={0} cy={torsoTop + 34} r={2.6} fill={trim} />
							<rect x={-bw} y={-26} width={bw * 2} height={7} fill={trim} opacity={0.85} />
						</>
					) : null}
					{outfit === 'dress' ? (
						<>
							<path d={`M${-bw - 2},${-34} L${bw + 2},${-34} L${bw + 22},${30} Q0,${40} ${-bw - 22},${30} Z`} fill={color} />
							<path d={`M${-bw - 10},${0} L${bw + 10},${0} L${bw + 22},${30} Q0,${40} ${-bw - 22},${30} Z`} fill={darken(color, 0.12)} opacity={0.6} />
							<rect x={-bw - 2} y={-40} width={bw * 2 + 4} height={8} rx={3} fill={trim} />
							<circle cx={10} cy={torsoTop + 26} r={7} fill={trim} opacity={0.9} />
						</>
					) : null}
					{outfit === 'vest' ? (
						<>
							<path d={`M${-bw},${torsoTop + 4} L${-4},${torsoTop + 4} L${-4},${8} L${-bw},${8} Z`} fill={trim} />
							<path d={`M${bw},${torsoTop + 4} L${4},${torsoTop + 4} L${4},${8} L${bw},${8} Z`} fill={trim} />
							<rect x={-bw + 5} y={-56} width={18} height={14} rx={2} fill="none" stroke={darken(trim, 0.3)} strokeWidth={2.2} />
							<rect x={bw - 23} y={-56} width={18} height={14} rx={2} fill="none" stroke={darken(trim, 0.3)} strokeWidth={2.2} />
							<line x1={0} y1={torsoTop + 4} x2={0} y2={8} stroke={darken(trim, 0.35)} strokeWidth={2} strokeDasharray="4 3" />
						</>
					) : null}
					{outfit === 'shirt' ? (
						<>
							<path d={`M${-12},${torsoTop + 1} L${0},${torsoTop + 14} L${12},${torsoTop + 1}`} stroke={trim} strokeWidth={5} fill="none" strokeLinejoin="round" />
							{[22, 44, 66, 88].map((d) => (
								<circle key={d} cx={2} cy={torsoTop + d} r={2.4} fill={darken(color, 0.35)} />
							))}
							<rect x={10} y={torsoTop + 22} width={15} height={13} rx={2} fill="none" stroke={darken(color, 0.25)} strokeWidth={2} />
						</>
					) : null}
					{outfit === 'hivis' ? (
						<>
							<rect x={-bw} y={-58} width={bw * 2} height={9} fill={trim} />
							<rect x={-bw} y={-30} width={bw * 2} height={9} fill={trim} />
						</>
					) : null}
					{acc.includes('apronOver') ? (
						<>
							<rect x={-bw + 6} y={torsoTop + 30} width={bw * 2 - 12} height={-torsoTop - 6} rx={6} fill="#f1ede4" />
							<line x1={-bw + 10} y1={torsoTop + 32} x2={-6} y2={torsoTop + 4} stroke="#f1ede4" strokeWidth={3} />
							<line x1={bw - 10} y1={torsoTop + 32} x2={6} y2={torsoTop + 4} stroke="#f1ede4" strokeWidth={3} />
						</>
					) : null}
					{acc.includes('tape') ? (
						<g transform={`translate(${-bw + 2},-8)`}>
							<rect x={-8} y={-10} width={20} height={20} rx={4} fill="#f2c230" stroke="#3a3020" strokeWidth={2} />
							<circle cx={2} cy={0} r={4} fill="#3a3020" />
						</g>
					) : null}
					{p.chestText ? (
						<g transform={`translate(4,${torsoTop + 40}) rotate(-4)`}>
							<rect x={-26} y={-10} width={52} height={20} rx={3} fill="#fbfaf4" stroke="#c94a3a" strokeWidth={2} />
							<text x={0} y={5} textAnchor="middle" fontSize={10} fontFamily="'Rubik', sans-serif" fontWeight={900} fill="#c94a3a">{p.chestText}</text>
						</g>
					) : null}
				</g>
				{/* front arm */}
<Limb pts={aF} w={24 * BW} c={color} hi={hi} hiSide={-1} />
				{p.handItem ? <g transform={`translate(${aF[2][0]},${aF[2][1]})`}>{p.handItem}</g> : null}
				{(() => {
					const h = aF[2];
					const a = pose.armF[0] + pose.armF[1];
					const dd = dir(a);
					if (p.handF === 'point')
						return <line x1={h[0]} y1={h[1]} x2={h[0] + dd[0] * 24} y2={h[1] + dd[1] * 24} stroke="#0b0b0d" strokeWidth={6} strokeLinecap="round" />;
					if (p.handF === 'snap')
						return (
							<>
								<line x1={h[0]} y1={h[1]} x2={h[0] + dd[0] * 21 - dd[1] * 3} y2={h[1] + dd[1] * 21 + dd[0] * 3} stroke="#0b0b0d" strokeWidth={6} strokeLinecap="round" />
								<line x1={h[0]} y1={h[1]} x2={h[0] + dd[0] * 15 + dd[1] * 5} y2={h[1] + dd[1] * 15 - dd[0] * 5} stroke="#0b0b0d" strokeWidth={6} strokeLinecap="round" />
							</>
						);
					return null;
				})()}
{p.fist ? <Fist at={aF[2]} ang={pose.armF[0] + pose.armF[1]} k={p.fist} size={p.fistK} /> : p.handF ? <circle cx={aF[2][0]} cy={aF[2][1]} r={10} fill="#0b0b0d" /> : <Hand at={aF[2]} ang={pose.armF[0] + pose.armF[1]} cuff={cuff} />}
				{/* head */}
				<line x1={add(hip, up, T - 10)[0]} y1={add(hip, up, T - 10)[1]} x2={headC[0]} y2={headC[1]} stroke="#000" strokeWidth={12} />
<g transform={`translate(${headC[0]},${headC[1]}) rotate(${pose.head + lean * 0.25}) scale(${HK})`}>
					<HeadShape hair={hair} hairColor={hairColor} front={false} />
					{p.hood ? <ellipse cx={-7} cy={-3} rx={R + 13} ry={R + 12} fill={sh} /> : null}
					{p.hood ? <path d={`M${-R - 16},${-6} C${-R - 14},${-R - 26} ${R + 6},${-R - 30} ${R + 8},${-14}`} stroke={color} strokeWidth={9} fill="none" strokeLinecap="round" /> : null}
					<circle r={R} fill="#000" />
					<HeadShape hair={hair} hairColor={hairColor} front />
					{acc.includes('headphones') ? (
						<>
							<path d={`M${-R - 4},${4} C${-R - 8},${-R - 22} ${R + 8},${-R - 22} ${R + 4},${4}`} stroke="#2b2f3a" strokeWidth={8} fill="none" />
							<rect x={-R - 14} y={-8} width={18} height={30} rx={8} fill="#e9e4f5" />
						</>
					) : null}
				</g>
			</g>
			{/* face sits outside the rim filter so the white strokes stay crisp */}
<g transform={`translate(${headC[0]},${headC[1]}) rotate(${pose.head + lean * 0.25}) scale(${HK})`}>
				{acc.includes('foreheadGlasses') ? (
					<g stroke="#fff" strokeWidth={2.5} fill="#9fd3ff" fillOpacity={0.25}>
						<ellipse cx={-14 + ex} cy={-33} rx={11} ry={7} />
						<ellipse cx={14 + ex} cy={-33} rx={11} ry={7} />
						<line x1={-3 + ex} y1={-33} x2={3 + ex} y2={-33} />
					</g>
				) : null}
				{acc.includes('beard') ? (
					<path d={`M${-R + 8},${4} Q${-R + 10},${R - 6} ${ex * 0.5},${R + 4} Q${R - 10},${R - 6} ${R - 8},${4}`} stroke={hairColor} strokeWidth={7} fill="none" strokeLinecap="round" strokeDasharray="2 6" />
				) : null}
				<Eye cx={eL[0]} cy={eL[1]} rx={erx} ry={ery} pr={pr} look={look} lid={Math.max(lid, p.lidL ?? 0)} />
				<Eye cx={eR[0]} cy={eR[1]} rx={erx} ry={ery} pr={pr} look={look} lid={Math.max(lid, p.lidR ?? 0)} />
				{age > 0.05 ? (
					<g>
						<path d={`M${eL[0] - 8},${eL[1] + 15} q8,5 16,0 M${eR[0] - 8},${eR[1] + 15} q8,5 16,0`} stroke="#8a8f9e" strokeWidth={2.2} fill="none" strokeLinecap="round" opacity={Math.min(1, age * 1.5)} />
						<path d={`M${-20 + ex},${-30} q20,-5 40,0 M${-14 + ex},${-37} q14,-4 28,0`} stroke="#6f7482" strokeWidth={2} fill="none" strokeLinecap="round" opacity={Math.min(0.85, age * 1.1)} />
						{Array.from({length: 26}).map((_, i) => {
							const a = Math.PI * (0.12 + 0.76 * ((i * 0.6180339) % 1));
							const rr = R * (0.72 + 0.22 * ((i * 0.3819) % 1));
							return <circle key={i} cx={Math.cos(a) * rr * 0.92 + ex * 0.4} cy={Math.sin(a) * rr * 0.8 + 6} r={1.5} fill="#9aa0ae" opacity={Math.min(1, age * 4)} />;
						})}
					</g>
				) : null}
				{acc.includes('glasses') ? (
					<g stroke="#fff" strokeWidth={2.5} fill="none">
						<circle cx={eL[0]} cy={eL[1]} r={erx + 4} />
						<circle cx={eR[0]} cy={eR[1]} r={erx + 4} />
						<line x1={eL[0] + erx + 4} y1={eL[1]} x2={eR[0] - erx - 4} y2={eR[1]} />
					</g>
				) : null}
				{acc.includes('mustache') ? (
					<g stroke="#e4e4ea" strokeWidth={6.5} strokeLinecap="round">
						<line x1={mx - 18} y1={15} x2={mx - 3} y2={13} />
						<line x1={mx + 3} y1={13} x2={mx + 18} y2={15} />
					</g>
				) : null}
				{brow(eL, -1)}
				{brow(eR, 1)}
				{(p.talk ?? 0) > 0.06 ? <ellipse cx={mx} cy={24} rx={6 + 2 * (p.talk ?? 0)} ry={2.5 + 8 * Math.min(1, p.talk ?? 0)} fill="#fff" /> : mouthEl}
			</g>
			{p.armOver ? (
				<g>
					<Limb pts={aF} w={24 + rimW * 2} c={rim} />
					<Limb pts={aF} w={24} c={color} hi={hi} hiSide={-1} />
					<circle cx={aF[2][0]} cy={aF[2][1]} r={10 + rimW} fill={rim} />
					{p.fist ? <Fist at={aF[2]} ang={pose.armF[0] + pose.armF[1]} k={p.fist} size={p.fistK} /> : <circle cx={aF[2][0]} cy={aF[2][1]} r={10} fill="#0b0b0d" />}
				</g>
			) : null}
		</g>
	);
};

// World-space position of the front hand, for attaching FX to it.
export const frontHand = (pose: Pose, x: number, y: number, scale: number, facing: 1 | -1): V => {
	const up: V = [Math.sin(rad(pose.lean)), -Math.cos(rad(pose.lean))];
	const fwd: V = [Math.cos(rad(pose.lean)), Math.sin(rad(pose.lean))];
	const sh = add(add([0, 0], up, T - 18), fwd, 2);
	const e = add(sh, dir(pose.armF[0]), UA);
	const h = add(e, dir(pose.armF[0] + pose.armF[1]), FA);
	return [x + h[0] * scale * facing, y + h[1] * scale];
};

/* ---------------------------- skeleton & arm IK ----------------------------
   Local rig space: hip at the origin, +x toward the facing direction, +y down,
   unscaled. Shots convert world targets with toLocal(). */
export const RIG = {T, R, UA, FA, TH, SH};
export const rigPoints = (pose: Pose) => {
	const up: V = [Math.sin(rad(pose.lean)), -Math.cos(rad(pose.lean))];
	const fwd: V = [Math.cos(rad(pose.lean)), Math.sin(rad(pose.lean))];
	const shF = add(add([0, 0], up, T - 18), fwd, 2);
	const shB = add(shF, fwd, -8);
	const head = add([0, 0], up, T + R * 0.78);
	return {shF, shB, head, up, fwd};
};
/* two-bone solve: upper angle + elbow bend that put the hand at t (elbow bends forward) */
export const ikArm = (s: V, t: V): [number, number] => {
	const dx = t[0] - s[0];
	const dy = t[1] - s[1];
	const d = Math.max(Math.abs(UA - FA) + 1, Math.min(UA + FA - 0.5, Math.hypot(dx, dy)));
	const th = (Math.atan2(dx, dy) * 180) / Math.PI;
	const B = (Math.acos((UA * UA + d * d - FA * FA) / (2 * UA * d)) * 180) / Math.PI;
	const C = (Math.acos((UA * UA + FA * FA - d * d) / (2 * UA * FA)) * 180) / Math.PI;
	return [th - B, 180 - C];
};
/* world point -> rig-local point of a figure at (x, y) with scale/facing */
export const toLocal = (wx: number, wy: number, x: number, y: number, scale: number, facing: 1 | -1): V => [((wx - x) / scale) * facing, (wy - y) / scale];
