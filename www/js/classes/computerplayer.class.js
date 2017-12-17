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
    let rnd = Math.floor(Math.random() * 1500) + 200;
    return rnd;
  }

  // Checking if full column, then take another random until it's possible to
  // put the disc somewhere
  randomPlaceADisc(){
    // Why doesnt this mean board here?
    let clickThis;
    while(true) {
      clickThis = $(`rect[x="${this.calculateX()}"][y="${10}"]`);
      let checkFull = clickThis.siblings('circle');
      if (game.board.isClickable(checkFull)) {
        clickThis.trigger('click');
        break;
      }
      else if (game.board.isFullBoard()) {
        break;
      }
      else if (game.board.gameend === true) {
        break;
      }
    }
  }
}
