class Board {
  constructor() {
    this.discFactory();
    this.turn = 'yellow';
    this.active = false;
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
    $('#board').html(board);
    this.scale();
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
        newCircle.animate({cy:this.places[playColumn][y].cy},500, function(){
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
    h -= 20 * 2;
    const wScale = w / orgW;
    const hScale = h / orgH;
    let scaling = Math.min(wScale, hScale);

    $('#board').css('transform', `scale(${scaling})`);
    $('#board-holder').width(orgW * scaling);
    $('#board-holder').height(orgH * scaling);
  }

  changeTurn() {
    this.turn = (this.turn === 'yellow') ? 'red' : 'yellow';
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

  checkForInRow(color) {
    let count = 0;
    for (let originX = 0; originX < 4; originX++) {
      for (let originY = 0; originY < 6; originY++) {
        count = 0;
        for (let i = 0; i < 4; i++) {
          if (this.places[originX + i][originY].color === color) {
            count++;
            if (count === 4) {
              // todo:temporary implementation
              window.alert('win row');
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
            if (count === 4) {
              // todo:temporary implementation
              window.alert('win column');
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
            if (count === 4) {
              // todo:temporary implementation
              window.alert('win diagonal1');
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
            if (count === 4) {
              // todo:temporary implementation
              window.alert('win diagonal2');
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
