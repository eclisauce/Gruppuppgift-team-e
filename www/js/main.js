$(document).on('click', 'rect', function(){
  const targetCircle = $(this).siblings('circle');
  if (game.isClickable(targetCircle)) {
    const color = game.getCurrentTurn();
    game.putDisc(targetCircle, color);
    game.changeTurn();
    game.checkWinner(color);
    game.isFullBoard();
  }
});

$('#mystartbutton').on('click', function(){
  $('#myformhide').addClass('d-none').removeClass('d-block');
  $('#mygamehide').addClass('d-block').removeClass('d-none');
  game.activate(true);
})

$('#myquitbutton').on('click', function(){
  $('#myformhide').addClass('d-block').removeClass('d-none');
  $('#mygamehide').addClass('d-none').removeClass('d-block');
  game.activate(false);
})

function footerFix(){
  let height = $('footer').height() + 40;
  $('body').css({marginBottom: height});
}

footerFix();

$(window).on('resize',function(){
  footerFix();
});
