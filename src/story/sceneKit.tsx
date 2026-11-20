import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Cam} from '../engine/camera';
import {Pose} from '../engine/Stickman';
import {Actor, useShot} from '../kit/core';
import {Layer, Stage, Svg, camOn, clamp, ease, mixCam} from '../kit/kit';
import {idle} from '../kit/actions';
import {Board, Cite, FONT, HAND, RuleCard} from '../kit/ui';
import {CastShadow, HBadge, SkyBox, Tod, isDark, sOf} from './places';
import {hot} from './common';

/* camera keyframes over local frames: [[frame, X, Y, zoom], ...] */
export const camK = (f: number, keys: [number, number, number, number][]): Cam => {
	if (f <= keys[0][0]) return camOn(keys[0][1], keys[0][2], keys[0][3]);
	for (let i = 1; i < keys.length; i++)
		if (f <= keys[i][0]) {
			const k = interpolate(f, [keys[i - 1][0], keys[i][0]], [0, 1], {...clamp, easing: ease});
			return mixCam(camOn(keys[i - 1][1], keys[i - 1][2], keys[i - 1][3]), camOn(keys[i][1], keys[i][2], keys[i][3]), k);
		}
	const l = keys[keys.length - 1];
	return camOn(l[1], l[2], l[3]);
};

const BG: Record<Tod, string> = {dawn: '#6f8fd0', morning: '#5fa6e8', noon: '#3f8fe6', evening: '#4f86d6', sunset: '#3a4f9a', dusk: '#1d2a5a', night: '#0f1736', overcast: '#8f99a8'};

/* Outdoor stage: sky far away (depth 4), optional far set (depth 1.8), world (depth 1), foreground (depth 0.6). */
export const Outdoor: React.FC<{tod: Tod; cam: Cam; id: string; sun?: [number, number]; sunR?: number; far?: React.ReactNode; fg?: React.ReactNode; children: React.ReactNode; dust?: string}> = ({tod, cam, id, sun, sunR, far, fg, children, dust}) => (
	<Stage cam={cam} bg={BG[tod]} light={isDark(tod) ? {night: true, o: 0.3, x: 70, y: 20} : tod === 'sunset' || tod === 'evening' ? {c: '255,190,120', o: 0.5, x: 85, y: 55} : {o: 0.32}} dust={dust}>
		<Layer depth={4}>
			<Svg>
				<SkyBox tod={tod} id={id} sun={sun} sunR={sunR} />
			</Svg>
		</Layer>
		{far ? (
			<Layer depth={1.8}>
				<Svg>{far}</Svg>
			</Layer>
		) : null}
		<Layer depth={1}>
			<Svg>{children}</Svg>
		</Layer>
		{fg ? (
			<Layer depth={0.6}>
				<Svg>{fg}</Svg>
			</Layer>
		) : null}
	</Stage>
);

/* The hero at height h metres, feet at (x, gy), with the height badge over the head and an optional long shadow. */
export const Giant: React.FC<{
	x: number;
	gy: number;
	ppm: number;
	h: number;
	hk?: [number, number][];
	f?: number;
	pose?: Pose;
	facing?: 1 | -1;
	badge?: number; // badge scale (0 = hidden)
	shadow?: {dir: 1 | -1; k: number; o?: number}; // k = shadow length / own height
	uid: string;
	expr?: React.ComponentProps<typeof Actor>['expr'];
	mouth?: React.ComponentProps<typeof Actor>['mouth'];
	look?: [number, number];
	faceTurn?: number;
	vx?: number;
	bob?: number;
	handItem?: React.ReactNode;
}> = ({x, gy, ppm, h, hk, f = 0, pose, facing = 1, badge = 1, shadow, uid, expr, mouth, look, faceTurn = 0.5, vx, bob, handItem}) => {
	const s = sOf(h, ppm);
	const top = gy - h * ppm;
	return (
		<g>
			{shadow ? <CastShadow fx={x} gy={gy} len={Math.min(4000, h * ppm * shadow.k)} w={Math.max(10, s * 60)} dir={shadow.dir} o={shadow.o ?? 0.3} /> : null}
			<Actor who="hero" x={x} floor={gy} s={s} facing={facing} pose={pose ?? idle(f, 3)} uid={uid} expr={expr} mouth={mouth} look={look} faceTurn={faceTurn} vx={vx} bob={bob} handItem={handItem} />
			{badge > 0 ? <HBadge x={x} y={top - Math.max(16, 26 * s)} h={h} s={badge} hot={hk ? hot(f, hk) : 0} /> : null}
		</g>
	);
};

/* someone of normal size in an outdoor scene */
export const Person: React.FC<{who: string; x: number; gy: number; ppm: number; h?: number; pose?: Pose; facing?: 1 | -1; uid: string; f?: number; expr?: React.ComponentProps<typeof Actor>['expr']; mouth?: React.ComponentProps<typeof Actor>['mouth']; look?: [number, number]; vx?: number; bob?: number; handItem?: React.ReactNode}> = ({who, x, gy, ppm, h = 1.6, pose, facing = 1, uid, f = 0, ...rest}) => (
	<Actor who={who} x={x} floor={gy} s={sOf(h, ppm)} facing={facing} pose={pose ?? idle(f, uid.length)} uid={uid} {...rest} />
);

/* --------------------------------- cards ---------------------------------- */
export const Rule: React.FC<{n: string; text: string; icon?: React.ReactNode}> = ({n, text, icon}) => {
	const {f} = useShot();
	return <RuleCard n={n} title="ПРАВИЛО" text={text} t={f} icon={icon} />;
};
/* infographic card: title on top, children (svg 1920x1080) in the middle, source at the bottom */
export const Card: React.FC<{title: string; cite?: string; children: React.ReactNode; tint?: string}> = ({title, cite, children, tint}) => {
	const {f} = useShot();
	const k = interpolate(f, [0, 12], [0, 1], {...clamp, easing: ease});
	return (
		<Board tint={tint}>
			<svg viewBox="0 0 1920 1080" width={1920} height={1080}>
				<text x={960} y={150} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={64} fill="#ffc94a" opacity={k}>
					{title}
				</text>
				{children}
			</svg>
			{cite ? <Cite text={cite} t={f} /> : null}
		</Board>
	);
};
export const Big: React.FC<{x: number; y: number; text: string; size?: number; c?: string; t?: number; hand?: boolean}> = ({x, y, text, size = 56, c = '#ffffff', t = 99, hand}) => (
	<text x={x} y={y} textAnchor="middle" fontFamily={hand ? HAND : FONT} fontWeight={hand ? 700 : 900} fontSize={size} fill={c} opacity={interpolate(t, [0, 8], [0, 1], clamp)}>
		{text}
	</text>
);
export const Title: React.FC<{lines: string[]; f: number; from: number; top?: number; size?: number}> = ({lines, f, from, top = 380, size = 92}) => {
	const k = interpolate(f, [from, from + 10], [0, 1], {...clamp, easing: ease});
	return (
		<AbsoluteFill style={{alignItems: 'center', top, opacity: k, transform: `scale(${0.9 + 0.1 * k})`}}>
			{lines.map((l, i) => (
				<div key={i} style={{fontFamily: FONT, fontWeight: 900, fontSize: size, color: '#ffc94a', textShadow: '0 6px 0 #1b1f2e, 0 10px 30px rgba(0,0,0,.5)', lineHeight: 1.08, textAlign: 'center'}}>
					{l}
				</div>
			))}
		</AbsoluteFill>
	);
};
