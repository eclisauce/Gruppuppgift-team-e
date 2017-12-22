class ComputerPlayer extends Player {

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
    let clickThis;
    while (true) {
      clickThis = $(`rect[x="${this.calculateX()}"][y="${10}"]`);
      let checkFull = clickThis.siblings('circle');
      if (game.board.isBoardFull()) {
        break;
      } else if (game.board.gameOver === true) {
        break;
      } else if (this.isBoardClickableComputer(checkFull)) {
        game.board.toggleActiveBoard(true);
        clickThis.trigger('click');
        break;
      }
    }
  }
}
