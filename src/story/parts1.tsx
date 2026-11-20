import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Pose, toLocal} from '../engine/Stickman';
import {Actor, useShot, useSpeaking} from '../kit/core';
import {Layer, Stage, Svg, camOn, clamp, ease, usePush} from '../kit/kit';
import {env, gesture, idle, reach, walk, walkTo, SIT} from '../kit/actions';
import {Bedroom, Elevator, Kitchen, KitchenTable} from '../kit/sets';
import {Chair} from '../engine/props';
import {PhoneChat} from '../kit/ui';
import {Bench, Block, Bush, CastShadow, Fridge, Garages, Ground, HBadge, Poplar, RoomWin, SkyBox, StreetLamp, SunPatch, Tod, kitchenWin, sOf} from './places';
import {Calendar, Encyclopedia, Notebook, PencilPot, Phone, Plate} from './props';
import {Big, Card, Giant, Outdoor, Person, Rule, Title, camK} from './sceneKit';
import {hAt, hot} from './common';

const LEGK = 1 + 148 * 0.06 / 157; // hero leg build → hip height factor
export const heroHip = (gy: number, s: number) => gy - (157 + 148 * 0.06) * s;
const PH = 1.6;

/* ------------------------------ yard (wide) ------------------------------ */
export const Yard: React.FC<{tod: Tod; ppm: number; gy: number; bx?: number; trees?: boolean; garages?: boolean; lamp?: boolean}> = ({tod, ppm, gy, bx = 200, trees = true, garages = true, lamp}) => (
	<g>
		<Block x={bx} gy={gy} ppm={ppm} tod={tod} />
		{garages ? <Garages x={bx + 26 * ppm} gy={gy} ppm={ppm} tod={tod} /> : null}
		{trees ? <Poplar x={bx + 23 * ppm} gy={gy} ppm={ppm} tod={tod} /> : null}
		{trees ? <Poplar x={bx - 3 * ppm} gy={gy} ppm={ppm} tod={tod} h={12} /> : null}
		{lamp ? <StreetLamp x={bx + 20 * ppm} gy={gy} ppm={ppm} on /> : null}
		<Ground gy={gy} tod={tod} />
		<Bush x={bx + 8 * ppm} gy={gy} ppm={ppm} tod={tod} />
		<Bench x={bx + 15 * ppm} gy={gy} ppm={ppm} />
	</g>
);

/* 001–003: 20:00, the hero (12,4 m) looks into the kitchen window; Ася hands the plate out */
const S01: React.FC = () => {
	const {f, at} = useShot();
	const P = 45, GY = 1000, BX = 200;
	const [wx, wy] = kitchenWin(BX, GY, P);
	const h = 12.4;
	const s = sOf(h, P);
	const hx = wx + 150;
	const take = env(f, at('003') + 20, at('003') + 150, 22, 30);
	let pose: Pose = {...idle(f, 2), lean: 8, head: 10};
	pose = reach(pose, 'F', toLocal(wx + 8, wy + 36, hx, heroHip(GY, s), s, -1), take);
	const cam = camK(f, [[0, hx, GY - 120, 1.5], [at('001') + 70, hx - 40, wy + 20, 1.55], [at('002') + 10, wx + 60, wy + 10, 2.1], [at('003') + 10, wx + 80, wy + 30, 1.9], [at('003') + 140, hx - 60, 640, 1.0]]);
	const plateOn = f >= at('003') && f < at('003') + 60;
	return (
		<Outdoor tod="sunset" cam={cam} id="s01" sun={[1700, 820]} sunR={70}>
			<Yard tod="sunset" ppm={P} gy={GY} bx={BX} />
			<defs>
				<clipPath id="kw01">
					<rect x={wx - 38} y={wy - 31} width={76} height={62} />
				</clipPath>
			</defs>
			<g clipPath="url(#kw01)">
				<rect x={wx - 40} y={wy - 40} width={80} height={80} fill="#ffe1a8" />
				<Actor who="sis" x={wx - 12} floor={wy + 60} s={0.17} facing={1} uid="sis01" pose={gesture('wave', idle(f, 5), env(f, at('002'), at('002') + 40, 6, 10), f)} expr="normal" mouth="smile" />
			</g>
			{plateOn ? <Plate x={wx + 10} y={wy + 31} s={0.22} /> : null}
			<Giant x={hx} gy={GY} ppm={P} h={h} pose={pose} facing={-1} uid="h01" shadow={{dir: -1, k: 7.7, o: 0.25}} look={[-0.9, -0.1]} faceTurn={0.2} handItem={f >= at('003') + 60 ? <Plate x={0} y={14} s={0.3} /> : undefined} />
		</Outdoor>
	);
};

/* 004: noon, the lift — the hero at 1,02 m cannot reach «4» */
const LiftShot: React.FC<{h: number; tip?: boolean; neighbor?: boolean}> = ({h, tip, neighbor}) => {
	const {f, gf, dur} = useShot();
	const s = h / PH;
	const x = 1380;
	const stretch = env(f, 6, dur - 4, 10, 10) * (0.6 + 0.4 * Math.sin(f / 6) * 0.5);
	let pose: Pose = reach(idle(f, 4), 'F', toLocal(1530, 520, x, heroHip(900, s), s, 1), stretch);
	pose = {...pose, lean: -4 * stretch};
	const cam = usePush(camOn(1300, 640, 1.25), camOn(1420, 600, 1.55));
	return (
		<Stage cam={cam} bg="#7d8699" light={{x: 60, y: 10, o: 0.3}}>
			<Layer depth={1}>
				<Elevator f={gf} />
				<Svg>
					<Actor who="hero" x={x} floor={900} s={s} facing={1} pose={pose} uid="hl" bob={tip ? Math.abs(Math.sin(f / 5)) * 6 : 0} look={[0.6, -0.8]} expr="worried" />
					{neighbor ? <Actor who="neighborM" x={1150} floor={900} s={1.08} facing={1} uid="nl" pose={reach(idle(f, 7), 'F', toLocal(1530, 460, 1150, 900 - 157 * 1.08 - 148 * 0, 1.08, 1), env(f, 30, 70, 8, 8))} /> : null}
					<HBadge x={x} y={900 - h / PH * 371 - 30} h={h} s={0.8} />
				</Svg>
			</Layer>
		</Stage>
	);
};
const S02: React.FC = () => <LiftShot h={1.02} tip />;

