export class Triangle {
  constructor() {
    this.points = [];
    this.divWidth = 16;
    this.divHeight = 9;
    this.blockNum = this.divWidth * this.divHeight;
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.widthSize = width / this.divWidth;
    this.heightSize = height / this.divHeight;

    for (let i = 0; i < this.blockNum; i++) {
      this.points.push([
        (i % this.divWidth) * this.widthSize + Math.floor(Math.random() * this.widthSize),
        Math.floor(i / this.divWidth) * this.heightSize + Math.floor(Math.random() * this.heightSize),
      ]);
    }
  }

  animate(ctx) {
    ctx.strokeStyle = 'black';
    for (let i = 0; i < this.width; i += this.widthSize) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, this.height);
      ctx.stroke();
    }
    for (let i = 0; i < this.width; i += this.heightSize) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(this.width, i);
      ctx.stroke();
    }
    for (let i = 0; i < this.blockNum; i++) {
      ctx.beginPath();
      ctx.arc(this.points[i][0], this.points[i][1], 5, 0, Math.PI * 2);
      ctx.fillStyle = '#0F0';
      ctx.fill();
    }
    this.delaunay = d3.Delaunay.from(this.points);
    ctx.strokeStyle = '#F00';
    for (let i = 0; i < this.blockNum * 1.9; i++) {
      this.triangles = this.delaunay.trianglePolygon(i);
      console.log(i, this.triangles[0][0]);

      ctx.beginPath();
      ctx.moveTo(this.triangles[0][0], this.triangles[0][1]);
      ctx.lineTo(this.triangles[1][0], this.triangles[1][1]);
      ctx.lineTo(this.triangles[2][0], this.triangles[2][1]);
      ctx.stroke();
    }
  }
}
