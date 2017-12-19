class Game extends Base {
  constructor() {
    super();
    this.board = new Board(this);
    this.player1;
    this.player2;
    this.htmlTemplateInputForms();
    this.eventHandlers();
  }

  decidePlayerPicture(player) {
    let picLink;
    if (player instanceof HumanPlayer) {
      picLink = '/imgs/players/human.png';
    } else {
      picLink = '/imgs/players/cp.png';
    }
    return picLink
  }

  decideRandomName(type) {
    let nameArr = [];
    if (type == "human") {
      nameArr = ["John Doe", "Sgt Nuke", "Skywalker", "Groot", "Batman", "John Doe", "The Dude", "James Bond", "Gandalf", "Yoda", "E.T", "Wolverine"];
    } else {
      nameArr = ["C-3PO", "R2-D2", "T-800", "Skynet", "Ro-Man", "Roy Batty", "Gort", "The Tin Man", "Data", "The Borg", "Marvin", "Ultron", "Fembots"];
    }
    let rndNum = Math.floor(Math.random() * nameArr.length);
    let name = nameArr[rndNum];
    return name;
  }

  startGameSession(player1, player2) {
    // Checking if human or cp
    if (player1.p1Type === 'human') {
      this.player1 = new HumanPlayer(player1.p1Name, 'yellow', player1.p1Type);
    } else {
      this.player1 = new ComputerPlayer(player1.p1Name, 'yellow', player1.p1Type);
    }

    if (player2.p2Type === 'human') {
      this.player2 = new HumanPlayer(player2.p2Name, 'red', player2.p2Type);
    } else {
      this.player2 = new ComputerPlayer(player2.p2Name, 'red', player2.p2Type);
    }
    this.htmlTemplateBase();
    this.board.renderBoard();
    this.board.setupPlayers();
    // This should probably be a callback function instead!
    if (game.board.player1 instanceof ComputerPlayer) {
      game.board.player1.makeMove();
    }else{
      this.board.toggleActiveBoard(true);
    }
  }

  eventHandlers() {
    let that = this;
    $(document).on('click', '#startbutton', function () {
      let p1Type = $('#p1type').val();
      let p2Type = $('#p2type').val();
      let p1Name = $('#player1').val() ? $('#player1').val() : that.decideRandomName(p1Type);
      let p2Name = $('#player2').val() ? $('#player2').val() : that.decideRandomName(p2Type);

      // Sending objects instead of double inparemters.
      let player1 = {
        p1Name,
        p1Type
      };
      let player2 = {
        p2Name,
        p2Type
      };
      that.startGameSession(player1, player2);
    });

    $(document).on('click','.checkMeBeforeLeave', function () {
      // Removes everything from the modal div. To be able to append again.
      $('#rendermodalhere').empty();
      let clickedElement = ($(this).attr('getHref'));
      // Checks if board is initiated
      if (that.board.player1){
        if (clickedElement === '/gamerules') {
          that.board.showGameRules();
        } else if (clickedElement === '/highscore') {
          that.board.showHighscore();
        } else {
        that.board.htmlQuitOrNot(clickedElement);
        }
      } else{
        window.location.replace(clickedElement);
      }
    });

    let hoverCircle;
    $(document).on({
      click: function () {
        if (that.board.active) {
          const targetCircle = $(this).siblings('circle');
          if (that.board.isBoardClickable(targetCircle)) {
            const color = that.board.turn;
            that.board.placeDisc(targetCircle, color);
            that.board.toggleActiveBoard(true);
            // that.board.changeCursors()
            that.changeTurn();
            that.board.checkWinner(color);
            that.board.htmlShowDraw();
          }
        }
      },
      mouseenter: function () {
        if (that.board.active) {
          let targetCircle = $(this).siblings('circle');
          let playColumn = (targetCircle[0].cx.baseVal.value - 50) / 100;
          for (let y = 5; y >= 0; y--) {
            if (that.board.places[playColumn][y].color === 'white') {
              hoverCircle = $("circle[cx=" + that.board.places[playColumn][y].cx + "][cy=" + that.board.places[playColumn][y].cy + "]");
              break;
            }
          }
          hoverCircle.addClass((that.board.turn == "yellow" ? "hoverYellow" : "hoverRed"));
        }
      },
      mouseleave: function () {
        if (that.board.active) {
          hoverCircle.removeClass(("hoverYellow hoverRed"));
        }
      }
    }, 'rect');
  }

  changeTurn() {
    if (this.board.turn === this.player1.color) {
      this.board.turn = this.player2.color;
      this.player1.score++;
      if (this.player2 instanceof ComputerPlayer) {
        this.board.toggleActiveBoard(false);
        // this.changeCursors()
        this.player2.makeMove();
      }
    } else {
      this.board.turn = this.player1.color;
      this.player2.score++;
      if (this.player1 instanceof ComputerPlayer) {
        this.board.toggleActiveBoard(false);
        // this.changeCursors()
        this.player1.makeMove();
      }
    }
  }

  renderBase() {
    let player1Pic = this.decidePlayerPicture(this.player1);
    let player2Pic = this.decidePlayerPicture(this.player2);

    $('main').html(`

      <div class="d-flex flex-column flex-md-row justify-content-around col-12 showplayersscale">
        <div class="bg-warning text-white playerFont text-center p-0 pt-1 mr-md-5 col-md-5 d-flex flex-row-reverse flex-md-row">
          <div class="d-flex col-9 p-0 justify-content-center"><h2 class="align-self-center mr-3 ml-md-3 ml-lg-5">${this.player1.name}</h2></div>
          <div class="align-self-end col-3 mr-auto"><img class="img-fluid" src="${this.decidePlayerPicture(this.player1)}"></div>
        </div>
        <h1 class="d-none d-md-inline-block align-self-center playerFont">VS</h1>
        <div class="bg-danger text-white playerFont text-center p-0 pt-1 ml-md-5 col-md-5 d-flex flex-row flex-md-row-reverse">
          <div class="d-flex col-9 p-0 justify-content-center"><h2 class="align-self-center ml-3 mr-lg-5">${this.player2.name}</h2></div>
          <div class="align-self-end col-3 ml-auto"><img class="img-fluid player2pic" src="${this.decidePlayerPicture(this.player2)}"></div>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-12">
          <div id="board-holder">
            <div id="board"></div>
          </div>
        </div>
      </div>
      <div class="row justify-content-center quitbuttonscale">
        <div class="col-8 mt-4">
          <button id="newgamebtn" class="btn btn-danger btn-lg btn-block checkMeBeforeLeave whereto="/play"">Avsluta spel</button>
        </div>
      </div>

      <div id="rendermodalhere"></div>
        `);
  }

  htmlTemplateInputForms() {
    this.renderHTML(`
      <h1>Spela 4 i Rad</h1>
        <div class="row playerone pt-5">
          <h4 class="col-12">Spelare 1:</h4>
          <div class="form-group col-7 col-md-5 col-lg-4 pr-0">
            <input type="text" maxlength="10" class="form-control" id="player1" placeholder="Ange spelare 1">
          </div>
          <div class="col-5 col-md-3 col-lg-2 pr-1">
            <select id="p1type" class="custom-select bg-warning text-dark">
              <option value="human" selected>Människa</option>
              <option value="cp">Dator</option>
            </select>
          </div>
        </div>
        <div class="row playerone pt-2">
          <h4 class="col-12">Spelare 2:</h4>
          <div class="form-group col-7 col-md-5 col-lg-4 pr-0">
            <input type="text" maxlength="10" class="form-control" id="player2" placeholder="Ange spelare 2">
          </div>
          <div class="col-5 col-md-3 col-lg-2 pr-1">
            <select id="p2type" class="custom-select bg-danger text-white">
              <option value="human" selected>Människa</option>
              <option value="cp">Dator</option>
            </select>
          </div>
        </div>
        <div class="row mt-3 mb-5">
          <div class="col-12">
            <a id="startbutton" class="btn btn-success btn-lg" href="#l" role="button">Starta spel</a>
          </div>
        </div>
      `);
  }
}