/* 005: split — noon short shadow / evening long shadow */
const S03: React.FC = () => {
	const {f} = useShot();
	const P = 26, GY = 900;
	const k = interpolate(f, [10, 60], [0, 1], {...clamp, easing: ease});
	const hL = 1.02, hR = interpolate(k, [0, 1], [1.6, 16]);
	const cam = usePush(camOn(960, 560, 1), camOn(960, 540, 1.05));
	return (
		<Stage cam={cam} bg="#1b1f2e" light={false}>
			<Layer depth={1}>
				<Svg>
					<clipPath id="spl">
						<rect x={0} y={-500} width={958} height={2000} />
					</clipPath>
					<clipPath id="spr">
						<rect x={962} y={-500} width={1000} height={2000} />
					</clipPath>
					<g clipPath="url(#spl)">
						<SkyBox tod="noon" id="s03a" sun={[480, 120]} />
						<Ground gy={GY} tod="noon" />
						<CastShadow fx={480} gy={GY} len={hL * P * 2 * 0.64} w={18} dir={-1} o={0.45} />
						<Actor who="hero" x={480} floor={GY} s={sOf(hL, P * 2)} uid="sp1" pose={idle(f, 1)} />
						<HBadge x={480} y={GY - hL * P * 2 - 20} h={hL} s={0.9} />
						<Big x={480} y={170} text="12:30" size={64} c="#1b1f2e" />
					</g>
					<g clipPath="url(#spr)">
						<SkyBox tod="sunset" id="s03b" sun={[1840, 820]} />
						<Ground gy={GY} tod="sunset" />
						<CastShadow fx={1400} gy={GY} len={Math.min(1400, hR * P * 7)} w={30} dir={-1} o={0.45} />
						<Actor who="hero" x={1400} floor={GY} s={sOf(hR, P)} uid="sp2" pose={idle(f, 2)} />
						<HBadge x={1400} y={GY - hR * P - 20} h={hR} s={0.9} hot={k > 0 && k < 1 ? 1 : 0} />
						<Big x={1440} y={170} text="20:20" size={64} c="#fff6d6" />
					</g>
					<rect x={958} y={-500} width={4} height={2000} fill="#fff" />
				</Svg>
			</Layer>
		</Stage>
	);
};

/* 006–007: title over the roofs at sunset; 007 calendar flips back to 8 June */
const S04: React.FC = () => {
	const {f, at} = useShot();
	const P = 30, GY = 1000;
	const cam = usePush(camOn(960, 600, 1), camOn(1100, 560, 1.12));
	const flip = Math.floor(interpolate(f, [at('007'), at('007') + 50], [14, 8], clamp));
	return (
		<>
			<Outdoor tod="sunset" cam={cam} id="s04" sun={[1500, 760]} sunR={80} far={<><Block x={-300} gy={GY} ppm={P} tod="sunset" kitchen={false} /><Block x={900} gy={GY} ppm={P} tod="sunset" kitchen={false} tint="#cdb08a" /></>}>
				<Ground gy={GY} tod="sunset" />
			</Outdoor>
			{f < at('007') ? <Title lines={['ЧТО ЕСЛИ ТЫ СТАНЕШЬ', 'САМЫМ ВЫСОКИМ?']} f={f} from={12} top={330} /> : null}
			{f >= at('007') ? (
				<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
					<svg width={600} height={420} viewBox="-150 -260 300 280">
						<Calendar x={0} y={0} s={1.8} circles={0} />
					</svg>
					<div style={{position: 'absolute', top: 760, fontFamily: "'Rubik'", fontWeight: 900, fontSize: 96, color: '#ffc94a', textShadow: '0 6px 0 #1b1f2e'}}>{flip} ИЮНЯ</div>
				</AbsoluteFill>
			) : null}
		</>
	);
};

