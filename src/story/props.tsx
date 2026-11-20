import React from 'react';

/* Story props. Each prop is drawn ONLY here, so it looks the same in every scene.
   (x, y) = bottom centre unless said otherwise; s = scale. */

// Мирон's notebook: orange cover, «ЗАМЕРЫ» on it, black elastic band
export const Notebook: React.FC<{x: number; y: number; s?: number; open?: boolean; rot?: number}> = ({x, y, s = 1, open, rot = 0}) => (
	<g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
		{open ? (
			<>
				<rect x={-46} y={-60} width={92} height={60} rx={4} fill="#fbf7ec" stroke="#3a3020" strokeWidth={2.5} />
				<line x1={0} y1={-60} x2={0} y2={0} stroke="#3a3020" strokeWidth={2} />
				{[-46, -36, -26, -16].map((yy) => (
					<g key={yy}>
						<line x1={-40} y1={yy} x2={-8} y2={yy} stroke="#8aa0c8" strokeWidth={2} />
						<line x1={8} y1={yy} x2={40} y2={yy} stroke="#8aa0c8" strokeWidth={2} />
					</g>
				))}
			</>
		) : (
			<>
				<rect x={-26} y={-66} width={52} height={66} rx={4} fill="#f08c2a" stroke="#3a3020" strokeWidth={2.5} />
				<rect x={14} y={-66} width={5} height={66} fill="#1d1d22" />
				<text x={-4} y={-30} textAnchor="middle" fontFamily="'Rubik', sans-serif" fontWeight={900} fontSize={8.5} fill="#3a2010">ЗАМЕРЫ</text>
			</>
		)}
	</g>
);

// pencil stuck in a flower pot (the gnomon). Pencil 10 units = 100 px * s
export const PencilPot: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<path d="M-38,-44 L38,-44 L30,0 L-30,0 Z" fill="#c4643a" stroke="#6a3420" strokeWidth={3} />
		<rect x={-42} y={-52} width={84} height={10} rx={3} fill="#d97b4b" stroke="#6a3420" strokeWidth={3} />
		<rect x={-5} y={-152} width={10} height={100} fill="#ffcc33" stroke="#5a4a10" strokeWidth={2} />
		<path d="M-5,-152 L0,-166 L5,-152 Z" fill="#f2d8a8" stroke="#5a4a10" strokeWidth={2} />
		<rect x={-5} y={-62} width={10} height={8} fill="#e86a9a" />
	</g>
);

// Ася's calendar on the fridge: June, the 18th circled three times in red
export const Calendar: React.FC<{x: number; y: number; s?: number; circles?: number}> = ({x, y, s = 1, circles = 3}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<rect x={-70} y={-110} width={140} height={110} rx={4} fill="#ffffff" stroke="#2b2f3a" strokeWidth={3} />
		<rect x={-70} y={-110} width={140} height={24} rx={4} fill="#3b7dd8" />
		<text x={0} y={-92} textAnchor="middle" fontFamily="'Rubik', sans-serif" fontWeight={900} fontSize={15} fill="#fff">ИЮНЬ</text>
		{Array.from({length: 30}).map((_, i) => {
			const c = (i + 1) % 7;
			const r = Math.floor((i + 1) / 7);
			return <rect key={i} x={-64 + c * 18.5} y={-80 + r * 16} width={14} height={11} rx={2} fill={i + 1 === 18 ? '#fff3c4' : '#e9edf4'} />;
		})}
		{Array.from({length: circles}).map((_, i) => (
			<ellipse key={i} cx={-64 + (18 % 7) * 18.5 + 7} cy={-80 + Math.floor(18 / 7) * 16 + 5.5} rx={11 + i * 2.5} ry={9 + i * 2} fill="none" stroke="#e23b3b" strokeWidth={2.2} transform={`rotate(${i * 8 - 6} ${-64 + (18 % 7) * 18.5 + 7} ${-80 + Math.floor(18 / 7) * 16 + 5.5})`} />
		))}
		<circle cx={52} cy={-100} r={7} fill="#f4f4f4" />
		<text x={-60} y={-4} fontFamily="'Caveat', cursive" fontWeight={700} fontSize={13} fill="#e23b3b">полнолуние! колесо!</text>
	</g>
);

