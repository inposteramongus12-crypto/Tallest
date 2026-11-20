import type {Base} from '../kit/actions';

/* Characters of «Что если ты станешь самым высоким?». Key = id used in <Actor who="..."/>; `sp` = speaker code in lines.json.
   Every main character has its own hue, outfit and proportions (checked on the Cast sheet on both backgrounds).
   Voiceless extras have no `sp`: they talk only through bubbles. */
export type CastMember = Base & {sp?: string};

export const CAST: Record<string, CastMember> = {
	// Ярик, герой: коралловое поло с белым воротником, кудри, тёмно-синие джинсы, худой и длинноногий
	hero: {sp: 'HERO', color: '#e8524a', outfit: 'polo', trim: '#fff1e6', hair: 'curly', legColor: '#1f2a44', shoe: '#f4f4f4', rim: '#ffe1d6', rimW: 2.4, build: {w: 0.9, leg: 1.06}},
	// Ася, 9: зелёное платье, хвостики с жёлтыми резинками, большая голова, короткие ноги
	sis: {sp: 'SIS', color: '#4fb35f', outfit: 'dress', trim: '#ffd23f', hair: 'pigtails', hairColor: '#ffd23f', legColor: '#2b2b33', shoe: '#ff7aa8', rim: '#eaffe6', rimW: 2.4, build: {w: 0.8, head: 1.16, leg: 0.8}},
	// Мирон: бирюзовая рубашка + оранжевый жилет с карманами, панамка, очки на лбу, рулетка на поясе
	friend: {sp: 'FRIEND', color: '#23a39a', outfit: 'vest', trim: '#f0a33a', hair: 'beanie', hairColor: '#f0a33a', acc: ['foreheadGlasses', 'tape'], legColor: '#4a4036', shoe: '#2f2f35', rim: '#e0fffb', rimW: 2.4, build: {w: 0.86, head: 1.06, leg: 0.95}},
	// папа: охристая рубашка, широкий, залысины с сединой, борода щетиной
	dad: {sp: 'DAD', color: '#c98a3a', outfit: 'shirt', trim: '#fff6e6', hair: 'receding', hairColor: '#8b8f9c', acc: ['beard'], legColor: '#383a46', shoe: '#5a3a26', rim: '#fff0d8', rimW: 2.4, build: {w: 1.22, leg: 0.94}},
	// без голоса
	blogger: {color: '#d6336c', outfit: 'tee', hair: 'beanie', hairColor: '#22283a', legColor: '#1d1d22', shoe: '#ffffff', rim: '#ffe0ea', rimW: 2.4, build: {w: 0.95}},
	operator: {color: '#ff8c1a', outfit: 'hivis', trim: '#e9f2f2', hair: 'helmet', hairColor: '#f2f2f2', legColor: '#2c3340', shoe: '#1d1d22', rim: '#fff0dc', rimW: 2.4, build: {w: 1.1}},
	rescuer: {color: '#c9302c', outfit: 'coat', hair: 'helmet', hairColor: '#ffcc00', legColor: '#2c3340', shoe: '#111', rim: '#ffe0dc', rimW: 2.4, build: {w: 1.12}},
	neighbor: {color: '#b58ad8', outfit: 'shirt', trim: '#fff', hair: 'bun', legColor: '#3a3346', shoe: '#5a3a46', rim: '#f4e8ff', rimW: 2.4},
	neighborM: {color: '#9aa3ad', outfit: 'tee', hair: 'receding', hairColor: '#2b2b30', legColor: '#2b2f3a', shoe: '#2b2f3a', rim: '#eef2f6', rimW: 2.4, build: {w: 1.15}},
	kid: {color: '#f2c94c', outfit: 'tee', hair: 'short', legColor: '#3a5a8a', shoe: '#e94f4f', rim: '#fff8dc', rimW: 2.4, build: {w: 0.78, head: 1.14, leg: 0.78}},
	rival1: {color: '#3a3f9a', outfit: 'tee', hair: 'spiky', legColor: '#111', shoe: '#fff', rim: '#e6e8ff', rimW: 2.4, build: {w: 1.05, leg: 1.04}},
	rival2: {color: '#7b3fa0', outfit: 'tee', hair: 'none', legColor: '#111', shoe: '#fff', rim: '#f4e6ff', rimW: 2.4, build: {w: 1.1}},
	cashier: {color: '#4b8f80', outfit: 'apron', hair: 'bob', legColor: '#2b2f3a', shoe: '#2b2f3a', rim: '#e6fff8', rimW: 2.4},
	granny: {color: '#a05a7a', outfit: 'gown', hair: 'grey', hairColor: '#e8e8ee', legColor: '#3a2a33', shoe: '#3a2a33', rim: '#ffe8f2', rimW: 2.4, build: {w: 1.05, leg: 0.9}},
};
