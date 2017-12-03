const game = new FourInALow();

$(document).on('click', 'rect', function(){
  const targetCircle = $(this).siblings('circle');
  const color = game.getCurrentTurn();
  game.putDisc(targetCircle, color);
  game.changeTurn();
});

