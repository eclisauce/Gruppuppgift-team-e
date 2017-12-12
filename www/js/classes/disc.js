class Disc {
  constructor(cx, cy) {
    this.color = 'white';
    this.cx = cx;
    this.cy = cy;
    const r = 40;
    this.htmlTemplate = this.discHtmlTemplate(cx, cy, r);
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
}