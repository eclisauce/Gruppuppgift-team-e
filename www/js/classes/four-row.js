class FourInALow {
  constructor() {
    this.render();
    this.turn = 'yellow';
    this.places = [];
  }

  render(el) {
    this.places = new Array(7);
    for (let i = 0; i < 7; i++) {
      this.places[i] = new Array(6);
    }

    for (let i = 0, cx = 50; i < 7; i++) {
      for (let j = 0, cy = 50; j < 6; j++) {
        this.places[i][j] = this.placeTemplate(cx, cy);
        cy += 100;
      }
      cx += 100;
    }
    const board = `
    <svg class="bg-secondary" xmlns="http://www.w3.org/2000/svg" version="1.1">
    ${this.places.join()}
    </svg>
    `
    $('#board').html(board);
  }

  placeTemplate(cx, cy){
    const r = 40;
    const x = cx - r;
    const y = cy - r;
    return `
    <g>
      <circle cx="${cx}" cy="${cy}" r="${r}" stroke="grey" stroke-width="3"  />
      <rect class="btn" x="${x}" y="${y}" width="${r * 2}" height="${r * 2}" />
    </g>
    `
  }

  putDisc(element, color) {
    $(element).addClass(`${color}`);
  }

  changeTurn() {
    this.turn === 'yellow'?  this.turn = 'red' : this.turn = 'yellow';
  }

  getCurrentTurn() {
    return this.turn;
  }

  isClickable(element) {
    if($(element).hasClass('yellow') || $(element).hasClass('red')) {
      return false;
    } else {
      return true;
    }
  }
}
