import type React from 'react';
import {VQuestion, VRule, VTitle} from './shortV';

/* 9:16 short «Ростом с тень» — recut from 12 long lines (src/story/short-pick.json → short-timeline.json, 0 new credits).
   Each segment: short line, the long line its picture comes from (ep), crop a → b in 16:9 screen coords, or a native vertical card C. */
export type Seg = {
	line: string;
	at?: number;
	ep?: string;
	off?: number;
	cont?: boolean;
	hold?: boolean;
	a?: {cx?: number; cy?: number; z?: number};
	b?: {cx?: number; cy?: number; z?: number};
	C?: React.FC<{f: number; dur: number}>;
	top?: 'hook' | 'p9';
	label?: string;
};

export const SHORT: {mode: 'crop'; hook?: string[]; bed?: string} | {mode: 'recut'; segs: Seg[]; hook?: string[]; bed?: string} = {
	mode: 'recut',
	bed: 'sfx/bed_short.wav',
	segs: [
		{line: '001', ep: '001', a: {cx: 960, cy: 520}, b: {cx: 1000, cy: 480, z: 1.05}},
		{line: '002', ep: '002', a: {cx: 1160, cy: 520, z: 1.0}, b: {cx: 1180, cy: 540, z: 1.0}},
		{line: '003', ep: '004', a: {cx: 1060, cy: 560}, b: {cx: 1080, cy: 540, z: 1.08}},
		{line: '004', C: VTitle},
		{line: '005', ep: '041', a: {cx: 660, cy: 520}, b: {cx: 640, cy: 500, z: 1.0}},
		{line: '006', C: VRule},
		{line: '007', ep: '126', a: {cx: 1100, cy: 520}, b: {cx: 1080, cy: 500, z: 1.05}},
		{line: '008', ep: '133', a: {cx: 960, cy: 540}, b: {cx: 960, cy: 520, z: 1.1}},
		{line: '009', ep: '136', a: {cx: 960, cy: 640, z: 1.15}, b: {cx: 960, cy: 620, z: 1.2}},
		{line: '010', ep: '142', a: {cx: 960, cy: 560, z: 1.3}, b: {cx: 850, cy: 540, z: 1.0}},
		{line: '011', ep: '156', a: {cx: 760, cy: 560}, b: {cx: 760, cy: 540, z: 1.05}},
		{line: '012', C: VQuestion},
	],
};
