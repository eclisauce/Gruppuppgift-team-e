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
    let playCol = this.decideBestColumn();

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


  decideBestColumn() {
    let currentColor = this.board.turn;
    let secondColor; 
    secondColor = currentColor == 'red' ? secondColor = 'yellow' : secondColor = 'red';
    console.log(secondColor)

    let found = false;
    let firstPlayDisc;
    let secondPlayDisc;
    let rowPoints = new Array(7).fill(0);

    for (let i = 0; i < 7; i++) {
      if (this.canPlay(i)) {
        firstPlayDisc = this.getPlayDisc(i);
        firstPlayDisc.color = currentColor;
        this.board.colHeight[i]++;

        if (this.isWinningMove(i, currentColor))
          rowPoints[i] += 5
        firstPlayDisc.color = secondColor;
        if (this.isWinningMove(i, secondColor))
          rowPoints[i] += -4
        for (let x = 0; x < 7; x++) {
          if (this.canPlay(x)) {
            secondPlayDisc = this.getPlayDisc(x);
            secondPlayDisc.color = secondColor;
            this.board.colHeight[x]++;

            if (this.isWinningMove(i, currentColor)) {
              rowPoints[x] += 5
            }
            secondPlayDisc.color = secondColor;
            if (this.isWinningMove(i, secondColor)) {
              rowPoints[x] += -4
            }
            this.board.colHeight[x]--;
            secondPlayDisc.color = 'white';
          }
        }
        this.board.colHeight[i]--;
        firstPlayDisc.color = 'white';
      }

    }


    let returnCol;

    if (rowPoints.every((val, i, arr) => val === arr[0])) {
      returnCol = this.calculateX();
    } else {
      returnCol = rowPoints.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
    }

    if (returnCol > 7)
      returnCol = (returnCol - 10) / 100

    while (!this.canPlay(returnCol)) {
      if (this.board.isBoardFull())
        break;
      else
        returnCol = (this.calculateX() - 10) / 100;
    }
    return returnCol;
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
      let ret = this.checkWinner(color)
      return ret;
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