// Ася's space encyclopedia «КОСМОС»: dark-blue cover, yellow moon
export const Encyclopedia: React.FC<{x: number; y: number; s?: number; open?: boolean}> = ({x, y, s = 1, open}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		{open ? (
			<>
				<path d="M-80,-60 Q-40,-70 0,-58 L0,0 Q-40,-10 -80,0 Z" fill="#fbf7ec" stroke="#1d2a5a" strokeWidth={3} />
				<path d="M80,-60 Q40,-70 0,-58 L0,0 Q40,-10 80,0 Z" fill="#fbf7ec" stroke="#1d2a5a" strokeWidth={3} />
				<circle cx={-56} cy={-34} r={11} fill="#ffcc33" />
				<circle cx={-14} cy={-32} r={8} fill="#c8ccd8" />
				<circle cx={50} cy={-30} r={10} fill="#4a8fe0" />
				<path d="M-44,-34 L-24,-33 M-6,-32 L38,-30" stroke="#e23b3b" strokeWidth={2.4} />
			</>
		) : (
			<>
				<rect x={-48} y={-66} width={96} height={66} rx={4} fill="#1d2a5a" stroke="#0e1534" strokeWidth={3} />
				<circle cx={18} cy={-40} r={13} fill="#ffe08a" />
				<text x={-6} y={-12} textAnchor="middle" fontFamily="'Rubik', sans-serif" fontWeight={900} fontSize={14} fill="#fff">КОСМОС</text>
			</>
		)}
	</g>
);

// Бублик: small ginger dog with a blue bow
export const Dog: React.FC<{x: number; y: number; s?: number; facing?: 1 | -1; wag?: number}> = ({x, y, s = 1, facing = 1, wag = 0}) => (
	<g transform={`translate(${x},${y}) scale(${s * facing},${s})`}>
		<path d={`M-34,-30 Q-50,${-48 + wag * 10} -54,${-56 + wag * 6}`} stroke="#d9822b" strokeWidth={8} strokeLinecap="round" fill="none" />
		<ellipse cx={-6} cy={-30} rx={34} ry={18} fill="#e08a32" />
		{[-26, -12, 6, 18].map((lx) => (
			<rect key={lx} x={lx} y={-20} width={7} height={20} rx={3} fill="#c06f22" />
		))}
		<circle cx={30} cy={-46} r={16} fill="#e08a32" />
		<ellipse cx={22} cy={-60} rx={7} ry={11} fill="#a85a1a" transform="rotate(-20 22 -60)" />
		<circle cx={36} cy={-49} r={3} fill="#1d1d22" />
		<circle cx={46} cy={-42} r={4} fill="#1d1d22" />
		<path d="M14,-34 l-8,-6 l0,12 Z M14,-34 l8,-6 l0,12 Z" fill="#3b7dd8" />
	</g>
);

// kite: red-white diamond with a tail of bows
export const Kite: React.FC<{x: number; y: number; s?: number; rot?: number}> = ({x, y, s = 1, rot = 0}) => (
	<g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
		<path d="M0,-60 L36,0 L0,70 L-36,0 Z" fill="#e8524a" stroke="#5a1a1a" strokeWidth={3} />
		<path d="M0,-60 L0,70 M-36,0 L36,0" stroke="#fff" strokeWidth={3} />
		<path d="M0,70 q12,20 -4,40 q-14,20 4,40" stroke="#5a1a1a" strokeWidth={2} fill="none" />
		{[90, 120, 148].map((yy) => (
			<path key={yy} d={`M-8,${yy} L8,${yy - 6} L8,${yy + 6} Z`} fill="#ffd23f" />
		))}
	</g>
);

