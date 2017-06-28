import { Player } from './player'
export class Board {
  player: Player;
  tiles: Object[];

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
