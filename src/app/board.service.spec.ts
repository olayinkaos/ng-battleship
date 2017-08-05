/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BattleshipBoardService } from './battleship-board.service';

describe('BattleshipBoardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BattleshipBoardService]
    });
  });

  it('should ...', inject([BattleshipBoardService], (service: BattleshipBoardService) => {
    expect(service).toBeTruthy();
  }));
});
