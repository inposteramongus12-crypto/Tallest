import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {ShotDef} from '../kit/coverage';

/* Заглушка: один пустой кадр. Настоящие кадры появятся вместе со сценарием. */
const Empty: React.FC = () => <AbsoluteFill style={{background: '#fff'}} />;

export const SHOTS: ShotDef[] = [{at: '001', C: Empty}];
