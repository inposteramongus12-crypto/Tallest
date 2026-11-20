import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Pose, toLocal} from '../engine/Stickman';
import {Actor, useShot, useSpeaking} from '../kit/core';
import {Layer, Stage, Svg, camOn, clamp, ease, usePush} from '../kit/kit';
import {CrowdRow} from '../kit/kit';
import {env, gesture, idle, reach, run, SIT} from '../kit/actions';
import {Kitchen} from '../kit/sets';
import {Ground, HBadge, ParkTrees, Parapet, River, SkyBox, Wheel, WHEEL, cabinPos, CastShadow, Fridge, sOf, Tod} from './places';
import {Calendar, Encyclopedia, Moon, Notebook, Phone} from './props';
import {Big, Card, Giant, Outdoor, Person, Title, camK} from './sceneKit';
import {hAt, hot} from './common';
import {heroHip} from './parts1';

/* ------------------------------ part 8: the night ------------------------------ */
/* 120–122: embankment show at sunset, 16 m, crowd with phones */
const S53: React.FC = () => {
	const {f, at} = useShot();
	const P = 34, GY = 1000;
	const hx = 900;
	const s = sOf(16, P);
	const kids = f >= at('122');
	const palm: [number, number] = [hx + 160, GY - 9 * P + Math.sin(f / 20) * 30];
	const pose: Pose = kids ? reach(idle(f, 2), 'F', toLocal(palm[0], palm[1], hx, heroHip(GY, s), s, 1), 1) : gesture('wave', idle(f, 2), 1, f);
	return (
		<Outdoor tod="sunset" id="s53" cam={camK(f, [[0, 960, 640, 0.9], [at('121'), 900, 500, 1.1], [at('122'), palm[0], palm[1], 1.6]])} sun={[1800, 860]} sunR={70} far={<River gy={GY - 50} tod="sunset" />}>
			<Parapet gy={GY} ppm={P} tod="sunset" />
			<Ground gy={GY} tod="sunset" c="#7a6a5a" />
			<Giant x={hx} gy={GY} ppm={P} h={16} uid="h53" pose={pose} shadow={{dir: -1, k: 10, o: 0.25}} mouth="smile" />
			{kids ? <Actor who="kid" x={palm[0]} floor={palm[1] - 6} s={sOf(1.2, P)} uid="k53" pose={gesture('wave', idle(f, 9), 1, f)} /> : null}
			<CrowdRow n={14} x0={200} x1={1800} floor={GY + 70} s={sOf(1.7, P) * 1.6} mode="stand" seed="cr53" t={f} />
			<Person who="blogger" x={1350} gy={GY + 70} ppm={P * 1.6} uid="b53" pose={reach(idle(f, 7), 'F', [60, -160], 1)} handItem={<Phone x={0} y={0} s={1.2} />} facing={-1} />
			<Big x={1350} y={GY - 120} text={f > at('121') ? '● LIVE 100 000' : '● LIVE'} size={38} c="#ff4a5a" />
		</Outdoor>
	);
};
/* 123–124: sunset — 16 → 1,60; the crowd leaves; the blogger walks off; fans, 23:10 */
const S54: React.FC = () => {
	const {f, at} = useShot();
	const P = 34, GY = 1000;
	const hk: [number, number][] = [[0, 16], [30, 16], [70, 1.6]];
	const h = hAt(f, hk);
	const tod: Tod = f > 60 ? 'dusk' : 'sunset';
	return (
		<Outdoor tod={tod} id="s54" cam={camK(f, [[0, 960, 600, 0.9], [70, 900, 900, 1.6], [at('124'), 900, 900, 2.0]])} sun={[1800, 900 + f * 2]} far={<River gy={GY - 50} tod={tod} />}>
			<Parapet gy={GY} ppm={P} tod={tod} />
			<Ground gy={GY} tod={tod} c="#6a5a4a" />
			<Giant x={900} gy={GY} ppm={P} h={h} hk={hk} f={f} uid="h54" look={[0.4, 0.4]} />
			{f < at('124') ? <CrowdRow n={10} x0={200} x1={1800} floor={GY + 70} s={sOf(1.7, P) * 1.6} mode="walk" dir={1} seed="cr54" t={f} /> : <CrowdRow n={5} x0={700} x1={1100} floor={GY + 40} s={sOf(1.7, P) * 1.3} mode="stand" seed="fans" t={f} />}
			{f >= at('124') ? <Big x={900} y={GY - 140} text="23:10" size={56} c="#ff6a5a" t={f - at('124') - 60} /> : null}
		</Outdoor>
	);
};

