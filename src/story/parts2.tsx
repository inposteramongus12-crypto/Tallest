import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {toLocal} from '../engine/Stickman';
import {Actor, useShot, useSpeaking} from '../kit/core';
import {Layer, Stage, Svg, camOn, clamp, ease, usePush} from '../kit/kit';
import {env, gesture, idle, reach, run, walkTo, SIT} from '../kit/actions';
import {Kitchen, KitchenTable, Shop, Counter} from '../kit/sets';
import {Chair} from '../engine/props';
import {PhoneChat} from '../kit/ui';
import {Wheel, Bench, Block, Ground, Goal, Garages, HBadge, Poplar, RoomWin, SkyBox, CastShadow, Fridge, kitchenWin, sOf, Sign} from './places';
import {Cake, Calendar, Dog, Kite, Notebook, Phone, Pie, Plate} from './props';
import {Big, Card, Giant, Outdoor, Person, camK} from './sceneKit';
import {hAt, hot} from './common';
import {EveningYard, Yard, heroHip, P1} from './parts1';

/* ------------------------------ part 5: the gain ------------------------------ */
/* 062–063: overcast day — ice cream and scooter, badge 1,60 */
const S29: React.FC = () => {
	const {f, at} = useShot();
	const P = 70, GY = 1000;
	const scoot = f >= at('063') + 40;
	const x = scoot ? interpolate(f, [at('063') + 40, at('063') + 160], [500, 1500], clamp) : 760;
	return (
		<Outdoor tod="overcast" id="s29" cam={camK(f, [[0, 900, 640, 1.0], [at('063'), 820, 760, 1.4], [at('063') + 60, 1100, 760, 1.25]])}>
			<Yard tod="overcast" ppm={P} gy={GY} bx={-200} garages={false} />
			{scoot ? (
				<g>
					<rect x={x - 50} y={GY - 14} width={100} height={8} fill="#3b7dd8" />
					<rect x={x + 40} y={GY - 110} width={8} height={100} fill="#3b7dd8" />
					<circle cx={x - 44} cy={GY - 4} r={10} fill="#222" />
					<circle cx={x + 44} cy={GY - 4} r={10} fill="#222" />
				</g>
			) : null}
			<Giant x={x} gy={scoot ? GY - 16 : GY} ppm={P} h={1.6} uid="h29" vx={scoot ? 8 : 0} pose={scoot ? {...idle(f, 2), lean: 8} : reach(idle(f, 2), 'F', [40, -150], 0.8)} handItem={!scoot ? <g><path d="M-8,0 L8,0 L0,26 Z" fill="#d9a35a" /><circle cx={0} cy={-4} r={11} fill="#f6c6d8" /></g> : undefined} mouth="smile" badge={0.8} />
		</Outdoor>
	);
};
/* 064–065: business plan poster */
const S30: React.FC = () => {
	const {f, at} = useShot();
	const items = ['снять воздушного змея — 100 ₽', 'мяч с крыши — 50 ₽', 'кошка с дерева — бесплатно'];
	return (
		<Card title="«ВЕЛИКАН НА ЗАКАТЕ»" tint="#2a1f40">
			<rect x={420} y={230} width={1080} height={700} rx={24} fill="#fbf7ec" transform="rotate(-1.5 960 580)" />
			<Big x={960} y={330} text="УСЛУГИ ПОСЛЕ 18:00" size={56} c="#e8524a" t={f} />
			{items.map((t, i) => (
				<Big key={i} x={960} y={470 + i * 120} text={t} size={52} hand c="#1b1f2e" t={f - at('065') - 20 - i * 18} />
			))}
			<g transform="translate(1520,900) rotate(-12)">
				<circle r={80} fill="none" stroke="#e8524a" strokeWidth={8} />
				<Big x={0} y={16} text="МИРОН" size={34} c="#e8524a" />
			</g>
		</Card>
	);
};
/* 066: 07:00, 3,74 m — the kite from the poplar */
const S31: React.FC = () => {
	const {f} = useShot();
	const P = 80, GY = 1000;
	const tx = 1100, ty = GY - 5.6 * P;
	const k = env(f, 20, 9999, 20, 1);
	const s = sOf(3.74, P);
	const pose = reach(idle(f, 2), 'F', toLocal(tx, ty, 900, heroHip(GY, s), s, 1), k);
	const got = f > 60;
	return (
		<Outdoor tod="morning" id="s31" cam={usePush(camOn(960, 640, 1.0), camOn(1000, 560, 1.25))} sun={[200, 380]}>
			<Ground gy={GY} tod="morning" />
			<Poplar x={1150} gy={GY} ppm={P} h={9} tod="morning" />
			{!got ? <Kite x={tx} y={ty} s={0.5} rot={30} /> : null}
			<Giant x={900} gy={GY} ppm={P} h={3.74} uid="h31" pose={pose} shadow={{dir: 1, k: 2.3, o: 0.25}} handItem={got ? <Kite x={0} y={30} s={0.35} rot={-10} /> : undefined} look={[0.6, -0.8]} />
			<Person who="kid" x={1350} gy={GY} ppm={P} h={1.2} facing={-1} uid="k31" pose={gesture('handsOnHead', idle(f, 9), got ? 0 : 0.8, f)} mouth={got ? 'smile' : 'open'} />
		</Outdoor>
	);
};
/* 067–069: 18:00 football, 3,78 m in goal; 12:0 */
const S32: React.FC = () => {
	const {f, at, gf} = useShot();
	const sp = useSpeaking(gf);
	const P = 70, GY = 1000;
	const sit = f >= at('068');
	const ball = (f % 50) / 50;
	const bx = interpolate(ball, [0, 1], [1700, 760]);
	const by = GY - 30 - Math.sin(ball * Math.PI) * 160;
	const cam = sp === 'FRIEND' ? camOn(400, 760, 1.6) : camK(f, [[0, 1000, 640, 0.95], [at('068'), 820, 760, 1.25]]);
	const s = sOf(3.78, P);
	return (
		<Outdoor tod="evening" id="s32" cam={cam} sun={[1800, 300]}>
			<Ground gy={GY} tod="evening" />
			<Block x={-600} gy={GY - 2} ppm={40} tod="evening" kitchen={false} />
			<Goal x={640} gy={GY} ppm={P} />
			{sit ? (
				<Actor who="hero" x={760} floor={GY} seat={GY - 0.55 * P * (3.78 / 1.6)} s={s} pose={SIT} uid="h32" mouth="smile" />
			) : (
				<Giant x={760} gy={GY} ppm={P} h={3.78} uid="h32" pose={gesture('stop', idle(f, 2), 0.8, f)} shadow={{dir: -1, k: 2.3, o: 0.25}} badge={0.8} />
			)}
			{sit ? <HBadge x={760} y={GY - 3.78 * P * 0.62 - 20} h={3.78} s={0.8} /> : null}
			<circle cx={bx} cy={by} r={14} fill="#fff" stroke="#222" strokeWidth={3} />
			<Person who="rival1" x={1500} gy={GY} ppm={P} h={1.75} facing={-1} uid="r1" pose={gesture('handsOnHead', idle(f, 3), 0.7, f)} expr="wide" />
			<Person who="rival2" x={1700} gy={GY} ppm={P} h={1.78} facing={-1} uid="r2" pose={run(f / 4)} />
			<Person who="friend" x={400} gy={GY} ppm={P} facing={1} uid="m32" pose={gesture('wave', idle(f, 6), env(f, at('069'), 9999, 6, 1), f)} />
			<Big x={380} y={GY + 60} text={f >= at('069') ? '12 : 0' : '11 : 0'} size={60} hand c="#fff" />
		</Outdoor>
	);
};
/* 070: rematch after sunset — 1,60, the ball flies over; 12:3 */
const S33: React.FC = () => {
	const {f} = useShot();
	const P = 70, GY = 1000;
	const ball = (f % 40) / 40;
	return (
		<Outdoor tod="dusk" id="s33" cam={usePush(camOn(900, 760, 1.2), camOn(820, 760, 1.4))}>
			<Ground gy={GY} tod="dusk" />
			<Goal x={640} gy={GY} ppm={P} />
			<Giant x={760} gy={GY} ppm={P} h={1.6} uid="h33" pose={{...idle(f, 2), armF: [150, 10], armB: [-150, 10]}} badge={0.8} expr="worried" />
			<circle cx={interpolate(ball, [0, 1], [1500, 700])} cy={GY - 80 - Math.sin(ball * Math.PI) * 120} r={14} fill="#fff" stroke="#222" strokeWidth={3} />
			<Big x={380} y={GY + 60} text="12 : 3" size={60} hand c="#ff6a5a" />
		</Outdoor>
	);
};
/* 071: chat — the dog is lost */
const S34: React.FC = () => {
	const {f} = useShot();
	return (
		<Stage cam={usePush(camOn(960, 560, 1), camOn(960, 540, 1.08))} bg="#4f86d6" light={false}>
			<Layer depth={2}>
				<Svg>
					<SkyBox tod="evening" id="s34" />
				</Svg>
			</Layer>
			<AbsoluteFill>
				<svg width={1920} height={1080}><PhoneChat t={f} title="Чат дома 12" msgs={[{at: 6, from: 'Соседка', text: 'ПОМОГИТЕ! Бублик убежал утром 🐶'}, {at: 40, from: 'Соседка', text: 'Рыжий, с синим бантом'}]} /></svg>
			</AbsoluteFill>
			<AbsoluteFill>
				<svg width={1920} height={1080}>
					<Dog x={1450} y={620} s={2.2} facing={-1} />
				</svg>
			</AbsoluteFill>
		</Stage>
	);
};
/* 072, 074: 20:00, 12,7 m, scanning the district; the dog by the garages behind the school */
const S35: React.FC = () => {
	const {f, at} = useShot();
	const P = 32, GY = 1000;
	const look = gesture('point', {...idle(f, 2), armF: [150, 40]}, f >= at('074') ? 1 : 0, f);
	return (
		<Outdoor tod="sunset" id="s35" cam={camK(f, [[0, 900, 620, 0.95], [at('074'), 1400, 900, 1.6]])} sun={[1850, 820]} sunR={60} far={<><Block x={-500} gy={GY} ppm={P} tod="sunset" kitchen={false} /><Garages x={1250} gy={GY} ppm={P} n={5} tod="sunset" /></>}>
			<Ground gy={GY} tod="sunset" />
			<Giant x={760} gy={GY} ppm={P} h={12.7} uid="h35" pose={look} shadow={{dir: -1, k: 8, o: 0.25}} look={[0.9, 0.2]} />
			<Dog x={1420} y={GY} s={0.3} wag={Math.sin(f / 3)} />
		</Outdoor>
	);
};
/* 073: horizon card */
const S36: React.FC = () => {
	const {f} = useShot();
	const r = interpolate(f, [10, 60], [0, 1], {...clamp, easing: ease});
	return (
		<Card title="ДАЛЬНОСТЬ ГОРИЗОНТА" cite="Геометрия: d ≈ 3,57 × √h км (h — высота глаз в метрах, без рефракции)">
			<Big x={960} y={330} text="d ≈ 3,57 × √h км" size={72} c="#fff" t={f} />
			<g transform="translate(960,700)">
				<circle r={60 + 300 * r} fill="#3b7dd8" opacity={0.25} stroke="#9fd3ff" strokeWidth={4} />
				<circle r={60} fill="#3b7dd8" opacity={0.5} />
				<Big x={0} y={10} text="1,6 м → 4,5 км" size={30} c="#fff" />
				<Big x={0} y={-260 * r - 20} text="12,7 м → ≈ 12,7 км" size={48} c="#ffc94a" t={f - 40} />
			</g>
		</Card>
	);
};
/* 075: neighbour's pie, eaten with two fingers */
const S37: React.FC = () => {
	const {f} = useShot();
	const P = 60, GY = 1000;
	const s = sOf(12, P);
	const k = env(f, 10, 9999, 20, 1);
	const pose = reach({...idle(f, 2), lean: 30}, 'F', toLocal(1250, GY - 120, 900, heroHip(GY, s), s, 1), k * (f < 70 ? 1 : 0));
	return (
		<Outdoor tod="sunset" id="s37" cam={camK(f, [[0, 1150, 880, 1.7], [70, 1050, 520, 1.0]])} sun={[1850, 820]}>
			<Ground gy={GY} tod="sunset" />
			<Giant x={900} gy={GY} ppm={P} h={12} uid="h37" pose={f < 70 ? pose : reach(idle(f, 2), 'F', [30, -330], 1)} handItem={f >= 70 && f < 110 ? <Pie x={0} y={6} s={0.35} /> : undefined} mouth={f > 100 ? 'smile' : 'line'} badge={0.8} />
			<Person who="neighbor" x={1300} gy={GY} ppm={P} facing={-1} uid="n37" pose={reach(idle(f, 4), 'F', [70, -100], 0.9)} handItem={f < 70 ? <Pie x={0} y={6} s={0.5} /> : undefined} />
			<Dog x={1400} y={GY} s={0.35} facing={-1} wag={Math.sin(f / 3)} />
		</Outdoor>
	);
};
/* 076–079: Ася on the palm at sunset, 16 m; the wheel far away; lowering */
const S38: React.FC = () => {
	const {f, at, gf} = useShot();
	const sp = useSpeaking(gf);
	const P = 34, GY = 1000;
	const hx = 800;
	const s = sOf(16, P);
	const up = interpolate(f, [10, 70], [0, 1], {...clamp, easing: ease}) * (1 - interpolate(f, [at('079') + 20, at('079') + 110], [0, 1], {...clamp, easing: ease}));
	const palm: [number, number] = [hx + 120, interpolate(up, [0, 1], [GY - 30, GY - 13 * P])];
	const pose = reach(idle(f, 2), 'F', toLocal(palm[0], palm[1], hx, heroHip(GY, s), s, 1), 1);
	const cam = sp === 'SIS' ? camOn(palm[0], palm[1] - 40, 2.2) : sp === 'HERO' ? camOn(hx, GY - 15 * P, 1.6) : camK(f, [[0, 900, 700, 0.9], [at('077'), palm[0], palm[1], 1.8], [at('079'), 900, 640, 0.9]]);
	return (
		<Outdoor tod="sunset" id="s38" cam={cam} sun={[1800, 830]} sunR={70} far={<g><Block x={-600} gy={GY} ppm={P * 0.8} tod="sunset" kitchen={false} /><g opacity={0.75}><Wheel cx={1550} gy={GY} ppm={P * 0.8} rot={0} lights={0} tod="sunset" /></g></g>}>
			<Ground gy={GY} tod="sunset" />
			<Giant x={hx} gy={GY} ppm={P} h={16} uid="h38" pose={pose} shadow={{dir: -1, k: 10, o: 0.25}} look={[0.8, 0.4]} mouth="smile" />
			<Actor who="sis" x={palm[0]} floor={palm[1] - 8} s={sOf(1.3, P)} uid="s38" pose={gesture('point', idle(f, 5), sp === 'SIS' ? 1 : 0, f)} facing={1} />
		</Outdoor>
	);
};
/* 080–085: shop parking 14:00, the windshield glint lifts him for a second (1,19 → 4,1 → 1,19) */
const S39: React.FC = () => {
	const {f, at, gf} = useShot();
	const sp = useSpeaking(gf);
	const P = 110, GY = 980;
	const car = interpolate(f, [at('081'), at('081') + 50], [2600, 1350], {...clamp, easing: ease});
	const carOut = interpolate(f, [at('084') + 20, at('084') + 70], [0, 1600], clamp);
	const g0 = at('082') - 6;
	const hk: [number, number][] = [[0, 1.19], [g0, 1.19], [g0 + 10, 4.1], [g0 + 30, 4.1], [g0 + 40, 1.19]];
	const h = hAt(f, hk);
	const glint = env(f, at('081') + 40, g0 + 34, 4, 6);
	const coins = f > g0 + 10 && f < g0 + 60;
	const cam = sp === 'FRIEND' ? camOn(1000, 760, 1.5) : sp === 'HERO' ? camOn(700, 720, 1.6) : camK(f, [[0, 900, 640, 1.0], [g0, 760, 560, 0.95], [g0 + 50, 900, 700, 1.1]]);
	return (
		<Outdoor tod="noon" id="s39" cam={cam} sun={[300, -100]}>
			<Ground gy={GY} tod="noon" c="#8a8a88" />
			<rect x={-400} y={GY - 4.6 * P} width={1900} height={4.6 * P} fill="#e9e1d0" />
			<rect x={200} y={GY - 3 * P} width={1100} height={2.4 * P} fill="#9fd3ff" />
			<rect x={250} y={GY - 4.3 * P} width={1000} height={0.8 * P} rx={10} fill="#4fb35f" />
			<Big x={750} y={GY - 3.75 * P} text="ПРОДУКТЫ" size={64} c="#fff" />
			<g transform={`translate(${car + carOut},${GY})`}>
				<rect x={0} y={-1.3 * P} width={4.2 * P} height={0.9 * P} rx={30} fill="#3b7dd8" />
				<path d={`M${0.7 * P},${-1.3 * P} L${1.3 * P},${-2 * P} L${3 * P},${-2 * P} L${3.6 * P},${-1.3 * P} Z`} fill="#3b7dd8" />
				<path d={`M${0.85 * P},${-1.32 * P} L${1.35 * P},${-1.9 * P} L${2 * P},${-1.9 * P} L${2 * P},${-1.32 * P} Z`} fill="#cfe6ff" />
				<path d={`M${0.85 * P},${-1.32 * P} L${1.35 * P},${-1.9 * P} L${1.6 * P},${-1.9 * P} L${1.1 * P},${-1.32 * P} Z`} fill="#fff" opacity={0.3 + 0.7 * glint} />
				<circle cx={0.9 * P} cy={-0.3 * P} r={0.35 * P} fill="#222" />
				<circle cx={3.3 * P} cy={-0.3 * P} r={0.35 * P} fill="#222" />
			</g>
			{glint > 0.05 ? (
				<g opacity={glint}>
					<path d={`M${car + 1.2 * P},${GY - 1.6 * P} L700,${GY - 10} L780,${GY - 10} Z`} fill="#fffbe0" opacity={0.5} />
					<ellipse cx={740} cy={GY - 6} rx={60} ry={14} fill="#fffbe0" />
				</g>
			) : null}
			<Actor who="hero" x={740} floor={GY} s={sOf(h, P)} uid="h39" pose={idle(f, 2)} expr={h > 2 ? 'wide' : 'normal'} look={[0.4, 0.3]} />
			<HBadge x={740} y={GY - h * P - 20} h={h} s={0.8} hot={hot(f, hk)} />
			{coins ? Array.from({length: 6}).map((_, i) => <circle key={i} cx={720 + i * 14} cy={GY - 4 * P + (f - g0 - 10) * (8 + i)} r={9} fill="#f2c230" />) : null}
			<Person who="friend" x={1020} gy={GY} ppm={P} facing={-1} uid="m39" handItem={f < at('083') + 10 ? <Notebook x={0} y={30} s={0.5} open /> : undefined} expr={f > g0 ? 'wide' : 'normal'} />
			{f >= at('083') + 10 && f < at('085') + 30 ? <Notebook x={1080} y={GY} s={0.5} open rot={80} /> : null}
		</Outdoor>
	);
};