// plate with dinner (котлета + пюре)
export const Plate: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<ellipse cx={0} cy={0} rx={44} ry={11} fill="#ffffff" stroke="#9aa3ad" strokeWidth={2.5} />
		<ellipse cx={-12} cy={-6} rx={16} ry={8} fill="#fff3c4" />
		<ellipse cx={14} cy={-6} rx={13} ry={7} fill="#8a4a22" />
	</g>
);

// pie (пирог соседки): golden with a lattice
export const Pie: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<ellipse cx={0} cy={0} rx={46} ry={14} fill="#c98a3a" />
		<ellipse cx={0} cy={-6} rx={44} ry={13} fill="#f0b45a" />
		<path d="M-30,-10 L30,-2 M-26,-2 L28,-12 M-10,-16 L-4,2 M10,-16 L14,2" stroke="#c98a3a" strokeWidth={3} />
	</g>
);

// birthday cake (торт Мирона)
export const Cake: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
	<g transform={`translate(${x},${y}) scale(${s})`}>
		<rect x={-44} y={-46} width={88} height={46} rx={6} fill="#f6c6d8" stroke="#a04a6a" strokeWidth={3} />
		<path d="M-44,-36 q11,10 22,0 q11,10 22,0 q11,10 22,0 q11,10 22,0" stroke="#fff" strokeWidth={6} fill="none" />
		{[-24, 0, 24].map((cx) => (
			<g key={cx}>
				<rect x={cx - 3} y={-66} width={6} height={20} fill="#3b7dd8" />
				<ellipse cx={cx} cy={-72} rx={4} ry={7} fill="#ffcc33" />
			</g>
		))}
	</g>
);

// smartphone (same for everybody): black, rounded, lit screen
export const Phone: React.FC<{x: number; y: number; s?: number; rot?: number; torch?: boolean; screen?: string}> = ({x, y, s = 1, rot = 0, torch, screen = '#8fd3ff'}) => (
	<g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
		<rect x={-12} y={-22} width={24} height={44} rx={5} fill="#15161a" />
		<rect x={-9} y={-18} width={18} height={34} rx={2} fill={screen} />
		{torch ? <circle cx={6} cy={-18} r={3} fill="#fffbe0" /> : null}
	</g>
);

// the full moon (low, orange near the horizon, paler higher up). r in px.
export const Moon: React.FC<{x: number; y: number; r: number; warm?: number}> = ({x, y, r, warm = 1}) => (
	<g>
		<circle cx={x} cy={y} r={r * 2.6} fill={warm > 0.5 ? '#ffb46a' : '#dfe8ff'} opacity={0.12} />
		<circle cx={x} cy={y} r={r} fill={warm > 0.5 ? '#ffd9a0' : '#f4f2e6'} />
		<circle cx={x - r * 0.3} cy={y - r * 0.2} r={r * 0.22} fill="#000" opacity={0.08} />
		<circle cx={x + r * 0.25} cy={y + r * 0.25} r={r * 0.3} fill="#000" opacity={0.07} />
		<circle cx={x + r * 0.35} cy={y - r * 0.35} r={r * 0.12} fill="#000" opacity={0.08} />
	</g>
);

export const PROPS_SHEET = (
	<g>
		<rect x={-20} y={-20} width={540} height={720} rx={18} fill="#f6efe0" stroke="#cdbb98" strokeWidth={3} />
		<Notebook x={60} y={120} s={1.3} />
		<Notebook x={210} y={110} s={1.1} open />
		<PencilPot x={390} y={170} s={0.9} />
		<Calendar x={110} y={340} s={1.2} />
		<Encyclopedia x={340} y={300} s={1.3} />
		<Encyclopedia x={360} y={400} s={1} open />
		<Dog x={110} y={500} s={1.3} />
		<Kite x={300} y={470} s={0.8} rot={-12} />
		<Plate x={430} y={540} s={1} />
		<Pie x={80} y={620} s={1} />
		<Cake x={230} y={650} s={1} />
		<Phone x={340} y={620} s={1.4} torch />
		<Moon x={440} y={640} r={34} />
	</g>
);
