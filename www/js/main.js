const game = new FourInALow();

$(document).on('click', 'rect', function(){
  const targetCircle = $(this).siblings('circle');
  if (game.isClickable(targetCircle)) {
    const color = game.getCurrentTurn();
    game.putDisc(targetCircle, color);
    game.changeTurn();
  }
});

