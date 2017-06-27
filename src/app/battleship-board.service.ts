import { Injectable } from '@angular/core';

@Injectable()
export class BattleshipBoardService {

  playerId: number = 1;
  boards = [];

  constructor() {

  }

  createBoards(size:number = 5, players: Number = 2) {
    for (let i = 0; i < players; i++) {
      this.createBoard(size);
    }
  }

  createBoard(size:number = 5) : BattleshipBoardService {
    let board = [];
    for(var i=0; i < size; i++) {
        board[i] = [];
        for(var j=0; j< size; j++) {
            board[i][j] = {
              used: false,
              value: 0,
              status: ''
            };
        }
    }
    for (let i = 0; i < size * 2; i++) {
      board = this.randomShips(board, size);
    }
    let fullBoard = {
      tiles: board,
      player: {
        id: this.playerId++,
        score: 0
      }
    }
    this.boards.push(fullBoard);
    return this;
  }

  getBoards() {
    return this.boards;
  }

  randomShips(board, len) {
    len = len - 1;
    let ranRow = this.getRandomInt(0, len),
    ranCol = this.getRandomInt(0, len);
    if (board[ranRow][ranCol] == 1) {
      return this.randomShips(board, len);
    } else {
      board[ranRow][ranCol].value = 1;
      return board;
    }
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
  }

}
