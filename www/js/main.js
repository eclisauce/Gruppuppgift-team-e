
  let game = new Game();

  $(window).resize(game.board.scale);



$('#mystartbutton').on('click', function(){
  $('#myformhide').addClass('d-none').removeClass('d-block');
  $('#mygamehide').addClass('d-block').removeClass('d-none');
  game.board.activate(true);
})

$('#myquitbutton').on('click', function(){
  $('#myformhide').addClass('d-block').removeClass('d-none');
  $('#mygamehide').addClass('d-none').removeClass('d-block');
  game.board.activate(false);
})

function footerFix(){
  let height = $('footer').height() + 40;
  $('body').css({marginBottom: height});
}

footerFix();

$(window).on('resize',function(){
  footerFix();
});
