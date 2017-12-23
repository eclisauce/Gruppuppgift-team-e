class Board extends Base {
  constructor(game) {
    super();
    this.createBoard();
    this.active = false;
    this.game = game;
    this.highscore = new Highscore();
    this.gameOver;
    this.players1;
    this.players2;
    this.turn;
    this.colHeight = new Array(7).fill(0);
  }

  setupPlayers() {
    this.player1 = this.game.player1;
    this.player2 = this.game.player2;
    this.turn = this.player1.color;
  }

  changeCursors() {
    if (this.active === true) {
      $('rect').css('cursor', 'pointer');
    } else if (this.active === false) {
      $('rect').css('cursor', 'default');
    }
  }

  toggleActiveBoard(on) {
    this.active = on;
    this.changeCursors();
  }

  setGameOver() {
    this.toggleActiveBoard(false);
    this.gameOver = true;
  }

  createBoard() {
    this.places = new Array(7);
    for (let i = 0; i < 7; i++) {
      this.places[i] = new Array(6);
    }

    for (let i = 0, cx = 50; i < 7; i++) {
      for (let j = 0, cy = 50; j < 6; j++) {
        this.places[i][j] = new Disc(cx, cy);
        cy += 100;
      }
      cx += 100;
    }
  }

  renderBoard() {
    let discHtml = [];
    let boardImagesHtml = [];
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 6; j++) {
        discHtml.push(this.places[i][j].htmlTemplate);
        boardImagesHtml.push(this.places[i][j].imgTemplate);
      }
    }
    const board = `
    <svg class="bg-primary" xmlns="http://www.w3.org/2000/svg" version="1.1">
    ${discHtml.join("")}
      <g id="boardImages">
      ${boardImagesHtml.join("")}
      </g>
    </svg>
    `
    this.renderHTML(board, 'board');
    this.scaleBoard();

    if (!this.isBoardFullyVisible($('#board'))) {
      $('html, body').animate({
        scrollTop: ($('#board').offset().top - 20 - `${$('.showplayersscale').height()}`)
      }, 500);
    }
  }

  isBoardFullyVisible(element) {
    return element.isOnScreen(function (ele) {
      return ele.top >= this.height() &&
        ele.bottom >= this.height() &&
        ele.left >= this.width() &&
        ele.right >= this.width()
    });
  }

  placeDisc(element, color) {
    let playColumn = (element[0].cx.baseVal.value - 50) / 100;
    for (let y = 5; y >= 0; y--) {
      if (this.places[playColumn][y].color === 'white') {
        this.places[playColumn][y].color = color;
        let circle = $("circle[cx=" + this.places[playColumn][y].cx + "][cy=" + this.places[playColumn][y].cy + "]");
        let newCircle = circle.clone()
        this.colHeight[playColumn]++;
        newCircle.attr('cy', 50)
        newCircle.removeClass();
        newCircle.addClass(color);
        newCircle.appendTo(circle.parent());
        newCircle.animate({
          cy: this.places[playColumn][y].cy
        }, (this.places[playColumn][y].cy - 50), function () {
          circle.remove();
        });
        newCircle.attr('cy', this.places[playColumn][y].cy)
        break;
      }
    }

  }

  scaleBoard() {
    let orgW = 700,
      orgH = 600;
    let w = $(window).width() - $("#board").offset().left;
    let h = $(window).height();
    w -= 20 * 2;
    h -= (20 * 2) + $('.showplayersscale').height() + $('.quitbuttonscale').height();
    const wScale = w / orgW;
    const hScale = h / orgH;
    let scaling = Math.min(wScale, hScale);

    $('#board').css('transform', `scale(${scaling})`);
    $('#board-holder').width(orgW * scaling);
    $('#board-holder').height(orgH * scaling);
  }

  isBoardClickable(element) {
    if (!this.active) {
      return false;
    }

    if ($(element).hasClass('yellow') || $(element).hasClass('red')) {
      return false;
    } else {
      return true;
    }
  }

  checkWinner(color) {
    return (
      this.checkForInRow(color) ||
      this.checkForInColumn(color) ||
      this.checkForInDiagonal1(color) ||
      this.checkForInDiagonal2(color)
    );
  }

  checkForInRow(color) {
    let count = 0;
    for (let originX = 0; originX < 4; originX++) {
      for (let originY = 0; originY < 6; originY++) {
        count = 0;
        for (let i = 0; i < 4; i++) {
          if (this.places[originX + i][originY].color === color) {
            count++;
            if (count === 4 && this.player1.color === color) {
              this.htmlShowWinner(this.player1.name, this.player1.score);
              this.highscore.checkIfNewHighscore(this.player1);
              this.setGameOver();
              return true;
            } else if (count === 4 && this.player2.color === color) {
              this.htmlShowWinner(this.player2.name, this.player2.score);
              this.highscore.checkIfNewHighscore(this.player2);
              this.setGameOver();
              return true;
            }
          } else {
            break;
          }
        }
      }
    }
    return false;
  }

  checkForInColumn(color) {
    let count = 0;
    for (let originX = 0; originX < 7; originX++) {
      for (let originY = 0; originY < 3; originY++) {
        count = 0;
        for (let i = 0; i < 4; i++) {
          if (this.places[originX][originY + i].color === color) {
            count++;
            if (count === 4 && this.player1.color === color) {
              this.htmlShowWinner(this.player1.name, this.player1.score);
              this.highscore.checkIfNewHighscore(this.player1);
              this.setGameOver();
              return true;
            } else if (count === 4 && this.player2.color === color) {
              this.htmlShowWinner(this.player2.name, this.player2.score);
              this.highscore.checkIfNewHighscore(this.player2);
              this.setGameOver();
              return true;
            }
          } else {
            break;
          }
        }
      }
    }
    return false;
  }

  checkForInDiagonal1(color) {
    let count = 0;
    for (let originX = 0; originX < 4; originX++) {
      for (let originY = 0; originY < 3; originY++) {
        count = 0;
        for (let i = 0; i < 4; i++) {
          if (this.places[originX + i][originY + i].color === color) {
            count++;
            if (count === 4 && this.player1.color === color) {
              this.htmlShowWinner(this.player1.name, this.player1.score);
              this.highscore.checkIfNewHighscore(this.player1);
              this.setGameOver();
              return true;
            } else if (count === 4 && this.player2.color === color) {
              this.htmlShowWinner(this.player2.name, this.player2.score);
              this.highscore.checkIfNewHighscore(this.player2);
              this.setGameOver();
              return true;
            }
          } else {
            break;
          }
        }
      }
    }
    return false;
  }

  checkForInDiagonal2(color) {
    let count = 0;
    for (let originX = 3; originX < 7; originX++) {
      for (let originY = 0; originY < 3; originY++) {
        count = 0;
        for (let i = 0; i < 4; i++) {
          if (this.places[originX - i][originY + i].color === color) {
            count++;
            if (count === 4 && this.player1.color === color) {
              this.htmlShowWinner(this.player1.name, this.player1.score);
              this.highscore.checkIfNewHighscore(this.player1);
              this.setGameOver();
              return true;
            } else if (count === 4 && this.player2.color === color) {
              this.htmlShowWinner(this.player2.name, this.player2.score);
              this.highscore.checkIfNewHighscore(this.player2);
              this.setGameOver();
              return true;
            }
          } else {
            break;
          }
        }
      }
    }
    return false;
  }

  isBoardFull() {
    for (let i = 0; i < 7; i++) {
      if (this.places[i][0].color == 'white') {
        return false;
      }
    }
    this.setGameOver();
    return true;
  }

  htmlShowWinner(name, score) {
    this.renderHTML(`
      <!-- Modal -->
      <div class="modal fade" id="winnerModal" tabindex="-1" role="dialog" aria-labelledby="winnerModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="winnerModalLabel">Vinnaren är</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true"><i class="fa fa-times" aria-hidden="true"></i></span>
              </button>
            </div>
            <div class="modal-body h2">
            <p>Vinnare: ${name}</p>
              <p>Poäng: ${score}</p>
            </div>
            <div class="modal-footer">
              <a class="btn btn-secondary" href="/play">Starta ett nytt spel</>
              <a class="btn btn-large btn-info btn-danger" href="/highscore">Till Highscore</a>
            </div>
          </div>
        </div>
      </div>
    `, 'modal');

    $('#winnerModal').modal('show');
  }

  htmlShowDraw() {
    if (this.isBoardFull()) {
      this.renderHTML(`
        <!-- Modal -->
        <div class="modal fade" id="drawModal" tabindex="-1" role="dialog" aria-labelledby="drawModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="drawModalLabel">Oavgjort!</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true"><i class="fa fa-times" aria-hidden="true"></i></span>
                </button>
              </div>
              <div class="modal-body h3">
                <p>Ni spelade slut på alla brickor.</p>
                <p>Det blev oavgjort!</p>
              </div>
              <div class="modal-footer">
                <a class="btn btn-secondary" href="/play">Starta ett nytt spel</>
                <a class="btn btn-large btn-info btn-danger" href="/highscore">Till Highscore</a>
              </div>
            </div>
          </div>
        </div>
    `, 'modal');
      $('#drawModal').modal('show');
    }
  }

  htmlQuitOrNot(clickedLink) {
    this.renderHTML(`
      <!-- Modal -->
      <div class="modal fade" id="quitOrNotModal" tabindex="-1" role="dialog" aria-labelledby="quitOrNotModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="quitOrNotModal">Avsluta spel</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true"><i class="fa fa-times" aria-hidden="true"></i></span>
              </button>
            </div>
            <div class="modal-body">
              <p>Är du säker på du vill avsluta pågående spel?</p>
            </div>
            <div class="modal-footer">
              <a class="btn btn-danger" href="${clickedLink}">Avsluta</>
              <a class="btn btn-success text-light" data-dismiss="modal" aria-label="Close">Tillbaka till spelet</a>
            </div>
          </div>
        </div>
      </div>
        `, 'modal');
    $('#quitOrNotModal').modal('show');
  }

  htmlShowGameRules() {
    this.renderHTML(`
        <!-- Modal -->
        <div class="modal fade" id="gamerules" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title" id="exampleModalLabel">Spelregler</h4>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true"><i class="fa fa-times" aria-hidden="true"></i></span>
                </button>
              </div>
              <div class="modal-body">
                  <h5 class="font-weight-bold">För vem?</h5>
                  <p>Spel för 2 spelare</p>
                  <h5 class="mt-2 font-weight-bold">Vem kan vinna?</h5>
                  <p>Den som först får fyra av sina brickor i rad vinner.
                    Du får placera dina brickor vertikalt, horisontellt eller diagonalt!</p>
                  <h5 class="mt-2 font-weight-bold">Hur spelar man?</h5>
                  <ul>
                    <li>Välj en färg av de två färgerna (gul och röd).</li>
                    <li>Varannan omgång lägger deltagarna en bricka i spelbrädet.</li>
                    <li>Lägg i första bricka i vilken öppning som helst på spelbrädet.</li>
                    <li>Spelarna turas om att placera en bricka per drag.</li>
                    <li>Första spelaren som placerar fyra brickor i rad vinner.</li>
                  </ul>
              </div>
              <div class="modal-footer">
                <a class="btn btn-success text-light" data-dismiss="modal" aria-label="Close">Tillbaka till spelet</a>
              </div>
            </div>
          </div>
        </div>
          `, 'modal');
    $('#gamerules').modal('show');
  }

  htmlShowHighscore() {
    this.renderHTML(`
        <!-- Modal -->
        <div class="modal fade" id="highscoremodal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title" id="exampleModalLabel">Highscore</h4>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true"><i class="fa fa-times" aria-hidden="true"></i></span>
                </button>
              </div>
              <div class="modal-body">
                <section class="container">
                  <div id="highscore" class="row">
                  </div>
                </section>
              </div>
              <div class="modal-footer">
                <a class="btn btn-success text-light" data-dismiss="modal" aria-label="Close">Tillbaka till spelet</a>
              </div>
            </div>
          </div>
        </div>
          `, 'modal');
    this.highscore.loadAndRenderHighscore()
    $('#highscoremodal').modal('show');
  }
}