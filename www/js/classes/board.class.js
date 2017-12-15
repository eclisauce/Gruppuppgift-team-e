class Board {
  // Send the game into board so it knows it's creator.
  // Added highscore to be able to send score.
  constructor(game) {
    this.discFactory();
    this.active = false;
    this.game = game;
    this.highscore = new Highscore;
  }

  // Read players from game and set it to this.player1. Set this.turn to "yellow" by player1.
  setupPlayers(){
    this.player1 = this.game.player1;
    this.player2 = this.game.player2;
    this.turn = this.player1.color;
  }

  activate(on) {
    this.active = on;
  }

  discFactory() {
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

  render() {
    let discHtml = [];
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 6; j++) {
        discHtml.push(this.places[i][j].htmlTemplate);
      }
    }
    const board = `
    <svg class="bg-primary" xmlns="http://www.w3.org/2000/svg" version="1.1">
    ${discHtml.join("")}
    </svg>
    `
    let boardEle = $('#board');
    boardEle.html(board);
    this.scale();

    //check if whole board is visible
    if (!this.isFullyVisible(boardEle)) {
      $('html, body').animate({
        scrollTop: (boardEle.offset().top-20-`${$('.showplayersscale').height()}`)
      }, 500);
    }
  }

  isFullyVisible(element){
    return element.isOnScreen(function (ele) {
      return ele.top >= this.height() &&
        ele.bottom >= this.height() &&
        ele.left >= this.width() &&
        ele.right >= this.width()
    });
  }

  putDisc(element, color) {
    // playColumn is index
    let playColumn = (element[0].cx.baseVal.value - 50) / 100;
    for (let y = 5; y >= 0; y--) {
      if (this.places[playColumn][y].color === 'white') {
        this.places[playColumn][y].color = color;

        //ANIMATION CODE - this part is for animating the disk, dropping it down.
        //just remove this code and use the "TIHOUT ANIATION" to not animate disc.
        let circle = $("circle[cx=" + this.places[playColumn][y].cx + "][cy=" + this.places[playColumn][y].cy + "]");
        let newCircle = circle.clone()
        newCircle.attr('cy', 50)
        newCircle.addClass(color);
        newCircle.appendTo(circle.parent());
        newCircle.animate({
          cy: this.places[playColumn][y].cy
        }, 500, function () {
          circle.remove();
        });
        newCircle.attr('cy', this.places[playColumn][y].cy)
        //END OF ANIMATION

        //WIHOUT ANIMATION - if we wanna remove the animation we use the below code instead.
        //$("circle[cx=" + this.places[playColumn][y].cx + "][cy=" + this.places[playColumn][y].cy + "]").addClass(color);

        break;
      }
    }
  }

  scale() {
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

  // Changed checking to this.player1.color and added +1 score each time.
  // Also changed to big if-statement.
  changeTurn() {
    if (this.turn === this.player1.color) {
        this.turn = this.player2.color;
        this.player1.score++;
    }
    else {
        this.turn = this.player1.color;
        this.player2.score++;
    }
  }

  getCurrentTurn() {
    return this.turn;
  }

  isClickable(element) {
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

  // Added one more if-statement to see if the player-color is the same as color.
  // Now sending two in-paremeters to showWinner, score and name.
  // Same changes in all checks
  // To add into highscore-list just add this to each if-statement:
  // this.highscore.checkNewScore(this.player1);
  checkForInRow(color) {
    let count = 0;
    for (let originX = 0; originX < 4; originX++) {
      for (let originY = 0; originY < 6; originY++) {
        count = 0;
        for (let i = 0; i < 4; i++) {
          if (this.places[originX + i][originY].color === color) {
            count++;
            if (count === 4 && this.player1.color === color) {
              this.showWinner(this.player1.name, this.player1.score);
              // Global function to enable it to keep the JSON.
              // Otherwise new instance every time??
              newScore(this.player1);
              this.activate(false);
              return true;
            }
            else if (count === 4 && this.player2.color === color) {
              this.showWinner(this.player2.name, this.player2.score);
              newScore(this.player2);
              this.activate(false);
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
              this.showWinner(this.player1.name, this.player1.score);
              // Global function to enable it to keep the JSON.
              // Otherwise new instance every time??
              newScore(this.player1);
              this.activate(false);
              return true;
            }
            else if (count === 4 && this.player2.color === color) {
              this.showWinner(this.player2.name, this.player2.score);
              newScore(this.player2);
              this.activate(false);
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
              this.showWinner(this.player1.name, this.player1.score);
              // Global function to enable it to keep the JSON.
              // Otherwise new instance every time??
              newScore(this.player1);
              this.activate(false);
              return true;
            }
            else if (count === 4 && this.player2.color === color) {
              this.showWinner(this.player2.name, this.player2.score);
              newScore(this.player2);
              this.activate(false);
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
              this.showWinner(this.player1.name, this.player1.score);
              // Global function to enable it to keep the JSON.
              // Otherwise new instance every time??
              newScore(this.player1);
              this.activate(false);
              return true;
            }
            else if (count === 4 && this.player2.color === color) {
              this.showWinner(this.player2.name, this.player2.score);
              newScore(this.player2);
              this.activate(false);
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

  // Changed variable color to name and added variable score.
  // Writing out both name and score now.
  showWinner(name, score) {
    $('main').append(`
  <!-- Modal -->
  <div class="modal fade" id="winnerModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Vinnaren är</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true"><i class="fa fa-times" aria-hidden="true"></i></span>
          </button>
        </div>
        <div class="modal-body h1">
          Vinnare: ${name} <br>
          Poäng: ${score}
        </div>
        <div class="modal-footer">
          <a class="btn btn-secondary" href="/play">Starta ett nytt spel</>
          <a class="btn btn-large btn-info btn-danger" href="/highscore">Till Highscore</a>
        </div>
      </div>
    </div>
  </div>
    `);

      $('#winnerModal').modal('show');
  }

  isFullBoard() {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 6; j++) {
        if (this.places[i][j].color === 'white') {
          return false;
        }
      }
    }
    this.activate(false);
    return true;
  }

}
