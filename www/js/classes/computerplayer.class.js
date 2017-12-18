class ComputerPlayer extends Player {

  // Method for random number on drop
  calculateX(){
    let rnd = Math.floor(Math.random() * 7);
    rnd += "10";
    rnd = parseInt(rnd);
    return rnd;
  }

  // Method for random number time delay.
  randomTime(){
    let rnd = Math.floor(Math.random() * 1500) + 600;
    return rnd;
  }

  isClickableComputer(element){
    if ($(element).hasClass('yellow') || $(element).hasClass('red')) {
      return false;
    } else {
      return true;
    }
  }
  // Checking if full column, then take another random until it's possible to
  // put the disc somewhere
  randomPlaceADisc(){
    let clickThis;
    while(true) {
      clickThis = $(`rect[x="${this.calculateX()}"][y="${10}"]`);
      let checkFull = clickThis.siblings('circle');
      if (game.board.isFullBoard()) {
        break;
      }
      else if (game.board.gameOver === true) {
        break;
      }
      else if (this.isClickableComputer(checkFull)) {
        game.board.activate(true);
        clickThis.trigger('click');
        break;
      }
    }
  }
}
