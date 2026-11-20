import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {clamp, ease} from '../kit/kit';
import {FONT, HAND} from '../kit/ui';

/* Native vertical (1080x1920) cards of the short. */
export const TopClock: React.FC<{mode: 'hook' | 'p9'; f: number; ep0: number; label?: string}> = () => null;

const Bg: React.FC<{c1: string; c2: string; children: React.ReactNode}> = ({c1, c2, children}) => (
	<AbsoluteFill style={{background: `linear-gradient(${c1}, ${c2})`, alignItems: 'center', justifyContent: 'center'}}>{children}</AbsoluteFill>
);
const pop = (f: number, at = 0) => interpolate(f, [at, at + 10], [0, 1], {...clamp, easing: ease});
const big: React.CSSProperties = {fontFamily: FONT, fontWeight: 900, color: '#ffc94a', textAlign: 'center', textShadow: '0 6px 0 #1b1f2e, 0 10px 30px rgba(0,0,0,.5)', lineHeight: 1.08};

export const VTitle: React.FC<{f: number; dur: number}> = ({f}) => (
	<Bg c1="#3a4f9a" c2="#ffb45a">
		<div style={{...big, fontSize: 104, transform: `scale(${0.9 + 0.1 * pop(f)})`, opacity: pop(f), padding: 60}}>ЧТО ЕСЛИ ТЫ СТАНЕШЬ САМЫМ ВЫСОКИМ?</div>
		<div style={{position: 'absolute', bottom: 260, fontFamily: HAND, fontWeight: 700, fontSize: 70, color: '#fff', opacity: pop(f, 40)}}>каждый вечер. на закате.</div>
	</Bg>
);
export const VRule: React.FC<{f: number; dur: number}> = ({f}) => (
	<Bg c1="#2f4a3d" c2="#101a15">
		<div style={{fontFamily: HAND, fontWeight: 700, fontSize: 96, color: '#f6e7a1', opacity: pop(f)}}>ПРАВИЛО 4</div>
		<svg width={900} height={700} viewBox="-450 -350 900 700" style={{opacity: pop(f, 10)}}>
			<g transform="translate(-200,-60)">
				<circle r={30} fill="#ffe9a8" />
				{[-60, -30, 0, 30, 60].map((a) => (
					<line key={a} x1={0} y1={0} x2={Math.sin((a * Math.PI) / 180) * 220} y2={Math.cos((a * Math.PI) / 180) * 220} stroke="#ffe9a8" strokeWidth={7} />
				))}
				<text y={-60} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={56} fill="#fff">лампа ✗</text>
			</g>
			<g transform="translate(200,-140)">
				<circle cx={-40} cy={-40} r={40} fill="#ffcc33" />
				{[0, 1, 2, 3, 4].map((i) => (
					<line key={i} x1={-20 + i * 40} y1={0} x2={80 + i * 40} y2={300} stroke="#ffcc33" strokeWidth={7} />
				))}
				<text x={40} y={-100} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={56} fill="#fff">солнце ✓</text>
			</g>
		</svg>
		<div style={{fontFamily: HAND, fontWeight: 700, fontSize: 80, color: '#f4f1e6', textAlign: 'center', padding: '0 60px', opacity: pop(f, 30)}}>Только солнце. Лампы не считаются</div>
	</Bg>
);
export const VQuestion: React.FC<{f: number; dur: number}> = ({f}) => (
	<Bg c1="#3a4f9a" c2="#e9786a">
		<div style={{...big, fontSize: 96, opacity: pop(f), padding: 60}}>А ТЫ В КАКОЕ ВРЕМЯ СУТОК ХОТЕЛ БЫ ЖИТЬ?</div>
		<div style={{position: 'absolute', bottom: 240, fontFamily: FONT, fontWeight: 800, fontSize: 56, color: '#fff', opacity: pop(f, 40)}}>Полная история — на канале</div>
	</Bg>
);
