import {interpolate} from 'remotion';
import {clamp, ease} from '../kit/kit';

/* Shared helpers for the story scenes. */
export const FL = 900;
export const HS = 1.05;
export const hip = (s: number) => FL - 157 * s;
export const tagY = (s: number) => FL - 157 * s - 164 * s - 115;
export const dirA = (a: number): [number, number] => [Math.sin((a * Math.PI) / 180), Math.cos((a * Math.PI) / 180)];
export const grow = (f: number, t: number, len = 10) => interpolate(f, [t, t + len], [0, 1], {...clamp, easing: ease});
/* piecewise height over local frames: keys [[frame, metres], ...], eased between keys */
export const hAt = (f: number, keys: [number, number][]) => {
	if (f <= keys[0][0]) return keys[0][1];
	for (let i = 1; i < keys.length; i++) if (f <= keys[i][0]) return interpolate(f, [keys[i - 1][0], keys[i][0]], [keys[i - 1][1], keys[i][1]], {...clamp, easing: ease});
	return keys[keys.length - 1][1];
};
/* 0..1 while the height is changing fast (badge pop) */
export const hot = (f: number, keys: [number, number][]) => Math.min(1, Math.abs(hAt(f + 1, keys) - hAt(f - 1, keys)) * 3);
