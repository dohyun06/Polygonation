import { Color } from './color.js';

export class Triangle {
  constructor(ctx, tmpCtx) {
    this.ctx = ctx;
    this.tmpCtx = tmpCtx;

    this.points = [];
    this.triangles = [];
    this.color = [];
    this.density = 10;
    this.divWidth = 16 * this.density;
    this.divHeight = 9 * this.density;
    this.blockNum = (this.divWidth + 2) * (this.divHeight + 2);

    this.isLoaded = false;

    this.image = new Image();
    this.image.src = './img.jpg';
    this.image.onload = () => {
      this.isLoaded = true;
      this.drawImage();
    };
  }

  resize(width, height) {
    this.stageWidth = width;
    this.stageHeight = height;
    this.widthSize = this.stageWidth / this.divWidth;
    this.heightSize = this.stageHeight / this.divHeight;

    for (let i = 0; i < this.blockNum; i++) {
      this.points[i] = [
        ((i % (this.divWidth + 2)) - 1) * this.widthSize + Math.floor(Math.random() * this.widthSize),
        (Math.floor(i / (this.divWidth + 2)) - 1) * this.heightSize + Math.floor(Math.random() * this.heightSize),
      ];
    }
    this.delaunay = d3.Delaunay.from(this.points);
    for (let i = 0; ; i++) {
      if (this.delaunay.trianglePolygon(i)[0][0] === undefined) break;

      this.triangles[i] = this.delaunay.trianglePolygon(i);
    }

    if (this.isLoaded) this.drawImage();
  }

  drawImage() {
    this.tmpCtx.drawImage(this.image, 0, 0, this.image.width, this.image.height, 0, 0, this.stageWidth, this.stageHeight);
    this.imgData = this.tmpCtx.getImageData(0, 0, this.stageWidth, this.stageHeight);

    for (let i = 0; i < this.triangles.length; i++) {
      this.color[i] = new Color(this.stageWidth, this.stageHeight, this.triangles[i], this.imgData);
    }
  }

  animate() {
    /*
    ctx.strokeStyle = 'black';
    for (let i = 0; i < this.stageWidth; i += this.widthSize) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, this.stageHeight);
      ctx.stroke();
    }
    for (let i = 0; i < this.stageWidth; i += this.heightSize) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(this.stageWidth, i);
      ctx.stroke();
    }
    */

    /*
    for (let i = 0; i < this.blockNum; i++) {
      ctx.beginPath();
      ctx.arc(this.points[i][0], this.points[i][1], 5, 0, Math.PI * 2);
      ctx.fillStyle = '#0F0';
      ctx.fill();
    }*/
    /*
    this.ctx.strokeStyle = '#FFF';
    */
    for (let i = 0; i < this.triangles.length; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.triangles[i][0][0], this.triangles[i][0][1]);
      this.ctx.lineTo(this.triangles[i][1][0], this.triangles[i][1][1]);
      this.ctx.lineTo(this.triangles[i][2][0], this.triangles[i][2][1]);
      /*
      this.ctx.stroke();
      */
      if (this.isLoaded === true) {
        this.ctx.fillStyle = `rgb(${this.color[i].color[0]}, ${this.color[i].color[1]}, ${this.color[i].color[2]})`;
        this.ctx.fill();
      }
    }
  }
}