/* ------------------------------ part 2: morning ------------------------------ */
/* 008–010: dawn bedroom, the beam crawls to the bed, the foot slides out into it */
const S05: React.FC = () => {
	const {f, at} = useShot();
	const beam = interpolate(f, [0, at('010')], [200, 640], clamp);
	const foot = env(f, at('010') + 10, 9999, 14, 1);
	const cam = camK(f, [[0, 960, 560, 1.0], [at('009'), 1100, 640, 1.2], [at('010'), 760, 760, 1.9]]);
	return (
		<Stage cam={cam} bg="#2a3366" light={{x: 85, y: 40, c: '255,200,140', o: 0.5}}>
			<Layer depth={1}>
				<Svg>
					<rect x={-800} y={-400} width={3600} height={1300} fill="#b7c9e6" />
					<rect x={-800} y={900} width={3600} height={500} fill="#8a6a50" />
					<RoomWin x={1380} w={340} tod="dawn" id="s05" sun={[1700, 560]} curtains={0.3} />
					<SunPatch x0={beam} x1={beam + 140} y={830} slant={-60} o={0.5} />
					<path d={`M1380,560 L${beam},830 L${beam + 140},830 L1700,560 Z`} fill="#ffd98a" opacity={0.12} />
					<rect x={200} y={700} width={600} height={70} rx={12} fill="#e9e4f5" />
					<rect x={200} y={770} width={600} height={130} fill="#7a5a3a" />
					<rect x={210} y={650} width={150} height={60} rx={22} fill="#fff" />
					<circle cx={300} cy={640} r={46} fill="#000" />
					<path d="M250,620 q50,-60 100,0" fill="#000" />
					<rect x={330} y={660} width={430} height={70} rx={30} fill="#5a7ad0" />
					<g transform={`translate(${760 + foot * 60},${700})`}>
						<ellipse cx={0} cy={0} rx={30} ry={15} fill="#1f2a44" />
						<ellipse cx={12} cy={-4} rx={22} ry={12} fill="#0b0b0d" />
					</g>
					<text x={1540} y={200} textAnchor="middle" fontFamily="'Rubik'" fontWeight={900} fontSize={54} fill="#ff6a5a">05:10</text>
				</Svg>
			</Layer>
		</Stage>
	);
};
/* 011–013: he grows (1,60 → 2,40) touching the lamp, then pulls the foot back and shrinks */
const S06: React.FC = () => {
	const {f, at} = useShot();
	const hk: [number, number][] = [[0, 1.6], [24, 2.4], [at('013') + 20, 2.4], [at('013') + 90, 1.6]];
	const h = hAt(f, hk);
	const s = h / PH;
	const lamp = Math.sin(f / 5) * 14 * env(f, 24, at('013'), 4, 20);
	const cam = camK(f, [[0, 960, 600, 1.0], [at('012'), 1000, 380, 1.5], [at('013') + 30, 960, 620, 1.05]]);
	return (
		<Stage cam={cam} bg="#2a3366" light={{x: 85, y: 40, c: '255,200,140', o: 0.5}}>
			<Layer depth={1}>
				<Svg>
					<rect x={-800} y={-400} width={3600} height={1300} fill="#b7c9e6" />
					<rect x={-800} y={-400} width={3600} height={420} fill="#9fb2d2" />
					<rect x={-800} y={900} width={3600} height={500} fill="#8a6a50" />
					<RoomWin x={1380} w={340} tod="dawn" id="s06" sun={[1700, 560]} curtains={0.3} />
					<SunPatch x0={820} x1={1000} y={860} slant={-40} o={0.5} />
					<g transform={`rotate(${lamp} 960 20)`}>
						<line x1={960} y1={20} x2={960} y2={110} stroke="#333" strokeWidth={4} />
						<path d="M900,110 L1020,110 L990,70 L930,70 Z" fill="#f2c94c" />
					</g>
					<rect x={300} y={780} width={600} height={50} rx={12} fill="#e9e4f5" />
					<rect x={300} y={830} width={600} height={70} fill="#7a5a3a" />
					<Actor who="hero" x={900} floor={900} s={s} pose={{...idle(f, 1), head: -6}} uid="h06" expr={f < at('013') ? 'wide' : 'worried'} mouth={f >= at('012') && f < at('013') ? 'open' : 'line'} look={[0, -0.8]} />
					<HBadge x={900} y={900 - h / PH * 371 - 20} h={h} s={0.8} hot={hot(f, hk)} />
				</Svg>
			</Layer>
		</Stage>
	);
};
/* 014: one finger into the beam — badge twitches 1,60 → 1,75 → 1,60 */
const S07: React.FC = () => {
	const {f} = useShot();
	const hk: [number, number][] = [[0, 1.6], [30, 1.6], [40, 1.75], [62, 1.75], [72, 1.6]];
	const h = hAt(f, hk);
	const fin = env(f, 26, 66, 8, 8);
	const cam = usePush(camOn(960, 600, 1.4), camOn(980, 580, 1.6));
	return (
		<Stage cam={cam} bg="#2a3366" light={{x: 85, y: 40, c: '255,200,140', o: 0.5}}>
			<Layer depth={1}>
				<Svg>
					<rect x={-800} y={-400} width={3600} height={1300} fill="#b7c9e6" />
					<rect x={-800} y={900} width={3600} height={500} fill="#8a6a50" />
					<SunPatch x0={1000} x1={1220} y={870} slant={-30} o={0.6} />
					<Actor who="hero" x={760} floor={900} s={h / PH} pose={reach(SIT, 'F', toLocal(1060 , 880, 760, 790, h / PH, 1), fin)} seat={790} uid="h07" look={[0.9, 0.6]} expr="wide" />
					<Chair x={760} y={800} />
					<HBadge x={760} y={480} h={h} s={0.85} hot={hot(f, hk)} />
				</Svg>
			</Layer>
		</Stage>
	);
};
/* 015–020: kitchen, dad and the sun square; the hero creeps along the wall and eats standing in the corner */
const S08: React.FC = () => {
	const {f, at} = useShot();
	const sp = useSpeaking(useShot().gf);
	const w = walkTo(f, at('016'), at('016') + 90, -100, 300, 4, 0.25);
	const hx = f < at('016') ? -200 : w.x;
	const eat = env(f, at('020') + 10, 99999, 12, 1);
	const hp = f >= at('020') ? reach(idle(f, 2), 'F', toLocal(760, 690, 300, 900 - 157 - 148 * 0.06, 1, 1), eat * (0.8 + 0.2 * Math.sin(f / 7))) : w.moving ? {...w.pose, lean: -6} : idle(f, 2);
	const dadP = sp === 'DAD' ? gesture('presentF', idle(f, 3), 0.7, f) : reach(idle(f, 3), 'F', [70, -100], 0.8);
	const cam = sp === 'DAD' ? camOn(1300, 560, 1.6) : sp === 'HERO' ? camOn(320, 560, 1.6) : camK(f, [[0, 900, 560, 1.0], [at('016'), 600, 640, 1.25], [at('020'), 520, 600, 1.2]]);
	return (
		<Stage cam={cam} bg="#f3e6c4" light={{x: 70, y: 20, o: 0.45}}>
			<Layer depth={1}>
				<Kitchen />
				<Svg>
					<SunPatch x0={480} x1={980} y={900} slant={-120} o={0.5} />
					<KitchenTable mugs={1} />
					<Fridge x={160} />
					<Calendar x={160} y={500} s={0.9} circles={0} />
					{f >= at('019') ? <Plate x={760} y={700} s={1.4} /> : null}
					<Actor who="dad" x={1300} floor={900} s={1.08} facing={-1} acc={['beard', 'apronOver']} pose={dadP} uid="d08" />
					<Actor who="hero" x={hx} floor={900} s={1} facing={1} pose={hp} vx={f >= at('016') && f < at('020') ? w.vx : 0} bob={w.bob} uid="h08" expr="worried" look={[0.5, 0.3]} />
				</Svg>
			</Layer>
		</Stage>
	);
};
/* 021: phone message to Мирон */
const S09: React.FC = () => {
	const {f} = useShot();
	return (
		<Stage cam={usePush(camOn(960, 560, 1), camOn(960, 540, 1.08))} bg="#f3e6c4" light={false}>
			<Layer depth={1.4}>
				<Kitchen />
			</Layer>
			<AbsoluteFill>
				<svg width={1920} height={1080}><PhoneChat t={f} title="Мирон" msgs={[{at: 8, from: 'Ярик', text: 'СРОЧНО. Приходи.', me: true}, {at: 30, from: 'Ярик', text: 'Возьми линейку', me: true}, {at: 52, from: 'Мирон', text: '?!'}]} /></svg>
			</AbsoluteFill>
		</Stage>
	);
};

