class Game {
    constructor() {
        this.board = new Board();
        this.player1;
        this.player2;
    }

    startGameSession(player1Name, player2Name) {
        this.player1 = new Player(player1Name, 'yellow');
        this.player2 = new Player(player2Name, 'red')
        this.board.render();
        this.eventHandlers();
    }

    eventHandlers() {
        let that = this;
        $(document).on('click', 'rect', function () {
            const targetCircle = $(this).siblings('circle');
            if (that.board.isClickable(targetCircle)) {
                const color = that.board.getCurrentTurn();
                that.board.putDisc(targetCircle, color);
                that.board.changeTurn();
                that.board.checkWinner(color);
                that.board.isFullBoard();
            }
        });
    }
}