/* night park with the wheel; moon low on the left, the beach between the trees and the wheel */
const MOON: [number, number] = [-120, 860];
export const ParkNight: React.FC<{cam: ReturnType<typeof camOn>; rot: number; lights: number; id: string; children?: React.ReactNode; moonUp?: number; treesShade?: boolean}> = ({cam, rot, lights, id, children, moonUp = 0, treesShade = true}) => {
	const P = 30, GY = 1000;
	return (
		<Outdoor tod="night" id={id} cam={cam} far={<g><Moon x={MOON[0]} y={MOON[1] - moonUp} r={70} warm={1} /><River gy={GY - 60} tod="night" moonX={MOON[0]} /></g>}>
			<Ground gy={GY} tod="night" c="#2a2f3e" />
			<rect x={500} y={GY} width={1200} height={600} fill="#c9b48a" opacity={0.35} />
			<ParkTrees x0={-700} x1={420} gy={GY} ppm={P} tod="night" seed={'pt' + id} />
			{treesShade ? <path d={`M-700,${GY} L470,${GY} L1100,${GY + 120} L-700,${GY + 120} Z`} fill="#000" opacity={0.35} /> : null}
			<Wheel cx={1450} gy={GY} ppm={P} rot={rot} lights={lights} tod="night" />
			<rect x={1330} y={GY - 40} width={240} height={40} fill="#4a4a5a" />
			{children}
		</Outdoor>
	);
};
/* 125–127: Ася and dad on the wheel; 23:20 lights out; the top cabin */
const S55: React.FC = () => {
	const {f, at} = useShot();
	const out = interpolate(f, [at('126') + 10, at('126') + 40], [1, 0], clamp);
	const rot = interpolate(f, [0, at('126') + 30], [-40, 0], {...clamp, easing: ease});
	const [cx, cy] = cabinPos(1450, 1000, 30, rot, 0);
	const cam = camK(f, [[0, 1300, 640, 0.95], [at('127'), cx, cy + 40, 2.4]]);
	return (
		<ParkNight cam={cam} rot={rot} lights={out} id="s55">
			<Actor who="sis" x={cx - 8} floor={cy + 1.8 * 30} s={sOf(1.3, 30) * 0.9} uid="s55" pose={gesture('handsOnHead', idle(f, 5), 1 - out, f)} />
			<Actor who="dad" x={cx + 12} floor={cy + 1.8 * 30} s={sOf(1.8, 30) * 0.8} uid="d55" facing={-1} pose={reach(idle(f, 3), 'F', [-20, -80], 1 - out)} />
			{f >= at('126') && f < at('126') + 50 ? <Big x={960} y={260} text="23:20" size={60} c="#ff6a5a" /> : null}
		</ParkNight>
	);
};
/* 128–130: the hero at the fence (1,60); Мирон runs in with the phone torch — nothing */
const S56: React.FC = () => {
	const {f, at, gf} = useShot();
	const sp = useSpeaking(gf);
	const P = 120, GY = 1000;
	const run1 = interpolate(f, [at('129') - 20, at('129') + 10], [2200, 1180], clamp);
	const torch = f >= at('129') + 10 && f < at('130') + 50;
	const cam = sp === 'FRIEND' ? camOn(1150, 700, 1.4) : camK(f, [[0, 760, 700, 1.2], [at('130'), 860, 820, 1.5]]);
	return (
		<Outdoor tod="night" id="s56" cam={cam} far={<Moon x={-60} y={980} r={60} />}>
			<Ground gy={GY} tod="night" />
			<rect x={-600} y={GY - 1.1 * P} width={3000} height={6} fill="#6a6a7a" />
			{Array.from({length: 40}).map((_, i) => (
				<rect key={i} x={-600 + i * 80} y={GY - 1.1 * P} width={6} height={1.1 * P} fill="#6a6a7a" />
			))}
			<Actor who="hero" x={760} floor={GY} s={sOf(1.6, P)} uid="h56" look={[0.4, -1]} expr="worried" />
			<HBadge x={760} y={GY - 1.6 * P - 20} h={1.6} s={0.8} />
			<Person who="friend" x={run1} gy={GY} ppm={P} facing={-1} uid="m56" pose={f < at('129') + 10 ? run(f / 3) : reach({...idle(f, 6), lean: 18}, 'F', [70, -30], torch ? 1 : 0.2)} handItem={<Phone x={0} y={12} s={1} torch={torch} />} />
			{torch ? <path d={`M${run1 - 50},${GY - 120} L760,${GY + 6} L840,${GY + 6} Z`} fill="#fffbe0" opacity={0.28} /> : null}
		</Outdoor>
	);
};
/* 131–133: flashback — the windshield glint, then Ася with the book (sepia) */
const S57: React.FC = () => {
	const {f, at} = useShot();
	const second = f >= at('133');
	return (
		<Stage cam={usePush(camOn(960, 560, 1.05), camOn(960, 540, 1.2))} bg="#3a2a1a" light={false}>
			<AbsoluteFill style={{filter: 'sepia(0.8) contrast(1.05)'}}>
				<svg width={1920} height={1080}>
					<rect width={1920} height={1080} fill="#d9c7a8" />
					{!second ? (
						<g>
							<rect x={980} y={540} width={760} height={200} rx={50} fill="#3b7dd8" />
							<path d="M1100,540 L1200,420 L1500,420 L1600,540 Z" fill="#3b7dd8" />
							<path d="M1120,540 L1210,430 L1330,430 L1330,540 Z" fill="#fff" opacity={0.9} />
							<path d="M1240,480 L700,900 L840,900 Z" fill="#fffbe0" opacity={0.7} />
							<ellipse cx={770} cy={900} rx={110} ry={26} fill="#fffbe0" />
							<g transform="translate(770,900)">
								<ellipse cx={-30} cy={-14} rx={46} ry={18} fill="#f4f4f4" />
								<ellipse cx={40} cy={-14} rx={46} ry={18} fill="#f4f4f4" />
							</g>
							<Big x={500} y={300} text={f > at('132') ? 'ОТРАЖЁННОЕ СОЛНЦЕ' : '4,1 М ?!'} size={72} c="#3a2a1a" />
						</g>
					) : (
						<g>
							<Encyclopedia x={960} y={760} s={3} open />
							<Big x={960} y={300} text="«Луна — просто зеркало»" size={80} c="#3a2a1a" hand />
						</g>
					)}
				</svg>
			</AbsoluteFill>
		</Stage>
	);
};
/* 134: running along the embankment, the huge low moon over the river */
const S58: React.FC = () => {
	const {f} = useShot();
	const P = 110, GY = 1000;
	const x = 600 + f * 6;
	return (
		<Outdoor tod="night" id="s58" cam={camOn(x + 200, 760, 1.15)} far={<g><Moon x={x + 500} y={820} r={150} /><River gy={GY - 80} tod="night" moonX={x + 500} /></g>}>
			<Parapet gy={GY} ppm={P} tod="night" />
			<Ground gy={GY} tod="night" />
			<Actor who="hero" x={x} floor={GY} s={sOf(1.6, P)} uid="h58" pose={run(f / 3)} vx={10} />
			<Person who="friend" x={x - 300} gy={GY} ppm={P} uid="m58" pose={run(f / 3 + 1)} vx={10} />
		</Outdoor>
	);
};
/* 135: card — in June the full Moon stands opposite the Sun → low; tonight 5,5° */
const S59: React.FC = () => {
	const {f} = useShot();
	const k = interpolate(f, [10, 50], [0, 1], clamp);
	return (
		<Card title="ПОЛНАЯ ЛУНА В ИЮНЕ — НИЗКО" cite="Расчёт: Москва, 18.06.2027, 23:30 — Луна 5,5° над горизонтом (максимум 6,2° около 00:30)">
			<line x1={200} y1={700} x2={1720} y2={700} stroke="#fff" strokeWidth={4} />
			<Big x={360} y={760} text="СЕВЕР" size={36} c="#cfd6ee" />
			<Big x={1560} y={760} text="ЮГ" size={36} c="#cfd6ee" />
			<circle cx={420} cy={800} r={40} fill="#ffcc33" opacity={0.6} />
			<Big x={420} y={880} text="солнце под горизонтом" size={32} c="#ffc94a" />
			<g opacity={k}>
				<path d="M960,700 L1500,646" stroke="#fff" strokeWidth={3} strokeDasharray="12 8" />
				<Moon x={1520} y={640} r={44} />
				<path d="M1360,700 A140,140 0 0 0 1356,688" stroke="#ffc94a" strokeWidth={8} fill="none" />
				<Big x={1300} y={600} text="5,5°" size={64} c="#ffc94a" />
			</g>
		</Card>
	);
};
/* 136–139: sneakers in the trees' shadow; «где открыто?» — «пляж у колеса!» */
const S60: React.FC = () => {
	const {f, at, gf} = useShot();
	const sp = useSpeaking(gf);
	const P = 70, GY = 1000;
	const cam = sp === 'FRIEND' ? camOn(1150, 760, 1.5) : sp === 'HERO' ? camOn(800, 720, 1.5) : camK(f, [[0, 800, 940, 2.2], [at('137') + 40, 900, 760, 1.1]]);
	return (
		<ParkNight cam={cam} rot={0} lights={0} id="s60">
			<g transform={`translate(${-(70 / 30 - 1) * 0}, 0)`} />
			<Actor who="hero" x={800} floor={GY} s={sOf(1.6, 30) * 2.3} uid="h60" look={[-0.3, 0.9]} pose={gesture('rubChin', idle(f, 2), sp === 'HERO' ? 0.6 : 0, f)} expr="worried" />
			<HBadge x={800} y={GY - 1.6 * 30 * 2.3 - 20} h={1.6} s={0.8} />
			<Actor who="friend" x={1150} floor={GY} s={sOf(1.6, 30) * 2.3} facing={-1} uid="m60" pose={gesture('point', idle(f, 6), sp === 'FRIEND' ? 1 : 0, f)} />
			<path d="M0,1000 L1400,1000" stroke="#000" strokeWidth={0} />
			{void P}
		</ParkNight>
	);
};
/* 140: feet step out of the shadow onto the sand, into the moonlight (close) */
const S61: React.FC = () => {
	const {f} = useShot();
	const x = interpolate(f, [0, 50], [520, 900], {...clamp, easing: ease});
	return (
		<Stage cam={usePush(camOn(820, 860, 2.0), camOn(900, 880, 2.2))} bg="#0f1736" light={{night: true, o: 0.45, x: 10, y: 70}}>
			<Layer depth={1}>
				<Svg>
					<rect x={-400} y={-400} width={2800} height={1400} fill="#16224a" />
					<rect x={-400} y={900} width={2800} height={500} fill="#8a7a5a" />
					<rect x={-400} y={900} width={1100} height={500} fill="#000" opacity={0.55} />
					<ellipse cx={x - 30} cy={905} rx={60} ry={22} fill="#f4f4f4" />
					<ellipse cx={x + 60} cy={905} rx={60} ry={22} fill="#f4f4f4" />
					{x > 700 ? <rect x={700} y={880} width={600} height={60} fill="#cfe0ff" opacity={0.25} /> : null}
				</Svg>
			</Layer>
		</Stage>
	);
};
/* 141: card — moonlight ≈ 400 000 times fainter, but the shadow is sharp */
const S62: React.FC = () => (
	<Card title="СВЕТ ПОЛНОЙ ЛУНЫ" cite="Солнце ярче полной Луны примерно в 400 000 раз (≈ 398–449 тыс. по разным оценкам); альбедо Луны ≈ 0,12">
		<Moon x={600} y={540} r={120} warm={0} />
		<circle cx={1300} cy={540} r={180} fill="#ffcc33" />
		<Big x={960} y={560} text="×400 000" size={80} c="#ffc94a" />
		<Big x={960} y={880} text="слабее — но тень чёткая" size={56} c="#fff" hand />
	</Card>
);
/* 142–144: growth 1,60 → 16 m under the moon; his shadow over the wheel; «Отпускайте тормоз!» */
const HX = 860;
const S63: React.FC = () => {
	const {f, at} = useShot();
	const hk: [number, number][] = [[0, 1.6], [16, 1.6], [86, 16]];
	const h = hAt(f, hk);
	const k = interpolate(f, [16, 86], [0, 1], clamp);
	const cam = camK(f, [[0, HX, 900, 1.6], [90, 1000, 600, 0.85], [at('144'), 1450, 860, 1.6]]);
	return (
		<ParkNight cam={cam} rot={0} lights={0} id="s63" treesShade>
			<CastShadow fx={HX} gy={1000} len={h * 30 * 9.5} w={30} dir={1} o={0.35 * k} />
			<path d={`M${HX + 400},${1000 - h * 30 * 0.2} L${HX + 900},${1000 - h * 30 * 0.9} L${HX + 960},${1000 - h * 30 * 0.8} L${HX + 450},${1000} Z`} fill="#000" opacity={0.25 * k} />
			<Giant x={HX} gy={1000} ppm={30} h={h} hk={hk} f={f} uid="h63" look={[0.8, -0.4]} expr={k < 1 ? 'wide' : 'normal'} />
			<Person who="operator" x={1600} gy={1000} ppm={30} facing={-1} uid="o63" pose={reach(idle(f, 4), 'F', [60, -60], env(f, at('144') + 10, 9999, 6, 1))} />
		</ParkNight>
	);
};
/* the wheel turning by hand: shared pose (hands on the rim at its lower-left) */
const WheelWork: React.FC<{rot: number; h: number; hk?: [number, number][]; id: string; cam: ReturnType<typeof camOn>; slip?: number; children?: React.ReactNode}> = ({rot, h, hk, id, cam, slip = 0, children}) => {
	const {f} = useShot();
	const s = sOf(h, 30);
	const rim: [number, number] = [1450 - WHEEL.r * 30 * 0.92, 1000 - WHEEL.hub * 30 + 60];
	const k = interpolate(h, [2, 12], [0, 1], clamp);
	let pose = reach(idle(f, 2), 'F', toLocal(rim[0], rim[1], HX, heroHip(1000, s), s, 1), k);
	pose = reach(pose, 'B', toLocal(rim[0] - 10, rim[1] + 120, HX, heroHip(1000, s), s, 1), k);
	return (
		<ParkNight cam={cam} rot={rot} lights={0} id={id}>
			<CastShadow fx={HX} gy={1000} len={h * 30 * 9} w={30} dir={1} o={0.3} />
			<path d={`M${HX + 420 + slip * -300},${1000} L${HX + 520},${1000} L${HX - 60},${1000 + 30} L${HX - 140},${1000 + 30} Z`} fill="#000" opacity={0.5} />
			<Giant x={HX} gy={1000} ppm={30} h={h} hk={hk} f={f} uid={'h' + id} pose={pose} look={[0.9, -0.2]} />
			{children}
		</ParkNight>
	);
};
/* 145–147: cabins come down one by one; the operator counts */
const S64: React.FC = () => {
	const {f, at, dur} = useShot();
	const rot = interpolate(f, [0, dur], [0, -60], clamp);
	const n = Math.min(3, Math.floor(interpolate(f, [at('146'), at('146') + 120], [0, 3.99], clamp)));
	const cam = camK(f, [[0, 1150, 620, 0.9], [at('146'), 1500, 900, 1.5], [at('147'), HX + 80, 980, 2.2]]);
	return (
		<WheelWork rot={rot} h={16} id="s64" cam={cam}>
			<Person who="operator" x={1600} gy={1000} ppm={30} facing={-1} uid="o64" pose={gesture('point', idle(f, 4), 0.5, f)} />
			<Big x={1600} y={880} text={n > 0 ? String(n) : ''} size={44} c="#fff" />
			<Actor who="neighborM" x={1700} floor={1000} s={sOf(1.75, 30)} uid="p64" pose={idle(f, 9)} look={[-0.5, -1]} />
		</WheelWork>
	);
};
/* 148–151: the heel slides into the spoke's shadow — down to 1,60 — «влево!» — back up */
const S65: React.FC = () => {
	const {f, at, gf} = useShot();
	const sp = useSpeaking(gf);
	const t0 = at('149') - 10;
	const t1 = at('151') + 10;
	const hk: [number, number][] = [[0, 16], [t0, 16], [t0 + 70, 1.6], [t1, 1.6], [t1 + 70, 16]];
	const h = hAt(f, hk);
	const cam = sp === 'FRIEND' ? camOn(600, 940, 1.6) : camK(f, [[0, HX + 60, 980, 2.3], [t0 + 20, 1000, 600, 0.85], [t1 + 70, 1100, 620, 0.9]]);
	return (
		<WheelWork rot={-60 - f * 0.05} h={h} hk={hk} id="s65" cam={cam} slip={env(f, at('148') + 20, t1, 10, 10)}>
			<Person who="friend" x={560} gy={1000} ppm={30 * 1.4} facing={1} uid="m65" pose={gesture('point', idle(f, 6), sp === 'FRIEND' ? 1 : 0.3, f)} />
		</WheelWork>
	);
};
/* 152–154: midnight, the moon climbs to 6° — 16 → 15,0 → 14,6 */
const S66: React.FC = () => {
	const {f, at} = useShot();
	const hk: [number, number][] = [[0, 16], [at('152') + 40, 15.0], [at('154'), 15.0], [at('154') + 40, 14.6]];
	const h = hAt(f, hk);
	const rot = interpolate(f, [0, at('154') + 60], [-70, -88], clamp);
	return (
		<WheelWork rot={rot} h={h} hk={hk} id="s66" cam={camK(f, [[0, 1000, 620, 0.85], [at('153'), 640, 940, 1.6], [at('154'), 1100, 560, 1.0]])}>
			<Person who="friend" x={560} gy={1000} ppm={42} facing={1} uid="m66" pose={gesture('handsOnHead', idle(f, 6), 0.8, f)} />
			<Big x={300} y={300} text={f < at('154') ? '00:00' : '00:20'} size={56} c="#ff6a5a" />
		</WheelWork>
	);
};
/* 155–156: the giant eye at Ася's cabin window — the hook reversed */
const S67: React.FC = () => {
	const {f, at, gf} = useShot();
	const sp = useSpeaking(gf);
	return (
		<Stage cam={sp === 'SIS' ? camOn(800, 560, 1.4) : camOn(1000, 520, 1.15)} bg="#0f1736" light={{night: true, o: 0.4, x: 10, y: 60}}>
			<Layer depth={1}>
				<Svg>
					<rect x={-400} y={-400} width={2800} height={1500} fill="#16224a" />
					<rect x={300} y={160} width={900} height={760} rx={60} fill="#7a2a2a" />
					<rect x={360} y={230} width={780} height={420} rx={20} fill="#2a3560" />
					<Actor who="sis" x={620} floor={900} s={1.1} facing={1} uid="s67" pose={reach(idle(f, 5), 'F', [90, -150], env(f, at('156'), 9999, 8, 1))} expr={f > at('156') ? 'normal' : 'worried'} mouth={f > at('156') ? 'smile' : 'line'} />
					<Actor who="dad" x={900} floor={900} s={1.2} facing={-1} uid="d67" pose={idle(f, 3)} />
					<g transform="translate(1500,440)">
						<ellipse rx={260} ry={190} fill="#0b0b0d" />
						<ellipse rx={130} ry={150} fill="#fff" />
						<circle cx={-40} cy={10} r={60} fill="#000" />
					</g>
				</Svg>
			</Layer>
		</Stage>
	);
};
/* 157–158: the last cabin at the platform; rescuers arrive and take off a cap */
const S68: React.FC = () => {
	const {f, at} = useShot();
	const truck = interpolate(f, [at('158'), at('158') + 60], [2600, 1500], {...clamp, easing: ease});
	return (
		<WheelWork rot={interpolate(f, [0, 60], [-88, -180], {...clamp, easing: ease})} h={14.6} id="s68" cam={camK(f, [[0, 1400, 860, 1.4], [at('158'), 1250, 700, 0.95]])}>
			<Person who="dad" x={1520} gy={1000} ppm={30} facing={-1} uid="d68" pose={reach(idle(f, 3), 'F', [60, -70], 1)} />
			<Person who="sis" x={1500} gy={1000} ppm={30} h={1.3} facing={-1} uid="s68" />
			<g transform={`translate(${truck},1000)`}>
				<rect x={0} y={-110} width={300} height={90} rx={12} fill="#c9302c" />
				<rect x={20} y={-100} width={70} height={40} fill="#9fd3ff" />
				<circle cx={60} cy={-15} r={18} fill="#222" />
				<circle cx={240} cy={-15} r={18} fill="#222" />
				<circle cx={150} cy={-118} r={10} fill={f % 10 < 5 ? '#3b7dd8' : '#ff4a5a'} />
			</g>
			{f > at('158') + 60 ? <Person who="rescuer" x={truck - 60} gy={1000} ppm={30} facing={-1} uid="r68" pose={gesture('wave', idle(f, 8), 0.8, f)} /> : null}
		</WheelWork>
	);
};