/* ------------------------------ part 3: rules ------------------------------ */
/* 022–023: Мирон in the door with the tape measure and the notebook */
const S10: React.FC = () => {
	const {f, at} = useShot();
	const w = walkTo(f, 0, 50, 1900, 1250, 6, 0.3);
	const cam = usePush(camOn(1150, 560, 1.25), camOn(1250, 520, 1.6));
	return (
		<Stage cam={cam} bg="#c9d6e6" light={{x: 30, y: 15, o: 0.38}}>
			<Layer depth={1}>
				<Svg>
					<rect x={-800} y={-400} width={3600} height={1300} fill="#d8e2ee" />
					<rect x={1460} y={260} width={320} height={640} fill="#7a5a3a" />
					<rect x={-800} y={900} width={3600} height={500} fill="#8a6a50" />
					<Actor who="friend" x={w.x} floor={900} s={1} facing={-1} pose={w.moving ? w.pose : gesture('presentF', idle(f, 6), env(f, at('023'), at('023') + 60, 8, 12), f)} vx={w.vx} bob={w.bob} uid="m10" handItem={<Notebook x={0} y={30} s={0.6} />} />
					<Actor who="hero" x={760} floor={900} s={1} facing={1} pose={idle(f, 2)} uid="h10" expr="worried" />
				</Svg>
			</Layer>
		</Stage>
	);
};
/* balcony (10:30 or noon): hero, Мирон measuring; heights by keys */
const Balcony: React.FC<{hk: [number, number][]; tape?: boolean; pot?: boolean; tod?: Tod; dark?: boolean; dad?: boolean; mugs?: boolean; sunY?: number}> = ({hk, tape = true, pot = true, tod = 'noon', dad, mugs, sunY = 120}) => {
	const {f, gf} = useShot();
	const sp = useSpeaking(gf);
	const h = hAt(f, hk);
	const s = h / PH;
	const wide = usePush(camOn(960, 560, 1.0), camOn(900, 600, 1.15));
	const cam = sp === 'FRIEND' ? camOn(1180, 560, 1.5) : sp === 'DAD' ? camOn(1180, 560, 1.5) : sp === 'HERO' ? camOn(700, 600, 1.5) : wide;
	const night = tod === 'dusk' || tod === 'night';
	return (
		<Stage cam={cam} bg="#3f8fe6" light={night ? {night: true, o: 0.3} : {x: 50, y: 5, o: 0.4}}>
			<Layer depth={3}>
				<Svg>
					<SkyBox tod={tod} id={'bal' + tod} sun={[960, sunY]} sunR={50} />
					<Block x={-600} gy={1600} ppm={40} tod={tod} kitchen={false} />
					<Block x={1100} gy={1700} ppm={40} tod={tod} kitchen={false} tint="#cdb08a" />
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<rect x={-400} y={900} width={2800} height={400} fill={night ? '#3a3f4a' : '#b9b2a6'} />
					{!night ? <SunPatch x0={420} x1={1500} y={900} slant={-40} o={0.35} /> : null}
					{pot ? <PencilPot x={1500} y={900} s={0.9} /> : null}
					{dad ? (
						<>
							<Chair x={1180} y={800} />
							<Actor who="dad" x={1180} floor={900} seat={790} s={1.05} facing={-1} pose={SIT} uid="d-bal" />
						</>
					) : (
						<Actor who="friend" x={1180} floor={900} s={1} facing={-1} pose={tape ? reach(idle(f, 6), 'F', toLocal(760, 900 - h / PH * 371, 1180, 900 - 157 * 0.95 - 148 * -0.05, 1, -1), 0.8) : idle(f, 6)} uid="m-bal" handItem={<Notebook x={0} y={30} s={0.55} open />} />
					)}
					{dad ? (
						<>
							<Chair x={760} y={800} />
							<Actor who="hero" x={760} floor={900} seat={790} s={1} facing={1} pose={SIT} uid="h-bal" />
						</>
					) : (
						<>
							<CastShadow fx={760} gy={900} len={h / PH * 371 * 0.7} w={40} dir={-1} o={0.3} />
							<Actor who="hero" x={760} floor={900} s={s} facing={1} pose={idle(f, 2)} uid="h-bal" look={[0.3, 0.6]} />
							<HBadge x={760} y={900 - s * 371 - 24} h={h} s={0.8} hot={hot(f, hk)} />
						</>
					)}
					{tape && !dad ? <line x1={1140} y1={760} x2={790} y2={900 - s * 371} stroke="#f2c230" strokeWidth={6} /> : null}
					{mugs ? <rect x={940} y={760} width={80} height={140} fill="#7a5a3a" /> : null}
					<rect x={-400} y={700} width={2800} height={14} fill="#e8eef6" />
					{Array.from({length: 30}).map((_, i) => (
						<rect key={i} x={-400 + i * 100} y={700} width={8} height={200} fill="#e8eef6" />
					))}
				</Svg>
			</Layer>
		</Stage>
	);
};
const S11: React.FC = () => {
	const {at} = useShot();
	return <Balcony hk={[[0, 1.6], [at('024') + 40, 1.6], [at('024') + 70, 1.32]]} />;
};
/* 026–027: pencil in the pot and its shadow, measured */
const S12: React.FC = () => {
	const {f, at} = useShot();
	const k = interpolate(f, [at('027') - 10, at('027') + 20], [0, 1], clamp);
	return (
		<Stage cam={usePush(camOn(960, 620, 1.3), camOn(1000, 640, 1.55))} bg="#b9b2a6" light={{x: 50, y: 5, o: 0.4}}>
			<Layer depth={1}>
				<Svg>
					<rect x={-400} y={-400} width={2800} height={1300} fill="#cfe2f6" />
					<rect x={-400} y={900} width={2800} height={400} fill="#b9b2a6" />
					<path d="M960,900 L1066,900 L1066,912 L960,912 Z" fill="#000" opacity={0.35} />
					<PencilPot x={960} y={900} s={1.4} />
					<g opacity={interpolate(f, [10, 30], [0, 1], clamp)}>
						<line x1={1150} y1={668} x2={1150} y2={900 - 52 * 1.4 + 70} stroke="#e23b3b" strokeWidth={4} />
						<Big x={1250} y={740} text="10 см" size={44} c="#e23b3b" t={f - 10} />
						<line x1={960} y1={940} x2={1075} y2={940} stroke="#3b7dd8" strokeWidth={4} />
						<Big x={1020} y={990} text="8,2 см" size={44} c="#3b7dd8" t={f - 20} />
					</g>
					<g opacity={k}>
						<rect x={360} y={180} width={1200} height={110} rx={20} fill="#1b1f2e" />
						<Big x={960} y={255} text="ТЕНЬ : ПАЛКА = 0,82  →  ТЫ = 1,60 × 0,82" size={48} c="#ffc94a" />
					</g>
				</Svg>
			</Layer>
		</Stage>
	);
};
/* 028: rule 1 */
const SunIcon: React.FC<{hi: boolean}> = ({hi}) => (
	<g>
		<circle cx={hi ? -30 : -200} cy={hi ? -210 : -40} r={34} fill="#ffcc33" />
		<rect x={-8} y={-120} width={16} height={120} fill="#fff" />
		<path d={`M-8,0 L${hi ? 60 : 380},0 L${hi ? 60 : 380},12 L-8,12 Z`} fill="#000" opacity={0.6} />
	</g>
);
const S13: React.FC = () => <Rule n="1" text="Ты во столько раз выше себя, во сколько тень палки длиннее палки" icon={<g transform="translate(0,60) scale(1.2)"><g transform="translate(-330,40)"><SunIcon hi /></g><g transform="translate(60,40)"><SunIcon hi={false} /></g></g>} />;
/* 029–030: Eratosthenes card */
const S14: React.FC = () => {
	const {f, at} = useShot();
	const k = interpolate(f, [at('030'), at('030') + 30], [0, 1], clamp);
	return (
		<Card title="ЭРАТОСФЕН, ≈ 240 г. до н. э." cite="Эратосфен: угол 7°12′ = 1/50 круга; точность спорна (длина стадия)">
			<g transform="translate(960,620)">
				<circle r={300} fill="#3b7dd8" stroke="#9fd3ff" strokeWidth={6} />
				<path d="M0,0 L0,-300 M0,0 L-37,-298" stroke="#fff" strokeWidth={4} strokeDasharray="10 8" />
				<line x1={-500} y1={-300} x2={0} y2={-300} stroke="#ffcc33" strokeWidth={5} />
				<line x1={-500} y1={-298} x2={-37} y2={-298} stroke="#ffcc33" strokeWidth={5} opacity={0.6} />
				<rect x={-6} y={-330} width={12} height={30} fill="#fff" />
				<rect x={-44} y={-328} width={12} height={30} fill="#fff" transform="rotate(-7 -37 -298)" />
				<Big x={170} y={-320} text="Сиена: тени нет" size={34} hand c="#fff" />
				<Big x={-260} y={-350} text="Александрия: тень" size={34} hand c="#fff" />
				<g opacity={k}>
					<path d="M0,-70 A70,70 0 0 0 -9,-69" stroke="#ffc94a" strokeWidth={10} fill="none" />
					<Big x={0} y={80} text="7° = 1/50 круга" size={56} c="#ffc94a" />
					<Big x={0} y={150} text="≈ 250 000 стадиев" size={44} c="#fff" />
				</g>
			</g>
		</Card>
	);
};
/* 031: bus stop with the notebook */
const S15: React.FC = () => {
	const {f} = useShot();
	const P = 140, GY = 960;
	const bus = interpolate(f, [0, 60], [2600, 1350], {...clamp, easing: ease});
	return (
		<Outdoor tod="noon" id="s15" cam={usePush(camOn(900, 600, 1), camOn(1000, 600, 1.1))} sun={[600, 60]}>
			<Ground gy={GY} tod="noon" />
			<rect x={300} y={GY - 2.6 * P} width={0.1 * P} height={2.6 * P} fill="#2b2f38" />
			<rect x={240} y={GY - 2.9 * P} width={1.2 * P} height={0.5 * P} rx={10} fill="#3b7dd8" />
			<Big x={325} y={GY - 2.55 * P} text="А" size={50} />
			<g transform={`translate(${bus},${GY})`}>
				<rect x={0} y={-3 * P} width={10 * P} height={2.6 * P} rx={30} fill="#f2c94c" />
				<rect x={30} y={-2.7 * P} width={8 * P} height={1 * P} fill="#9fd3ff" />
				<circle cx={2 * P} cy={-0.3 * P} r={0.45 * P} fill="#222" />
				<circle cx={8 * P} cy={-0.3 * P} r={0.45 * P} fill="#222" />
			</g>
			<Person who="hero" x={700} gy={GY} ppm={P} h={1.19} uid="h15" handItem={<Notebook x={0} y={30} s={0.5} open />} look={[0.8, 0]} />
			<HBadge x={700} y={GY - 1.19 * P - 22} h={1.19} s={0.75} />
		</Outdoor>
	);
};
/* 032–036: noon yard — 1,04 m; the stool; the bench (feet in shade → 1,60) */
const S16: React.FC = () => {
	const {f, at, gf} = useShot();
	const sp = useSpeaking(gf);
	const P = 150, GY = 980;
	const onStool = f >= at('034') && f < at('035');
	const bench = f >= at('035');
	const hk: [number, number][] = [[0, 1.04], [at('035') + 40, 1.04], [at('035') + 70, 1.6]];
	const h = hAt(f, hk);
	const hx = 760;
	const cam = sp === 'FRIEND' ? camOn(1250, 640, 1.5) : bench ? camOn(820, 820, 1.3) : camOn(860, 700, 1.15);
	const lie: Pose = {lean: -84, head: -10, armB: [-30, 20], armF: [20, 20], legB: [-2, 2], legF: [4, 2]};
	return (
		<Outdoor tod="noon" id="s16" cam={cam} sun={[960, -200]}>
			<Ground gy={GY} tod="noon" />
			<rect x={-600} y={GY - 6 * P} width={3000} height={6 * P - 2} fill="#d9c7a8" opacity={0.9} />
			{Array.from({length: 6}).map((_, i) => (
				<rect key={i} x={-500 + i * 520} y={GY - 5.2 * P} width={1.8 * P} height={1.4 * P} fill="#9fc4e6" stroke="#b8a888" strokeWidth={10} />
			))}
			<rect x={-600} y={GY - 0.8 * P} width={3000} height={0.8 * P} fill="#7a8a6a" />
			{bench ? (
				<g>
					<Bench x={600} gy={GY} ppm={P} />
					<rect x={480} y={GY} width={260} height={18} fill="#000" opacity={0.3} />
				</g>
			) : null}
			{onStool ? <rect x={hx - 40} y={GY - 0.45 * P} width={80} height={0.45 * P} fill="#c4643a" /> : null}
			{!bench ? <ellipse cx={hx} cy={GY + 6} rx={40} ry={8} fill="#000" opacity={0.4} /> : null}
			{bench ? (
				<Actor who="hero" x={760} floor={GY - 30} s={sOf(1.6, P)} pose={lie} uid="h16b" shadow={false} look={[0.4, -0.6]} />
			) : (
				<Actor who="hero" x={hx} floor={onStool ? GY - 0.45 * P : GY} s={sOf(h, P)} pose={idle(f, 3)} uid="h16" look={[0.5, 0]} expr={onStool ? 'worried' : 'normal'} />
			)}
			<HBadge x={bench ? 820 : hx} y={bench ? GY - 0.9 * P - 40 : (onStool ? GY - 0.45 * P : GY) - h * P - 20} h={h} s={0.8} hot={hot(f, hk)} />
			<Person who="friend" x={1250} gy={GY} ppm={P} facing={-1} uid="m16" pose={gesture('point', idle(f, 6), env(f, at('033'), at('033') + 40, 8, 10), f)} handItem={<Notebook x={0} y={30} s={0.5} open />} />
		</Outdoor>
	);
};
const S17: React.FC = () => <Rule n="2" text="Считается только свет на ногах. Ноги в тени — ты свой" />;
/* 038–039: a cloud covers the sun: 1,04 → 1,60 */
const S18: React.FC = () => {
	const {f, at} = useShot();
	const P = 150, GY = 980;
	const cl = interpolate(f, [0, 40], [-900, 960], clamp);
	const shade = interpolate(f, [30, 45], [0, 1], clamp);
	const hk: [number, number][] = [[0, 1.04], [40, 1.04], [70, 1.6]];
	const h = hAt(f, hk);
	return (
		<Outdoor tod={shade > 0.5 ? 'overcast' : 'noon'} id="s18" cam={camK(f, [[0, 900, 700, 1.1], [at('039'), 1150, 650, 1.4]])} sun={[960, 0]}>
			<Ground gy={GY} tod="noon" />
			<ellipse cx={cl} cy={GY - 7 * P} rx={600} ry={160} fill="#e6e9ef" opacity={0.95} />
			<rect x={-600} y={GY - 0.8 * P} width={3000} height={0.8 * P} fill="#7a8a6a" />
			<ellipse cx={760} cy={GY + 6} rx={40} ry={8} fill="#000" opacity={0.4 * (1 - shade)} />
			<Actor who="hero" x={760} floor={GY} s={sOf(h, P)} uid="h18" mouth={f > 40 && f < 90 ? 'open' : 'line'} expr="wide" />
			<HBadge x={760} y={GY - h * P - 20} h={h} s={0.8} hot={hot(f, hk)} />
			<Person who="friend" x={1200} gy={GY} ppm={P} facing={-1} uid="m18" handItem={<Notebook x={0} y={30} s={0.5} open />} pose={reach(idle(f, 6), 'F', [40, -140], env(f, at('039'), 9999, 8, 1))} />
		</Outdoor>
	);
};
/* 040–042: evening growth in the yard: 5,9 → 12 → 16 */
export const EveningYard: React.FC<{hk: [number, number][]; sunY: (f: number) => number; friend?: boolean; tod?: Tod; camKeys: [number, number, number, number][]; id: string; children?: React.ReactNode}> = ({hk, sunY, friend = true, tod = 'sunset', camKeys, id, children}) => {
	const {f, gf} = useShot();
	const P = 40, GY = 1000;
	const h = hAt(f, hk);
	const k = h / 1.6;
	return (
		<Outdoor tod={tod} id={id} cam={camK(f, camKeys)} sun={[1750, sunY(f)]} sunR={70}>
			<Yard tod={tod} ppm={P} gy={GY} bx={100} />
			<Giant x={1100} gy={GY} ppm={P} h={h} hk={hk} f={f} uid={'g' + id} shadow={{dir: -1, k: Math.min(10, k), o: 0.28}} look={[0.6, -0.2]} />
			{friend ? <Person who="friend" x={1480} gy={GY} ppm={P} facing={-1} uid={'m' + id} look={[-0.2, -1]} pose={gesture('handsOnHead', idle(f, 6), 0.5, f)} /> : null}
			{children}
		</Outdoor>
	);
};
const S19: React.FC = () => {
	const {at} = useShot();
	return <EveningYard id="s19" hk={[[0, 5.9], [at('040') + 120, 12], [at('041') + 20, 16]]} sunY={(f) => 640 + f * 0.6} camKeys={[[0, 1100, 760, 1.1], [at('041'), 1050, 560, 0.85], [at('042'), 1450, 880, 1.6]]} />;
};
const S20: React.FC = () => <Rule n="3" text="Самое большое — в 10 раз: 16 метров" />;
/* 044–046: sunset shrink; bench with Мирон and juice */
const S21: React.FC = () => {
	const {f, at} = useShot();
	return (
		<EveningYard id="s21" tod={f > 70 ? 'dusk' : 'sunset'} hk={[[0, 16], [40, 16], [80, 1.6]]} sunY={(ff) => 900 + ff * 2} friend={false} camKeys={[[0, 1050, 560, 0.85], [80, 1150, 900, 1.6], [at('045'), 1200, 880, 2.0]]}>
			<Person who="friend" x={1240} gy={1000} ppm={40} facing={-1} uid="m21" handItem={<rect x={-6} y={0} width={12} height={20} fill="#f2a23a" />} />
		</EveningYard>
	);
};

