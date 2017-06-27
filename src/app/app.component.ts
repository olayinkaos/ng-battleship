import { Component, ViewContainerRef } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { BattleshipBoardService } from './battleship-board.service'

declare var Pusher: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [BattleshipBoardService]
})

export class AppComponent {
  boardSize = 6;
  pusherChannel = null;
  gameId: string = null;
  canPlay: boolean = true;
  player: number = 0;
  players: number = 0;
  gameUrl = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');

  constructor(
    private toastr: ToastsManager,
    private _vcr: ViewContainerRef,
    private battleshipBoardService: BattleshipBoardService
  ) {
    this.toastr.setRootViewContainerRef(_vcr);
    this.battleshipBoardService.createBoards(this.boardSize);
    this.init();
    this.initPusher();
    this.listenForChanges();
  }

  init() : AppComponent {
    var id = this.getUrlParameter('id');
    if (!id) {
      id = this.getUniqueId();
      location.search = location.search
      ? '&id=' + id : 'id=' + id;
    }
    this.gameId = id;
    return this;
  }

  listenForChanges() : AppComponent {
    this.pusherChannel.bind('client-fire', (obj) => {
      this.canPlay = !this.canPlay;
      this.boards[obj.boardId] = obj.board;
      this.boards[obj.player].player.score = obj.score;
    });
    return this;
  }

  initPusher() : AppComponent {
    var pusher = new Pusher('26b7d8fa6aa64488853b', {
      authEndpoint: '/pusher/auth',
      cluster: 'eu'
    });
    var channel = pusher.subscribe(this.gameId);
    channel.bind('pusher:member_added', member => {
      this.players++;
    })
    channel.bind('pusher:subscription_succeeded', members => {
      this.players = members.count;
      this.setPlayer(this.players);
      this.toastr.success("Success", 'Connected!');
    })
    channel.bind('pusher:member_removed', member => {
      this.players--;
    });

    this.pusherChannel = channel;
    return this;
  }

  setPlayer(players:number = 0) {
    this.player = players - 1;
    if (players == 1) {
      this.canPlay = true;
    } else if (players == 2) {
      this.canPlay = false;
    }
  }

  shootMissile(e) {
    if (!this.canPlay) {
      this.toastr.error("A bit too eager.", "It's not your turn to play.");
      return;
    }
    let id = e.target.id;
    let board = id.substring(1,2);

    if (board == this.player) {
      this.toastr.error("Don't commit suicide.", "You can't hit your own board.")
      return;
    }
    var row = id.substring(2,3);
    var col = id.substring(3,4);
    let tile = this.boards[board].tiles[row][col];

    this.boards[board].tiles[row][col].used = true;
    if (tile.value == 1) {
      this.toastr.info("You got this.", "HURRAAA! YOU SANK A SHIP!");
      this.boards[board].tiles[row][col].status = 'win';
      this.boards[this.player].player.score++;
    } else {
      this.toastr.info("Keep trying fam.", "OOPS! YOU MISSED THIS TIME");
      this.boards[board].tiles[row][col].status = 'fail'
    }
    this.canPlay = false;
    this.boards[board].tiles[row][col].value = "X";
    this.pusherChannel.trigger('client-fire', {
      player: this.player,
      score: this.boards[this.player].player.score,
      boardId: board,
      board: this.boards[board]
    });
  }

  getUniqueId () {
    return 'presence-' + Math.random().toString(36).substr(2, 9);
  }

  getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };

  get validPlayer(): boolean {
    return (this.players >= 2) && (this.player < 2);
  }

  get winner () {
    return this.boards.find(board => board.player.score >= ( this.boardSize * 2 ) );
  }

  get boards () {
    return this.battleshipBoardService.getBoards()
  }
}
