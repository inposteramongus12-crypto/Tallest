import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Actor} from './kit/core';
import {idle} from './kit/actions';
import {FONT} from './kit/ui';
import {Pose} from './engine/Stickman';
import {PROPS_SHEET} from './story/props';

/* Character sheet: every character on the dark-blue and on the warm-light background, plus the story props. */
const COLS = 7;
const CW = 1920 / COLS;
const BAND = 440;
type Slot = {who: string; label: string; s?: number};
const SLOTS: Slot[] = [
	{who: 'hero', label: 'ЯРИК'},
	{who: 'sis', label: 'АСЯ', s: 0.68},
	{who: 'friend', label: 'МИРОН'},
	{who: 'dad', label: 'ПАПА'},
	{who: 'blogger', label: 'БЛОГЕР'},
	{who: 'operator', label: 'ОПЕРАТОР'},
	{who: 'rescuer', label: 'СПАСАТЕЛЬ'},
	{who: 'neighbor', label: 'СОСЕДКА'},
	{who: 'neighborM', label: 'СОСЕД'},
	{who: 'kid', label: 'МАЛЬЧИК', s: 0.62},
	{who: 'rival1', label: 'СТАРШЕКЛ. 1'},
	{who: 'rival2', label: 'СТАРШЕКЛ. 2'},
	{who: 'cashier', label: 'КАССИР'},
	{who: 'granny', label: 'БАБУШКА'},
];
// arms out to the sides so the hands and cuffs read
const OPEN: Pose = {lean: 0, head: 0, armB: [-38, 30], armF: [44, 30], legB: [-6, 2], legF: [6, 2]};
const S = 0.8;
const Cell: React.FC<{slot: Slot; i: number; light: boolean}> = ({slot, i, light}) => {
	const cx = CW / 2;
	const floor = BAND - 90;
	return (
		<g>
			<Actor who={slot.who} x={cx} floor={floor} s={S * (slot.s ?? 1)} facing={1} faceTurn={0.3} uid={`c${i}${light ? 'l' : 'd'}`} seed={i} pose={i % 2 ? OPEN : idle(0, i)} />
			<text x={cx} y={BAND - 28} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={21} fill={light ? '#2a2f3f' : '#fff'}>
				{slot.label}
			</text>
		</g>
	);
};

export const CastSheet: React.FC = () => (
	<AbsoluteFill style={{background: '#2a3550'}}>
		<svg width={1920} height={BAND * 4} viewBox={`0 0 1920 ${BAND * 4}`}>
			{[0, 1, 2, 3].map((band) => {
				const light = band >= 2;
				return (
					<g key={band} transform={`translate(0,${band * BAND})`}>
						<rect x={0} y={0} width={1920} height={BAND} fill={light ? '#e9dcc3' : '#2a3550'} />
						<rect x={0} y={BAND - 90} width={1920} height={90} fill={light ? '#cdbb98' : '#1a2238'} />
						{SLOTS.slice((band % 2) * COLS, (band % 2) * COLS + COLS).map((slot, j) => (
							<g key={j} transform={`translate(${j * CW},0)`}>
								<Cell slot={slot} i={(band % 2) * COLS + j} light={light} />
							</g>
						))}
					</g>
				);
			})}
		</svg>
	</AbsoluteFill>
);

/* Close-up of the four main characters (hands, cuffs, faces) and the story props. */
export const HandsShot: React.FC = () => (
	<AbsoluteFill style={{background: '#e9dcc3'}}>
		<svg width={1920} height={1080}>
			<rect x={0} y={760} width={1920} height={320} fill="#cdbb98" />
			{['hero', 'sis', 'friend', 'dad'].map((w, i) => (
				<Actor key={w} who={w} x={190 + i * 330} floor={760} s={w === 'sis' ? 1.05 : 1.45} faceTurn={0.3} uid={'h' + w} pose={OPEN} />
			))}
			<g transform="translate(1380,80)">{PROPS_SHEET}</g>
		</svg>
	</AbsoluteFill>
);