/* ------------------------------ part 4: night ------------------------------ */
/* 047–049: flashlight, street lamp, desk lamp — badge stays 1,60 */
const S22: React.FC = () => {
	const {f, at} = useShot();
	const P = 150, GY = 980;
	const third = f < at('048') ? 0 : f < at('048') + 40 ? 1 : f < at('048') + 80 ? 2 : 3;
	const cam = third === 2 ? camOn(1200, 500, 1.2) : camOn(900, 700, 1.15);
	return (
		<Outdoor tod="dusk" id="s22" cam={cam}>
			<Ground gy={GY} tod="dusk" />
			<StreetLamp x={1150} gy={GY} ppm={P * 0.6} on />
			{third === 3 ? (
				<g>
					<rect x={1300} y={GY - 120} width={200} height={120} fill="#7a5a3a" />
					<path d="M1380,860 L1420,780 L1460,780" stroke="#333" strokeWidth={6} fill="none" />
					<path d="M1440,770 L1500,770 L1480,740 L1460,740 Z" fill="#3b7dd8" />
					<path d="M1440,770 L1180,980 L1300,980 Z" fill="#ffe9a8" opacity={0.25} />
				</g>
			) : null}
			<Actor who="hero" x={760} floor={GY} s={sOf(1.6, P)} uid="h22" look={[0.2, 0.9]} />
			<HBadge x={760} y={GY - 1.6 * P - 20} h={1.6} s={0.8} />
			<Person who="friend" x={1020} gy={GY} ppm={P} facing={-1} uid="m22" pose={reach({...idle(f, 6), lean: 20}, 'F', [70, -40], 0.9)} handItem={<Phone x={0} y={14} s={1} torch />} />
			<path d="M985,820 L760,990 L840,990 Z" fill="#fffbe0" opacity={0.3} />
		</Outdoor>
	);
};
const S23: React.FC = () => (
	<Rule
		n="4"
		text="Только солнце. Лампы не считаются"
		icon={
			<g transform="translate(0,-40) scale(1.3)">
				<g transform="translate(-320,0)">
					<circle r={26} fill="#ffe9a8" />
					{[-60, -30, 0, 30, 60].map((a) => (
						<line key={a} x1={0} y1={0} x2={Math.sin((a * Math.PI) / 180) * 160} y2={Math.cos((a * Math.PI) / 180) * 160} stroke="#ffe9a8" strokeWidth={5} />
					))}
					<Big x={0} y={-50} text="лампа" size={40} hand c="#fff" />
				</g>
				<g transform="translate(220,-60)">
					<circle cx={-80} cy={-40} r={32} fill="#ffcc33" />
					{[0, 1, 2, 3, 4].map((i) => (
						<line key={i} x1={-40 + i * 40} y1={-40} x2={60 + i * 40} y2={160} stroke="#ffcc33" strokeWidth={5} />
					))}
					<Big x={40} y={-90} text="солнце" size={40} hand c="#fff" />
				</g>
			</g>
		}
	/>
);
/* 051–052: June nights in Moscow — twilight; sun 10,5° below the horizon at midnight */
const S24: React.FC = () => {
	const {f, at} = useShot();
	const k = interpolate(f, [at('052'), at('052') + 30], [0, 1], clamp);
	return (
		<Card title="В ИЮНЕ ВМЕСТО НОЧИ — СУМЕРКИ" cite="Расчёт: Москва, полночь 18→19 июня 2027 — Солнце −10,5°; ночь (−18°) не наступает">
			<rect x={260} y={240} width={1400} height={520} rx={20} fill="#2a3a78" />
			<rect x={260} y={560} width={1400} height={200} fill="#4a5aa0" />
			<rect x={260} y={600} width={1400} height={160} rx={0} fill="#1b2450" />
			<Big x={960} y={330} text="00:00, МОСКВА" size={48} c="#fff" />
			<g opacity={k}>
				<line x1={260} y1={600} x2={1660} y2={600} stroke="#fff" strokeWidth={4} />
				<line x1={600} y1={600} x2={1200} y2={712} stroke="#ffc94a" strokeWidth={4} strokeDasharray="12 8" />
				<circle cx={1240} cy={720} r={30} fill="#ffcc33" />
				<Big x={1240} y={860} text="солнце −10,5°" size={50} c="#ffc94a" />
				<Big x={600} y={860} text="тени нет → ×1" size={50} c="#9ff0b0" />
			</g>
		</Card>
	);
};
/* 053: bed, curtains shut — relief */
const S25: React.FC = () => {
	const {f, gf} = useShot();
	return (
		<Stage cam={usePush(camOn(960, 600, 1.1), camOn(880, 640, 1.35))} bg="#1d2550" light={{night: true, o: 0.35}}>
			<Layer depth={1}>
				<Bedroom night f={gf} alarm={false} />
				<Svg>
					<Actor who="hero" x={900} floor={900} seat={790} s={1} pose={{...SIT, lean: -14, head: -16}} uid="h25" expr="sleepy" mouth="smile" />
					<Chair x={900} y={800} />
				</Svg>
			</Layer>
		</Stage>
	);
};
/* 054: dinner at the table, dusk outside */
const S26: React.FC = () => {
	const {f} = useShot();
	return (
		<Stage cam={usePush(camOn(820, 600, 1.15), camOn(900, 580, 1.3))} bg="#2a2a48" light={{night: true, o: 0.25}}>
			<Layer depth={1}>
				<Kitchen night />
				<Svg>
					<Chair x={700} y={800} />
					<Actor who="hero" x={700} floor={900} seat={790} s={1} pose={reach(SIT, 'F', [90, -60], 0.6 + 0.4 * Math.sin(f / 9) ** 2)} uid="h26" mouth="smile" />
					<KitchenTable night mugs={1} />
					<Plate x={820} y={700} s={1.3} />
					<Actor who="dad" x={1150} floor={900} s={1.08} facing={-1} pose={reach(idle(f, 3), 'F', [80, -60], env(f, 30, 80, 10, 10))} uid="d26" handItem={<Plate x={0} y={10} s={0.8} />} />
				</Svg>
			</Layer>
		</Stage>
	);
};
/* 055–058: Ася's room, encyclopedia, flashlight on a ball */
const S27: React.FC = () => {
	const {f, at, gf} = useShot();
	const sp = useSpeaking(gf);
	const torch = f >= at('057');
	const wide = usePush(camOn(960, 600, 1), camOn(900, 620, 1.2));
	const cam = sp === 'SIS' ? camOn(760, 640, 1.6) : sp === 'HERO' ? camOn(1250, 560, 1.6) : wide;
	return (
		<Stage cam={cam} bg="#1d2550" light={{night: true, o: 0.4, x: 35, y: 60}}>
			<Layer depth={1}>
				<Svg>
					<rect x={-800} y={-400} width={3600} height={1300} fill="#2a3366" />
					{Array.from({length: 24}).map((_, i) => (
						<path key={i} d="M0,-8 L2,-2 L8,0 L2,2 L0,8 L-2,2 L-8,0 L-2,-2 Z" transform={`translate(${(i * 263) % 1800 + 60},${(i * 137) % 500 + 80})`} fill="#ffe98a" opacity={0.6} />
					))}
					<rect x={-800} y={900} width={3600} height={500} fill="#3a3046" />
					<rect x={380} y={780} width={600} height={50} rx={12} fill="#e9a3c8" />
					<rect x={380} y={830} width={600} height={70} fill="#7a5a3a" />
					<Actor who="sis" x={700} floor={900} seat={760} s={0.72} pose={reach(SIT, 'F', [90, -50], 0.8)} uid="s27" look={[0.5, 0.4]} handItem={torch ? <Phone x={0} y={10} s={0.8} torch /> : undefined} />
					<Encyclopedia x={830} y={800} s={1.1} open={f > at('056')} />
					{torch ? (
						<g>
							<path d="M760,760 L1000,700 L1000,820 Z" fill="#fffbe0" opacity={0.25} />
							<circle cx={1030} cy={760} r={40} fill="#e8eef6" />
							<path d="M1030,720 A40,40 0 0 1 1030,800 Z" fill="#fff" />
						</g>
					) : null}
					<Actor who="hero" x={1250} floor={900} s={1} facing={-1} pose={gesture('armsCrossed', idle(f, 2), 0.8, f)} uid="h27" expr="sleepy" />
				</Svg>
			</Layer>
		</Stage>
	);
};
/* 059–061: the fridge calendar, 18th circled; Ася points */
const S28: React.FC = () => {
	const {f, at, gf} = useShot();
	const sp = useSpeaking(gf);
	const cam = sp === 'SIS' ? camOn(760, 600, 1.5) : sp === 'HERO' ? camOn(1150, 560, 1.6) : camK(f, [[0, 300, 420, 2.4], [60, 320, 440, 2.0], [at('060'), 700, 600, 1.2]]);
	return (
		<Stage cam={cam} bg="#2a2a48" light={{night: true, o: 0.25}}>
			<Layer depth={1}>
				<Kitchen night />
				<Svg>
					<Fridge x={300} />
					<Calendar x={300} y={520} s={1.1} circles={Math.min(3, Math.floor(interpolate(f, [10, 50], [0, 3.99], clamp)))} />
					<Actor who="sis" x={560} floor={900} s={0.75} facing={-1} pose={reach(idle(f, 5), 'F', toLocal(330, 480, 560, 900 - 157 * 0.75 * 0.8, 0.75, -1), env(f, at('060'), at('061'), 8, 8))} uid="s28" />
					<Actor who="hero" x={1150} floor={900} s={1} facing={-1} pose={idle(f, 2)} uid="h28" look={[-0.6, 0]} />
				</Svg>
			</Layer>
		</Stage>
	);
};

export const P1 = {S01, S02, S03, S04, S05, S06, S07, S08, S09, S10, S11, S12, S13, S14, S15, S16, S17, S18, S19, S20, S21, S22, S23, S24, S25, S26, S27, S28, LiftShot};
void walk;
void LEGK;
