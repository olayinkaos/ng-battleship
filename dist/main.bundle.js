webpackJsonp([2,5],{

/***/ 349:
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 349;


/***/ }),

/***/ 350:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(441);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__environments_environment__ = __webpack_require__(464);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_app_module__ = __webpack_require__(462);




if (__WEBPACK_IMPORTED_MODULE_2__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["enableProdMode"])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_3__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=/Users/omoleolayinka/Code/BIN/ng-battleship/src/main.js.map

/***/ }),

/***/ 461:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ng2_toastr_ng2_toastr__ = __webpack_require__(342);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ng2_toastr_ng2_toastr___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_ng2_toastr_ng2_toastr__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__battleship_board_service__ = __webpack_require__(463);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AppComponent = (function () {
    function AppComponent(toastr, _vcr, battleshipBoardService) {
        this.toastr = toastr;
        this._vcr = _vcr;
        this.battleshipBoardService = battleshipBoardService;
        this.boardSize = 6;
        this.pusherChannel = null;
        this.gameId = null;
        this.canPlay = true;
        this.player = 0;
        this.players = 0;
        this.gameUrl = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
        this.toastr.setRootViewContainerRef(_vcr);
        this.battleshipBoardService.createBoards(this.boardSize);
        this.init();
        this.initPusher();
        this.listenForChanges();
    }
    AppComponent.prototype.init = function () {
        var id = this.getUrlParameter('id');
        if (!id) {
            id = this.getUniqueId();
            location.search = location.search
                ? '&id=' + id : 'id=' + id;
        }
        this.gameId = id;
        return this;
    };
    AppComponent.prototype.listenForChanges = function () {
        var _this = this;
        this.pusherChannel.bind('client-fire', function (obj) {
            _this.canPlay = !_this.canPlay;
            _this.boards[obj.boardId] = obj.board;
            _this.boards[obj.player].player.score = obj.score;
        });
        return this;
    };
    AppComponent.prototype.initPusher = function () {
        var _this = this;
        var pusher = new Pusher('26b7d8fa6aa64488853b', {
            authEndpoint: '/pusher/auth',
            cluster: 'eu'
        });
        var channel = pusher.subscribe(this.gameId);
        channel.bind('pusher:member_added', function (member) {
            _this.players++;
        });
        channel.bind('pusher:subscription_succeeded', function (members) {
            _this.players = members.count;
            _this.setPlayer(_this.players);
            _this.toastr.success("Success", 'Connected!');
        });
        channel.bind('pusher:member_removed', function (member) {
            _this.players--;
        });
        this.pusherChannel = channel;
        return this;
    };
    AppComponent.prototype.setPlayer = function (players) {
        if (players === void 0) { players = 0; }
        this.player = players - 1;
        if (players == 1) {
            this.canPlay = true;
        }
        else if (players == 2) {
            this.canPlay = false;
        }
    };
    AppComponent.prototype.shootMissile = function (e) {
        if (!this.canPlay) {
            this.toastr.error("A bit too eager.", "It's not your turn to play.");
            return;
        }
        var id = e.target.id;
        var board = id.substring(1, 2);
        if (board == this.player) {
            this.toastr.error("Don't commit suicide.", "You can't hit your own board.");
            return;
        }
        var row = id.substring(2, 3);
        var col = id.substring(3, 4);
        var tile = this.boards[board].tiles[row][col];
        this.boards[board].tiles[row][col].used = true;
        if (tile.value == 1) {
            this.toastr.info("You got this.", "HURRAAA! YOU SANK A SHIP!");
            this.boards[board].tiles[row][col].status = 'win';
            this.boards[this.player].player.score++;
        }
        else {
            this.toastr.info("Keep trying fam.", "OOPS! YOU MISSED THIS TIME");
            this.boards[board].tiles[row][col].status = 'fail';
        }
        this.canPlay = false;
        this.boards[board].tiles[row][col].value = "X";
        this.pusherChannel.trigger('client-fire', {
            player: this.player,
            score: this.boards[this.player].player.score,
            boardId: board,
            board: this.boards[board]
        });
    };
    AppComponent.prototype.getUniqueId = function () {
        return 'presence-' + Math.random().toString(36).substr(2, 9);
    };
    AppComponent.prototype.getUrlParameter = function (name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };
    ;
    Object.defineProperty(AppComponent.prototype, "validPlayer", {
        get: function () {
            return (this.players >= 2) && (this.player < 2);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppComponent.prototype, "winner", {
        get: function () {
            var _this = this;
            return this.boards.find(function (board) { return board.player.score >= (_this.boardSize * 2); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppComponent.prototype, "boards", {
        get: function () {
            return this.battleshipBoardService.getBoards();
        },
        enumerable: true,
        configurable: true
    });
    AppComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(622),
            styles: [__webpack_require__(620)],
            providers: [__WEBPACK_IMPORTED_MODULE_2__battleship_board_service__["a" /* BattleshipBoardService */]]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1_ng2_toastr_ng2_toastr__["ToastsManager"] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1_ng2_toastr_ng2_toastr__["ToastsManager"]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewContainerRef"] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewContainerRef"]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__battleship_board_service__["a" /* BattleshipBoardService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__battleship_board_service__["a" /* BattleshipBoardService */]) === 'function' && _c) || Object])
    ], AppComponent);
    return AppComponent;
    var _a, _b, _c;
}());
//# sourceMappingURL=/Users/omoleolayinka/Code/BIN/ng-battleship/src/app.component.js.map

/***/ }),

