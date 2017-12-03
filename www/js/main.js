const game = new FourInALow();

$(document).on('click', 'rect', function(){
  const targetCircle = $(this).siblings('circle');
  game.putDisc(targetCircle, 'yellow');
});

