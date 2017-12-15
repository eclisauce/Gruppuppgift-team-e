class Game {
    constructor() {
        this.board = new Board(this);
        this.player1;
        this.player2;
        this.renderInputForms();
        this.myButtons();
    }

    renderInputForms(){
      $('main').html(`
      <h2>Spela 4 i Rad</h2>
        <div class="row playerone pt-5">
          <h4 class="col-12">Spelare 1:</h4>
          <div class="form-group col-7 col-md-5 col-lg-4 pr-0">
            <input type="text" class="form-control" id="player1" placeholder="Ange spelare 1">
          </div>

          <div class="col-5 col-md-3 col-lg-2 pr-1">
            <button type="button" class="btn btn-warning dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Spelartyp
            </button>
            <div class="dropdown-menu bg-warning">
              <a class="dropdown-item bg-warning" href="#">Människa</a>
              <a class="dropdown-item bg-warning" href="#">Dator</a>
            </div>
          </div>
        </div>

        <div class="row playerone pt-2">
          <h4 class="col-12">Spelare 2:</h4>
          <div class="form-group col-7 col-md-5 col-lg-4 pr-0">
            <input type="text" class="form-control" id="player2" placeholder="Ange spelare 2">
          </div>

          <div class="col-5 col-md-3 col-lg-2 pr-1">
            <button type="button" class="btn btn-danger dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Spelartyp
            </button>
            <div class="dropdown-menu bg-danger text-white">
              <a class="dropdown-item bg-danger text-white" href="#">Människa</a>
              <a class="dropdown-item bg-danger text-white" href="#">Dator</a>
            </div>
          </div>
        </div>

        <div class="row mt-3 mb-5">
          <div class="col-12">
            <a id="startbutton" class="btn btn-success btn-lg" href="#l" role="button">Starta spel</a>
          </div>
        </div>
      `);
    }

    renderBase(){
      $('main').html(`
        <div class="d-flex flex-column flex-lg-row justify-content-around col-12">
          <h3 class="bg-warning py-3 text-white playerFont text-center mr-lg-5 col-lg-4">${this.player1.name}</h3>
          <h1 class="pt-2 playerFont text-center"> VS </h1>
          <h3 class="bg-danger py-3 text-white playerFont text-center ml-lg-5 col-lg-4">${this.player2.name}</h3>
        </div>
        <div class="row mt-3">
        <div class="col-12">
          <div id="board-holder">
            <div id="board"></div>
          </div>
        </div>
        </div>

        <div class="row justify-content-center">
        <div class="col-8 mt-4">
        <button id="newGameBtn" type="button" class="btn btn-danger btn-lg btn-block">Avsluta spel</button>
        </div>
        </div>
        `);
    }

    myButtons(){
      let that = this;
      $('#startbutton').on('click', function(){
        let player1 = $('#player1').val();
        let player2 = $('#player2').val();
        that.startGameSession(player1, player2);
        that.board.activate(true);
      })
    }

    startGameSession(player1Name, player2Name) {
        this.player1 = new Player(player1Name, 'yellow');
        this.player2 = new Player(player2Name, 'red');
        this.renderBase();
        this.board.render();
        this.board.setupPlayers();
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
