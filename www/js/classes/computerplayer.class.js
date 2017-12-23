class ComputerPlayer extends Player {
  constructor(name, color, type, board) {
    super(name,color,type);
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

  playSeq(string) {
    for (let i = 0; i < string.length; i++) {
      $(`rect[x="${((string[i]-1)*100)+10}"][y="${10}"]`).trigger('click');
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
    let bestColumn;
    let firstPlayDisc;
    let secondPlayDisc;
    let firstRowPoints = new Array(7).fill(0);

    for (let i = 0; i < 7; i++) {
      if (this.canPlay(i)) {
        firstPlayDisc = this.getPlayDisc(i);
        firstPlayDisc.color = currentColor;
        this.board.colHeight[i]++;
        if (this.isWinningMove(i, currentColor))
          firstRowPoints[i] += 20;
        firstPlayDisc.color = secondColor;
        if (this.isWinningMove(i, secondColor))
          firstRowPoints[i] += 20;
        for (let x = 0; x < 7; x++) {
          if (this.canPlay(x)) {
            secondPlayDisc = this.getPlayDisc(x);
            secondPlayDisc.color = secondColor;
            this.board.colHeight[x]++;
            if (this.isWinningMove(x, currentColor))
              firstRowPoints[x] += 6;
            secondPlayDisc.color = secondColor;
            if (this.isWinningMove(x, secondColor))
              firstRowPoints[x] += -2;
            this.board.colHeight[x]--;
            secondPlayDisc.color = 'white';
          }
        }
        this.board.colHeight[i]--;
        firstPlayDisc.color = 'white';
      }
    }

    bestColumn = firstRowPoints.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
    bestColumn = this.getRandomWhenSameIndex(firstRowPoints, firstRowPoints[bestColumn]);

    while (!this.canPlay(bestColumn)) {
      if (this.board.isBoardFull())
        break;
      else
        bestColumn = (this.calculateX() - 10) / 100;
    }
    return bestColumn;
  }

  getRandomWhenSameIndex(array, value) {
    let indexes = []
    let i = -1;
    while ((i = array.indexOf(value, i + 1)) != -1) {
      indexes.push(i);
    }
    let rnd = Math.floor(Math.random() * indexes.length);
    rnd = indexes[rnd];
    return rnd;
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