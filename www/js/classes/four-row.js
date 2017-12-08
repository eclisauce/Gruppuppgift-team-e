class FourInALow {
  constructor() {
    this.discFactory();
    this.render();
    this.scale();
    this.turn = 'yellow';
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
    ${discHtml.join()}
    </svg>
    `
    $('#board').html(board);
  }

  putDisc(element, color) {
    let playColumn = $("[cx=" + element[0].cx.baseVal.value + "]");
    for (let i = 0; i < 6; i++) {
      if (playColumn[i].className.baseVal != "") {
        $($("[cx=" + element[0].cx.baseVal.value + "][cy=" + (50 + (100 * (i - 1))) + "]")).addClass(`${color}`);
        break;
      } else if (i == 5) {
        $($("[cx=" + element[0].cx.baseVal.value + "][cy=" + (50 + (100 * (i))) + "]")).addClass(`${color}`);
        break;
      }
    }
  }

  scale() {
    let orgW = 700, orgH = 600;
    let w = $(window).width();
    let h = $(window).height();
    w -= 20 * 2;
    const wScale = w / orgW;
    const hScale = h / orgH;
    let scaling = Math.min(wScale, hScale);
    scaling = (scaling >= 1) ? 1 : scaling;
    $('#board').width(orgW * scaling);
    $('#board').height(orgH * scaling);
    $('svg').width(orgW * scaling);
    $('svg').height(orgH * scaling);
    $('rect').css('transform', `scale(${scaling})`);
    $('circle').css('transform', `scale(${scaling})`);
  }

  changeTurn() {
    this.turn = (this.turn === 'yellow') ? 'red' : 'yellow';
  }

  getCurrentTurn() {
    return this.turn;
  }

  isClickable(element) {
    if ($(element).hasClass('yellow') || $(element).hasClass('red')) {
      return false;
    } else {
      return true;
    }
  }
}