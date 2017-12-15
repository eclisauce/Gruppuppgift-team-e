let game = new Game();
$(window).resize(game.board.scale);
$(document).on('click','#newGameBtn', function(){
	game = new Game();
})