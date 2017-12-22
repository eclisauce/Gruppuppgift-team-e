class ComputerPlayer extends Player {
  constructor(name, color, type, board) {
    super();
    this.name = name;
    this.color = color;
    this.type = type;
    this.board = board;
  }

  calculateX() {
    let rnd = Math.floor(Math.random() * 7);
    rnd += "10";
    rnd = parseInt(rnd);
    return rnd;
  }

  randomTime() {
    let rnd = Math.floor(Math.random() * 1500) + 600;
    return rnd;
  }

  isBoardClickableComputer(element) {
    if ($(element).hasClass('yellow') || $(element).hasClass('red')) {
      return false;
    } else {
      return true;
    }
  }

  makeMove() {
    setTimeout(() => this.randomPlaceADisc(), this.randomTime());
  }

  randomPlaceADisc() {
    let playCol = this.decideRow();



    if (playCol > 7)
      playCol = (playCol - 10) / 100


/*    this.board.toggleActiveBoard(true);
    $(`rect[x="${(playCol*100)+10}"][y="${10}"]`).trigger('click');
*/
        let clickThis;
        while (true) {
          clickThis = $(`rect[x="${(playCol*100)+10}"][y="${10}"]`);
          let checkFull = clickThis.siblings('circle');
          if (game.board.isBoardFull()) {
            break;
          } else if (game.board.gameOver === true) {
            break;
          } else if (this.isBoardClickableComputer(checkFull)) {
            this.board.toggleActiveBoard(true);
            clickThis.trigger('click');
            break;
          }
        }
  }

  canPlay(col) {
    return this.board.colHeight[col] < 6
  }


  decideRow() {
    let thisColor = this.board.turn;
    let otherColor;

    otherColor = thisColor == 'red' ? otherColor = 'yellow' : otherColor = 'red';



    let found = false;
    let tempDisc;
    let tempDisc2;
    let rowPoints = new Array(7).fill(0);


    for (let i = 0; i < 7; i++) {
      if (this.canPlay(i)) {
        tempDisc = this.getPlayDisc(i);
        tempDisc.color = thisColor;
        this.board.colHeight[i]++;


        if (this.isWinningMove(i, thisColor)) {
          rowPoints[i] += 5
        }

        tempDisc.color = otherColor;

        if (this.isWinningMove(i, otherColor)) {
          rowPoints[i] += 4
        }
        for (let x = 0; x < 7; x++) {
          if (this.canPlay(x)) {
            tempDisc2 = this.getPlayDisc(x);
            tempDisc2.color = thisColor;
            this.board.colHeight[x]++;
            if (this.isWinningMove(i, thisColor)) {
              rowPoints[x] += 5
            }
            tempDisc2.color = otherColor;
            if (this.isWinningMove(i, otherColor)) {
              rowPoints[x] += 4
            }
            this.board.colHeight[x]--;
            tempDisc2.color = 'white';
          }
        }
        this.board.colHeight[i]--;
        tempDisc.color = 'white';
      }
    }
 
    if (rowPoints.every((val, i, arr) => val === arr[0])) {

      return this.calculateX();
    } else {
      let col = rowPoints.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
      return col;
    }
  }


  getPlayDisc(col) {
    for (let y = 5; y >= 0; y--) {
      if (this.board.places[col][y].color === 'white' && this.canPlay(col)) {

        return this.board.places[col][y];
        break;
      }
    }
  }

  isWinningMove(col, color) {
    if (this.canPlay(col)) {
      let value = this.checkWinner(color);
      return value;
    }
    return false;

  }


  checkWinner(color) {
    return (
      this.checkForInRow(color) ||
      this.checkForInColumn(color) ||
      this.checkForInDiagonal1(color) ||
      this.checkForInDiagonal2(color)
    );
  }

  checkForInRow(color) {
    let count = 0;
    for (let originX = 0; originX < 4; originX++) {
      for (let originY = 0; originY < 6; originY++) {
        count = 0;
        for (let i = 0; i < 4; i++) {
          if (this.board.places[originX + i][originY].color === color) {
            count++;
            if (count === 4 && this.board.game.player1.color === color) {
              return true;
            } else if (count === 4 && this.board.game.player2.color === color) {
              return true;
            }
          } else {
            break;
          }
        }
      }
    }
    return false;
  }

  checkForInColumn(color) {
    let count = 0;
    for (let originX = 0; originX < 7; originX++) {
      for (let originY = 0; originY < 3; originY++) {
        count = 0;
        for (let i = 0; i < 4; i++) {
          if (this.board.places[originX][originY + i].color === color) {
            count++;
            if (count === 4 && this.board.game.player1.color === color) {
              return true;
            } else if (count === 4 && this.board.game.player2.color === color) {
              return true;
            }
          } else {
            break;
          }
        }
      }
    }
    return false;
  }

  checkForInDiagonal1(color) {
    let count = 0;
    for (let originX = 0; originX < 4; originX++) {
      for (let originY = 0; originY < 3; originY++) {
        count = 0;
        for (let i = 0; i < 4; i++) {
          if (this.board.places[originX + i][originY + i].color === color) {
            count++;
            if (count === 4 && this.board.game.player1.color === color) {
              return true;
            } else if (count === 4 && this.board.game.player2.color === color) {
              return true;
            }
          } else {
            break;
          }
        }
      }
    }
    return false;
  }

  checkForInDiagonal2(color) {
    let count = 0;
    for (let originX = 3; originX < 7; originX++) {
      for (let originY = 0; originY < 3; originY++) {
        count = 0;
        for (let i = 0; i < 4; i++) {
          if (this.board.places[originX - i][originY + i].color === color) {
            count++;
            if (count === 4 && this.board.game.player1.color === color) {
              return true;
            } else if (count === 4 && this.board.game.player2.color === color) {
              return true;
            }
          } else {
            break;
          }
        }
      }
    }
    return false;
  }

}