/* ------------------------------ part 6: the price ------------------------------ */
/* 086: double curtains, feet in a shoebox, alarm 03:44 */
const S40: React.FC = () => {
	const {f} = useShot();
	return (
		<Stage cam={usePush(camOn(960, 640, 1.05), camOn(700, 760, 1.5))} bg="#1d2550" light={{night: true, o: 0.35}}>
			<Layer depth={1}>
				<Svg>
					<rect x={-800} y={-400} width={3600} height={1300} fill="#2a3366" />
					<rect x={-800} y={900} width={3600} height={500} fill="#3a3046" />
					<RoomWin x={1300} w={380} tod="dawn" id="s40" curtains={1} />
					<rect x={1240} y={210} width={500} height={440} fill="#2a2f5a" />
					<rect x={200} y={780} width={600} height={50} rx={12} fill="#e9e4f5" />
					<rect x={200} y={830} width={600} height={70} fill="#7a5a3a" />
					<rect x={600} y={730} width={160} height={70} fill="#c98a3a" stroke="#6a4a22" strokeWidth={4} />
					<Big x={680} y={775} text="42" size={30} c="#3a2010" />
					<rect x={230} y={740} width={380} height={50} rx={24} fill="#5a7ad0" />
					<circle cx={260} cy={730} r={40} fill="#000" />
					<Big x={1500} y={160} text="03:44" size={56} c="#ff6a5a" t={f} />
				</Svg>
			</Layer>
		</Stage>
	);
};
/* 087: 7th floor neighbour sees a giant ear */
const S41: React.FC = () => {
	const {f} = useShot();
	const cup = interpolate(f, [30, 40], [0, 1], clamp);
	return (
		<Stage cam={usePush(camOn(960, 560, 1.1), camOn(1000, 540, 1.3))} bg="#e9dcc3" light={{x: 80, y: 30, o: 0.4}}>
			<Layer depth={1}>
				<Svg>
					<rect x={-800} y={-400} width={3600} height={1300} fill="#e2d4bc" />
					<rect x={-800} y={900} width={3600} height={500} fill="#8a6a50" />
					<RoomWin x={1100} w={520} tod="dawn" id="s41" />
					<g transform="translate(1360,420)">
						<ellipse rx={150} ry={210} fill="#0b0b0d" />
						<ellipse rx={80} ry={130} fill="#2a2a30" />
					</g>
					<rect x={1084} y={224} width={552} height={392} fill="none" stroke="#f4f1ea" strokeWidth={32} />
					<Actor who="neighborM" x={760} floor={900} s={1.08} facing={1} uid="n41" pose={reach(idle(f, 7), 'F', [60, -80 - 30 * cup], 1)} expr="wide" mouth="open" handItem={<rect x={-14} y={-6} width={28} height={30} rx={4} fill="#fff" />} />
				</Svg>
			</Layer>
		</Stage>
	);
};
/* 088–089: lift again, the neighbour presses «7» */
const S42: React.FC = () => <P1.LiftShot h={1.02} tip neighbor />;
/* 090: cashier asks for mum; granny offers a seat */
const S43: React.FC = () => {
	const {f, dur} = useShot();
	const half = f > dur / 2;
	return (
		<Stage cam={usePush(camOn(900, 600, 1.15), camOn(980, 600, 1.3))} bg="#f2efe6" light={{o: 0.3}}>
			<Layer depth={1}>
				{!half ? <Shop f={f} /> : null}
				<Svg>
					{!half ? (
						<>
							<Counter x={700} w={900} />
							<Actor who="cashier" x={1300} floor={900} s={1.02} facing={-1} uid="c43" pose={gesture('presentF', idle(f, 4), 0.6, f)} />
							<Actor who="hero" x={760} floor={900} s={0.66} uid="h43" expr="worried" />
						</>
					) : (
						<>
							<rect x={-400} y={-400} width={2800} height={1300} fill="#d8e2ee" />
							<rect x={-400} y={200} width={2800} height={260} fill="#9fd3ff" />
							<rect x={-400} y={900} width={2800} height={400} fill="#6a6f7a" />
							<rect x={950} y={700} width={260} height={30} fill="#3b7dd8" />
							<Actor who="granny" x={1150} floor={900} s={1} facing={-1} uid="g43" pose={gesture('presentF', idle(f, 8), 0.9, f)} mouth="smile" />
							<Actor who="hero" x={800} floor={900} s={0.66} uid="h43b" expr="worried" mouth="flat" />
						</>
					)}
					<HBadge x={half ? 800 : 760} y={900 - 0.66 * 371 - 20} h={1.06} s={0.75} />
				</Svg>
			</Layer>
		</Stage>
	);
};
/* 091–095: evening, 12,4 m; the door reaches his ankle; Ася at the window — cartoon ends at nine */
const S44: React.FC = () => {
	const {f, at, gf} = useShot();
	const sp = useSpeaking(gf);
	const P = 45, GY = 1000, BX = 200;
	const [wx, wy] = kitchenWin(BX, GY, P);
	const hx = wx + 150;
	const cam = sp === 'SIS' ? camOn(wx, wy, 2.4) : sp === 'HERO' ? camOn(hx - 20, wy - 10, 1.8) : camK(f, [[0, BX + 3.4 * P * 3.6, GY - 60, 1.9], [at('091') + 60, 700, 640, 1.0], [at('092'), wx + 60, wy, 1.7]]);
	const shut = f > at('095') + 30;
	return (
		<Outdoor tod="sunset" id="s44" cam={cam} sun={[1700, 820]} sunR={70}>
			<Yard tod="sunset" ppm={P} gy={GY} bx={BX} />
			<defs>
				<clipPath id="kw44">
					<rect x={wx - 38} y={wy - 31} width={76} height={62} />
				</clipPath>
			</defs>
			<g clipPath="url(#kw44)">
				<rect x={wx - 40} y={wy - 40} width={80} height={80} fill={shut ? '#8a8fb0' : '#ffe1a8'} />
				{!shut ? <Actor who="sis" x={wx - 10} floor={wy + 60} s={0.17} facing={1} uid="sis44" pose={reach(idle(f, 5), 'F', [60, -80], 0.7)} /> : null}
			</g>
			<Plate x={wx + 10} y={wy + 31} s={0.22} />
			<Giant x={hx} gy={GY} ppm={P} h={12.4} uid="h44" facing={-1} pose={{...idle(f, 2), lean: 6}} shadow={{dir: -1, k: 7.7, o: 0.25}} look={[-0.9, 0]} expr={shut ? 'sad' : 'normal'} />
		</Outdoor>
	);
};
/* 096–098: Мирон's chart — sun height by month; December 8,4 m */
const S45: React.FC = () => {
	const {f, at} = useShot();
	const pts = [[0, 12.5], [1, 21], [2, 31], [3, 43], [4, 52], [5, 57.5], [6, 55], [7, 47], [8, 36], [9, 24], [10, 15], [11, 10.8]];
	const draw = interpolate(f, [5, 70], [0, 1], clamp);
	const mon = ['Я', 'Ф', 'М', 'А', 'М', 'И', 'И', 'А', 'С', 'О', 'Н', 'Д'];
	return (
		<Card title="ВЫСОТА СОЛНЦА В ПОЛДЕНЬ, МОСКВА" cite="Расчёт по эфемеридам: 21 июня ≈ 57,5°, 21 декабря ≈ 10,8°">
			<g transform="translate(360,880)">
				<line x1={0} y1={0} x2={1200} y2={0} stroke="#fff" strokeWidth={3} />
				<line x1={0} y1={0} x2={0} y2={-620} stroke="#fff" strokeWidth={3} />
				<polyline points={pts.slice(0, Math.max(1, Math.ceil(draw * 12))).map(([m, a]) => `${m * 100 + 50},${-a * 10}`).join(' ')} fill="none" stroke="#ffc94a" strokeWidth={8} />
				{mon.map((m, i) => (
					<Big key={i} x={i * 100 + 50} y={46} text={m} size={30} c="#cfd6ee" />
				))}
				<Big x={550} y={-610} text="июнь 57°" size={40} c="#ffc94a" t={f - 30} />
				<Big x={1150} y={-150} text="декабрь 11°" size={40} c="#ff6a5a" t={f - 60} />
			</g>
			{f > at('097') ? (
				<g transform="translate(1500,460)">
					<rect x={-230} y={-60} width={460} height={110} rx={20} fill="#1b1f2e" stroke="#ff6a5a" strokeWidth={4} />
					<Big x={0} y={15} text="ДЕКАБРЬ, 12:30 — 8,4 М" size={40} c="#fff" t={f - at('097')} />
				</g>
			) : null}
		</Card>
	);
};
/* 099–100: at the bench, school windows worry; overcast relief */
const S46: React.FC = () => {
	const {f, at, gf} = useShot();
	const sp = useSpeaking(gf);
	const P = 150, GY = 980;
	const cam = sp === 'FRIEND' ? camOn(1180, 640, 1.6) : sp === 'HERO' ? camOn(760, 640, 1.6) : camOn(960, 700, 1.1);
	return (
		<Outdoor tod={f > at('100') + 20 ? 'overcast' : 'dusk'} id="s46" cam={cam}>
			<Ground gy={GY} tod="dusk" />
			<Bench x={960} gy={GY} ppm={P} />
			<Actor who="hero" x={760} floor={GY} s={sOf(1.6, P)} uid="h46" expr="worried" pose={gesture('rubChin', idle(f, 2), 0.7, f)} />
			<Person who="friend" x={1180} gy={GY} ppm={P} facing={-1} uid="m46" handItem={<Notebook x={0} y={30} s={0.5} open />} pose={gesture('shrug', idle(f, 6), sp === 'FRIEND' ? 0.6 : 0, f)} />
		</Outdoor>
	);
};
/* 101–102: sunrise/sunset table on the wall; cinema crossed out; the café on the 2nd floor */
const S47: React.FC = () => {
	const {f, at} = useShot();
	const rows = [['8.06', '03:47', '21:10'], ['14.06', '03:44', '21:15'], ['18.06', '03:43', '21:17']];
	const cross = interpolate(f, [at('102') + 10, at('102') + 30], [0, 1], clamp);
	return (
		<Card title="ВОСХОД И ЗАКАТ, МОСКВА" tint="#2a1f40" cite="Расчёт по эфемеридам для Москвы, июнь 2027">
			{rows.map((r, i) => (
				<g key={i}>
					<Big x={600} y={330 + i * 90} text={r[0]} size={48} c="#cfd6ee" t={f - i * 8} />
					<Big x={960} y={330 + i * 90} text={'↑ ' + r[1]} size={48} c="#ffc94a" t={f - i * 8} />
					<Big x={1320} y={330 + i * 90} text={'↓ ' + r[2]} size={48} c="#ff9a6a" t={f - i * 8} />
				</g>
			))}
			<g transform="translate(700,780)">
				<rect x={-200} y={-80} width={400} height={140} rx={16} fill="#fbf7ec" />
				<Big x={0} y={10} text="КИНО 20:30" size={44} c="#1b1f2e" />
				<line x1={-210} y1={-70} x2={210} y2={60} stroke="#e23b3b" strokeWidth={14 * cross} />
			</g>
			<g transform="translate(1250,780)">
				<rect x={-220} y={-80} width={440} height={140} rx={16} fill="#fbf7ec" />
				<Big x={0} y={10} text="ДР МИРОНА, 2 эт." size={40} c="#1b1f2e" />
				<line x1={-230} y1={-70} x2={230} y2={60} stroke="#e23b3b" strokeWidth={14 * interpolate(f, [at('102') + 50, at('102') + 70], [0, 1], clamp)} />
			</g>
		</Card>
	);
};
/* 103: Мирон brings out the cake */
const S48: React.FC = () => {
	const {f} = useShot();
	const P = 50, GY = 1000;
	return (
		<Outdoor tod="sunset" id="s48" cam={camK(f, [[0, 1250, 900, 1.8], [50, 1000, 600, 0.95]])} sun={[1850, 820]}>
			<Ground gy={GY} tod="sunset" />
			<Giant x={800} gy={GY} ppm={P} h={12.4} uid="h48" pose={{...idle(f, 2), lean: 14, head: 20}} look={[0.6, 0.9]} mouth="smile" badge={0.8} />
			<Person who="friend" x={1250} gy={GY} ppm={P} facing={-1} uid="m48" pose={reach(idle(f, 6), 'F', [70, -140], 1)} handItem={<Cake x={0} y={0} s={0.5} />} look={[-0.3, -1]} />
		</Outdoor>
	);
};
/* 104: alone on the waste ground at sunset, growing */
const S49: React.FC = () => {
	const {f} = useShot();
	return <EveningYard id="s49" hk={[[0, 6], [200, 12]]} sunY={(ff) => 700 + ff * 0.5} friend={false} camKeys={[[0, 1100, 900, 1.4], [200, 1000, 600, 0.9]]} />;
};