/***/ 462:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(137);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(431);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(437);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ng2_toastr_ng2_toastr__ = __webpack_require__(342);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ng2_toastr_ng2_toastr___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_ng2_toastr_ng2_toastr__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_component__ = __webpack_require__(461);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* AppComponent */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["BrowserModule"],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormsModule */],
                __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_4_ng2_toastr_ng2_toastr__["ToastModule"].forRoot()
            ],
            providers: [],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* AppComponent */]]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
//# sourceMappingURL=/Users/omoleolayinka/Code/BIN/ng-battleship/src/app.module.js.map

/***/ }),

/***/ 463:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BattleshipBoardService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var BattleshipBoardService = (function () {
    function BattleshipBoardService() {
        this.playerId = 1;
        this.boards = [];
    }
    BattleshipBoardService.prototype.createBoards = function (size, players) {
        if (size === void 0) { size = 5; }
        if (players === void 0) { players = 2; }
        for (var i = 0; i < players; i++) {
            this.createBoard(size);
        }
    };
    BattleshipBoardService.prototype.createBoard = function (size) {
        if (size === void 0) { size = 5; }
        var board = [];
        for (var i = 0; i < size; i++) {
            board[i] = [];
            for (var j = 0; j < size; j++) {
                board[i][j] = {
                    used: false,
                    value: 0,
                    status: ''
                };
            }
        }
        for (var i_1 = 0; i_1 < size * 2; i_1++) {
            board = this.randomShips(board, size);
        }
        var fullBoard = {
            tiles: board,
            player: {
                id: this.playerId++,
                score: 0
            }
        };
        this.boards.push(fullBoard);
        return this;
    };
    BattleshipBoardService.prototype.getBoards = function () {
        return this.boards;
    };
    BattleshipBoardService.prototype.randomShips = function (board, len) {
        len = len - 1;
        var ranRow = this.getRandomInt(0, len), ranCol = this.getRandomInt(0, len);
        if (board[ranRow][ranCol] == 1) {
            return this.randomShips(board, len);
        }
        else {
            board[ranRow][ranCol].value = 1;
            return board;
        }
    };
    BattleshipBoardService.prototype.getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
    };
    BattleshipBoardService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(), 
        __metadata('design:paramtypes', [])
    ], BattleshipBoardService);
    return BattleshipBoardService;
}());
//# sourceMappingURL=/Users/omoleolayinka/Code/BIN/ng-battleship/src/battleship-board.service.js.map

/***/ }),

/***/ 464:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.
var environment = {
    production: false
};
//# sourceMappingURL=/Users/omoleolayinka/Code/BIN/ng-battleship/src/environment.js.map

/***/ }),

/***/ 620:
/***/ (function(module, exports) {

module.exports = ".content table td, .content table th {\n    border: 1px solid #dbdbdb;\n    padding: 0.5em 0.75em;\n    vertical-align: middle;\n    height: 50px;\n    text-align: center;\n}\n.content table {\n  width: 80%;\n  margin: 0 auto;\n}\n.content table tr:hover {\n    background-color: transparent;\n}\n"

/***/ }),

/***/ 622:
/***/ (function(module, exports) {

module.exports = "<div class=\"section\">\n  <div class=\"container\">\n    <div class=\"content\">\n      <h1 class=\"title\">Ready to sink some battleships?</h1>\n      <h6 class=\"subtitle is-6\"><strong>Pusher Battleship</strong></h6>\n\n      <hr>\n\n      <section *ngIf=\"winner\" class=\"notification is-success has-text-centered\" style=\"color:white\">\n        <h1>\n          Player {{ winner.player.id }} has won the game!\n        </h1>\n        <h5>\n          Click <a href=\"{{ gameUrl }}\">here</a> to start a new game.\n        </h5>\n      </section>\n\n      <section *ngIf=\"!winner\">\n        <div *ngIf=\"player > 1\">\n          <div class=\"notification is-danger\">\n            Sorry, only 2 players can play at a time. You can start your own game by visiting <a href=\"{{ gameUrl }}\">{{ gameUrl }}</a>\n          </div>\n        </div>\n\n        <div *ngIf=\"players < 2\">\n          <h2>Waiting for 2nd user to join...</h2>\n          <h3 class=\"subtitle is-6\">You can invite them with this link: {{ gameUrl }}?id={{ gameId }} or open it in a new browser, to play all by yourself.</h3>\n        </div>\n\n        <div class=\"columns\" *ngIf=\"validPlayer\">\n          <div class=\"column has-text-centered\" *ngFor=\"let board of boards; let i = index\">\n            <h5>\n              PLAYER {{ board.player.id }} <span class=\"tag is-info\" *ngIf=\"i == player\">You</span>\n              // <strong>SCORE: {{ board.player.score }}</strong>\n            </h5>\n            <table class=\"is-bordered\" [style.opacity] = \"i == player ? 0.5 : 1\">\n              <tr *ngFor=\"let row of board.tiles; let j = index\">\n                <td *ngFor=\"let col of row; let k = index\"\n                  (click) = \"shootMissile($event)\"\n                  [style.background-color] = \"col.used ? '' : 'transparent'\"\n                  [class] = \"col.status == 'win' ? 'win' : 'fail'\"\n                  class=\"battleship-tile\" id=\"t{{i}}{{j}}{{k}}\">\n                  {{ col.value == \"X\" ? \"X\" : \"💀\" }}\n                </td>\n              </tr>\n            </table>\n\n          </div>\n        </div>\n      </section>\n\n\n\n      <h5 class=\"title has-text-centered\"><small>{{ players }} player(s) in game</small></h5>\n\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ 638:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(350);


/***/ })

},[638]);
//# sourceMappingURL=main.bundle.map