/* ------------------------------ part 9: the finale ------------------------------ */
/* 159–165: on the sand — giant sitting, Ася on his palm, dad beside */
const S69: React.FC = () => {
	const {f, at, gf} = useShot();
	const sp = useSpeaking(gf);
	const P = 30, GY = 1000;
	const s = sOf(14.6, P);
	const seatY = GY - 0.3 * 14.6 * P;
	const palm: [number, number] = [HX + 170, GY - 160];
	const pose = reach(SIT, 'F', toLocal(palm[0], palm[1], HX, seatY, s, 1), 1);
	const cam = sp === 'DAD' ? camOn(HX + 300, GY - 60, 2.2) : sp === 'SIS' ? camOn(palm[0], palm[1] - 30, 2.4) : sp === 'HERO' ? camOn(HX + 40, GY - 360, 1.5) : camK(f, [[0, 1000, 700, 0.9], [60, 1050, 760, 1.1]]);
	return (
		<ParkNight cam={cam} rot={-180} lights={0} id="s69" treesShade={false}>
			<Actor who="hero" x={HX} floor={GY} seat={seatY} s={s} pose={pose} uid="h69" mouth={f > at('165') ? 'smile' : 'line'} look={[0.6, 0.5]} />
			<Actor who="sis" x={palm[0]} floor={palm[1] - 6} s={sOf(1.3, P)} uid="s69" pose={gesture('wave', idle(f, 5), env(f, at('162'), at('163'), 6, 8), f)} />
			<Person who="dad" x={HX + 300} gy={GY} ppm={P} facing={-1} uid="d69" look={[-0.3, -1]} pose={reach(idle(f, 3), 'F', [70, -40], env(f, at('164'), 9999, 10, 1))} />
		</ParkNight>
	);
};
/* 166: 03:00 the moon sets, the north-east brightens */
const S70: React.FC = () => {
	const {f} = useShot();
	const dawn = interpolate(f, [0, 120], [0, 1], clamp);
	return (
		<ParkNight cam={usePush(camOn(700, 700, 0.95), camOn(900, 680, 1.05))} rot={-180} lights={0} id="s70" moonUp={-f * 0.6} treesShade={false}>
			<rect x={1200} y={-400} width={1400} height={1400} fill="#ffb46a" opacity={0.25 * dawn} />
			<Actor who="hero" x={HX} floor={1000} seat={1000 - 0.3 * 14.6 * 30} s={sOf(14.6, 30)} pose={SIT} uid="h70" />
			<Big x={300} y={300} text="03:00" size={56} c="#ff6a5a" />
		</ParkNight>
	);
};
/* 167: December card */
const S71: React.FC = () => (
	<Card title="ДЕКАБРЬ: 8,4 М ВЕСЬ ДЕНЬ" cite="Расчёт: Москва, 21.12, 12:30 — Солнце 10,8° → ×5,24">
		<rect x={360} y={260} width={1200} height={600} rx={20} fill="#cfdcf0" />
		<rect x={360} y={760} width={1200} height={100} fill="#f4f8ff" />
		<circle cx={1400} cy={680} r={40} fill="#ffcc33" />
		<Actor who="hero" x={800} floor={780} s={1.25} uid="h71" pose={idle(0, 2)} expr="worried" />
		<Big x={800} y={240} text="8,4 М" size={64} c="#ffc94a" />
	</Card>
);
/* 168–169: sunrise, three shadows — one giant, two small; Мирон asleep, writing «правило пятое» */
const S72: React.FC = () => {
	const {f, at} = useShot();
	const P = 30, GY = 1000;
	return (
		<Outdoor tod="dawn" id="s72" cam={camK(f, [[0, 1000, 640, 0.9], [at('169'), 500, 940, 1.9]])} sun={[2000, 900]} sunR={60}>
			<Ground gy={GY} tod="dawn" c="#c9a87a" />
			<CastShadow fx={HX} gy={GY} len={1500} w={60} dir={-1} o={0.35} />
			<CastShadow fx={HX + 300} gy={GY} len={300} w={20} dir={-1} o={0.35} />
			<CastShadow fx={HX + 340} gy={GY} len={220} w={16} dir={-1} o={0.35} />
			<Giant x={HX} gy={GY} ppm={P} h={16} uid="h72" pose={reach(idle(f, 2), 'F', [40, -200], 0)} mouth="smile" look={[0.9, 0]} />
			<Person who="dad" x={HX + 300} gy={GY} ppm={P} facing={1} uid="d72" />
			<Person who="sis" x={HX + 340} gy={GY} ppm={P} h={1.3} facing={1} uid="s72" />
			<Actor who="friend" x={500} floor={GY} seat={GY - 20} s={sOf(1.6, P) * 2.2} pose={{...SIT, head: 24}} uid="m72" expr="sleepy" handItem={<Notebook x={0} y={20} s={0.6} open />} />
		</Outdoor>
	);
};
/* 170: the fridge calendar — every full moon circled; a drawn giant next to the moon */
const S73: React.FC = () => {
	const {f} = useShot();
	return (
		<Stage cam={usePush(camOn(400, 460, 2.0), camOn(420, 480, 2.3))} bg="#f3e6c4" light={{o: 0.3}}>
			<Layer depth={1}>
				<Kitchen />
				<Svg>
					<Fridge x={420} />
					<Calendar x={360} y={560} s={1} circles={3} />
					<Calendar x={520} y={560} s={0.6} circles={2} />
					<Calendar x={400} y={700} s={0.6} circles={2} />
					<g transform="translate(560,700)">
						<circle cx={0} cy={-60} r={20} fill="#ffe08a" />
						<line x1={-40} y1={0} x2={-40} y2={-70} stroke="#1b1f2e" strokeWidth={6} />
						<circle cx={-40} cy={-84} r={14} fill="#1b1f2e" />
					</g>
				</Svg>
			</Layer>
		</Stage>
	);
};
/* 171: the question to the viewer */
const S74: React.FC = () => {
	const {f} = useShot();
	return (
		<>
			<Outdoor tod="sunset" id="s74" cam={usePush(camOn(960, 600, 1), camOn(960, 560, 1.08))} sun={[960, 820]} sunR={90}>
				<Ground gy={1000} tod="sunset" />
				<CastShadow fx={960} gy={1000} len={1600} w={40} dir={-1} o={0.4} />
				<Giant x={960} gy={1000} ppm={30} h={16} uid="h74" badge={0} />
			</Outdoor>
			<Title lines={['А ТЫ В КАКОЕ ВРЕМЯ', 'СУТОК ХОТЕЛ БЫ ЖИТЬ?']} f={f} from={20} top={120} size={84} />
		</>
	);
};

export const P3 = {S53, S54, S55, S56, S57, S58, S59, S60, S61, S62, S63, S64, S65, S66, S67, S68, S69, S70, S71, S72, S73, S74};
void hot;
void Ground;
void Fridge;
void Phone;
void SkyBox;