/* ------------------------------ part 7: the choice ------------------------------ */
/* 105–107: a million views; the blogger's message (bubble) */
const S50: React.FC = () => {
	const {f, at} = useShot();
	const views = Math.floor(interpolate(f, [0, 60], [12000, 1000000], {...clamp, easing: ease}));
	return (
		<Stage cam={usePush(camOn(960, 560, 1), camOn(960, 540, 1.06))} bg="#2a1f40" light={false}>
			<AbsoluteFill>
				<svg width={1920} height={1080}><PhoneChat t={f - at('106') + 10} title="Блогер ✔" msgs={[{at: 10, from: 'Блогер', text: 'Шоу «Великан на закате»!'}, {at: 40, from: 'Блогер', text: 'Пятница, 18-е, 20:30. Прямой эфир. Тысячи зрителей!'}]} /></svg>
			</AbsoluteFill>
			<AbsoluteFill>
				<svg width={1920} height={1080}>
					<Big x={420} y={300} text={views.toLocaleString('ru-RU') + ' 👁'} size={64} c="#ffc94a" t={f} />
					{f >= at('107') ? (
						<g transform="translate(1500,600)">
							<Calendar x={0} y={0} s={1.6} />
						</g>
					) : null}
				</svg>
			</AbsoluteFill>
		</Stage>
	);
};
/* 108–114: kitchen — Ася with the calendar, dad in the apron, the hero with the phone; door slams */
const S51: React.FC = () => {
	const {f, at, gf} = useShot();
	const sp = useSpeaking(gf);
	const slam = f >= at('113') + 30;
	const cam = sp === 'SIS' ? camOn(380, 640, 1.7) : sp === 'DAD' ? camOn(1350, 560, 1.6) : sp === 'HERO' ? camOn(860, 560, 1.6) : camOn(900, 600, 1.05);
	const type = env(f, at('114'), 99999, 8, 1);
	return (
		<Stage cam={cam} bg="#f3e6c4" light={{x: 70, y: 20, o: 0.4}}>
			<Layer depth={1}>
				<Kitchen />
				<Svg>
					<rect x={160} y={260} width={300} height={640} fill={slam ? '#7a5a3a' : '#5a3a26'} />
					{!slam ? <Actor who="sis" x={380} floor={900} s={0.75} facing={1} uid="s51" expr="sad" pose={reach(idle(f, 5), 'F', [60, -60], 1)} handItem={<Calendar x={0} y={60} s={0.45} />} /> : null}
					<Fridge x={1650} />
					{slam ? <Calendar x={1650} y={500} s={0.9} /> : null}
					<Actor who="hero" x={860} floor={900} s={1} facing={1} uid="h51" pose={reach(idle(f, 2), 'F', [60, -90], 1)} handItem={<Phone x={0} y={0} s={1.2} />} look={[0.3, 0.6]} expr={f > at('113') ? 'worried' : 'normal'} />
					<Actor who="dad" x={1350} floor={900} s={1.08} facing={-1} acc={['beard', 'apronOver']} uid="d51" pose={sp === 'DAD' ? gesture('presentF', idle(f, 3), 0.6, f) : reach(idle(f, 3), 'F', [70, -100], 0.8)} />
					{type > 0 ? <Big x={860} y={360} text="Да ✔" size={56} c="#3b7dd8" t={f - at('114')} /> : null}
				</Svg>
			</Layer>
		</Stage>
	);
};
/* 115–119: balcony at night, light twilight, tea with dad, the giant trousers drying */
const S52: React.FC = () => {
	const {f, gf} = useShot();
	const sp = useSpeaking(gf);
	const cam = sp === 'DAD' ? camOn(1180, 600, 1.6) : sp === 'HERO' ? camOn(760, 600, 1.6) : usePushSafe(f);
	return (
		<Stage cam={cam} bg="#1d2a5a" light={{night: true, o: 0.3}}>
			<Layer depth={3}>
				<Svg>
					<SkyBox tod="dusk" id="s52" />
					<Block x={-600} gy={1600} ppm={40} tod="dusk" kitchen={false} />
				</Svg>
			</Layer>
			<Layer depth={1}>
				<Svg>
					<rect x={-400} y={900} width={2800} height={400} fill="#3a3f4a" />
					<line x1={-200} y1={120} x2={2000} y2={120} stroke="#ccc" strokeWidth={3} />
					<path d="M200,120 L1400,120 L1350,640 L1050,640 L1000,300 L950,640 L600,640 Z" fill="#1f2a44" opacity={0.85} />
					<Chair x={760} y={800} />
					<Actor who="hero" x={760} floor={900} seat={790} s={1} facing={1} pose={reach(SIT, 'F', [80, -70], 0.8)} uid="h52" handItem={<rect x={-12} y={-10} width={24} height={26} rx={4} fill="#fff" />} />
					<Chair x={1180} y={800} facing={-1} />
					<Actor who="dad" x={1180} floor={900} seat={790} s={1.05} facing={-1} pose={reach(SIT, 'F', [80, -70], 0.8)} uid="d52" handItem={<rect x={-12} y={-10} width={24} height={26} rx={4} fill="#e8524a" />} />
					<rect x={-400} y={700} width={2800} height={14} fill="#c8d0dc" />
					{Array.from({length: 30}).map((_, i) => (
						<rect key={i} x={-400 + i * 100} y={700} width={8} height={200} fill="#c8d0dc" />
					))}
				</Svg>
			</Layer>
		</Stage>
	);
};
const usePushSafe = (f: number) => camOn(960 - f * 0.1, 600, 1.05 + f * 0.0004);

export const P2 = {S29, S30, S31, S32, S33, S34, S35, S36, S37, S38, S39, S40, S41, S42, S43, S44, S45, S46, S47, S48, S49, S50, S51, S52};
void walkTo;
void Garages;
void Sign;
void CastShadow;
void Kitchen;
void KitchenTable;
void Chair;
void Fridge;
void Bench;
void Yard;
