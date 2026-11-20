# Tallest — прогресс

## Тема
«Что если ты станешь самым высоким?»

## Состояние
- Каркас собран из Tyson, коммит e304801 в main.
- Сцен, озвучки и сценария нет. `src/story/shots.tsx` — один пустой кадр, `src/story/timeline.json` — 30 кадров без реплик.

## Надо сделать
- После выбора сюжета почистить остатки Tyson:
  - `src/story/cast.ts` (coach «Семён Ильич», mama, кулаки героя);
  - `src/CastSheet.tsx` (подписи персонажей, KnucklesShot);
  - `src/Root.tsx` (композиция Knuckles);
  - `tools/build-lines.mjs` и `tools/count-script.mjs` (спикеры HERO|LEHA|COACH|MAMA).
- Нужны новые модели персонажей и предметов, прежние (из Tyson) не повторять.
