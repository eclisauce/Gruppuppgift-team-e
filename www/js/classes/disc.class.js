class Disc {
  constructor(cx, cy) {
    this.color = 'white';
    this.cx = cx;
    this.cy = cy;
    const r = 40;
    this.htmlTemplate = this.discHtmlTemplate(cx, cy, r);
    this.imgTemplate = this.boardImageTemplate(cx, cy);
  }

  discHtmlTemplate(cx, cy, r) {
    const x = cx - r;
    const y = cy - r;
    return `
    <g>
      <circle cx="${cx}" cy="${cy}" r="${r}" stroke="grey" stroke-width="3" />
      <rect class="btn" x="${x}" y="${y}" width="${r * 2}" height="${r * 2}" />
    </g>
    `
  }
  boardImageTemplate(cx, cy) {
    return `
      <image width="102" height="102" x="${cx-50-1}" y="${cy-50-1}" href="/imgs/rectBG.svg"></image>
    `
  }
}