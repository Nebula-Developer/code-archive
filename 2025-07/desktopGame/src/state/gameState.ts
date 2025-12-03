import { createStore } from 'solid-js/store';

export const [game, setGame] = createStore({
  gold: 0,
  characters: [
    {
      name: 'Nico',
      xp: 0,
      level: 1,
      animation: 'idle',
      sprite: 'nico.png',
    },
  ],
});
