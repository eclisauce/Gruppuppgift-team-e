const game = new FourInALow();

$(document).on('click', 'rect', function(){
  const targetCircle = $(this).siblings('circle');
  if (game.isClickable(targetCircle)) {
    const color = game.getCurrentTurn();
    game.putDisc(targetCircle, color);
    game.changeTurn();
  }
});

// Footerfix
var height = $('footer').height() + 30;
$('body').css({marginBottom: height});
$(window).on('resize',function(){location.reload();});
