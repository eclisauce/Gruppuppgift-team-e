class Game {
    constructor() {
        this.board = new Board();
        this.player1;
        this.player2;
        this.renderInputForms();
        this.myButtons();
    }

    renderInputForms(){
      $('main').html(`
      <div id="myformhide"> <!-- this is the div that hides -->
        <div class="row playerone pt-5">
          <div class="col-12">
            <div class="form-group">
              <input type="text" class="form-control" id="player1" placeholder="Ange spelare 1">
            </div>
          </div>
        </div>

        <div class="row playertwo">
          <div class="col-12">
            <div class="form-group">
              <input type="text" class="form-control" id="player2" placeholder="Ange spelare 2">
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
              <a id="startbutton" class="btn btn-success btn-lg" href="#l" role="button">Starta spel</a>
          </div>
        </div>
      </div>
      `);
    }

    myButtons(){
      let that = this;
      $('#startbutton').on('click', function(){
        let player1 = $('#player1').val();
        let player2 = $('#player2').val();
        $('main').html(`
          <div class="col-12">
            <div id="board-holder">
              <div id="board"></div>
            </div>
          </div>
          `);
        that.startGameSession(player1, player2);
        that.board.activate(true);
      })
    }

    startGameSession(player1Name, player2Name) {
        this.player1 = new Player(player1Name, 'yellow');
        this.player2 = new Player(player2Name, 'red');
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
