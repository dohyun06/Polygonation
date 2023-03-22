export class Color {
  constructor(width, height, triangle, imgData) {
    this.stageWidth = width;
    this.stageHeight = height;

    this.triangle = triangle;

    this.minX = Math.min(triangle[0][0], triangle[1][0], triangle[2][0]);
    this.minY = Math.min(triangle[0][1], triangle[1][1], triangle[2][1]);
    this.maxX = Math.max(triangle[0][0], triangle[1][0], triangle[2][0]);
    this.maxY = Math.max(triangle[0][1], triangle[1][1], triangle[2][1]);

    this.imgData = imgData;

    this.setColor();
  }

  setColor() {
    let r = 0;
    let g = 0;
    let b = 0;
    let count = 0;

    for (let i = this.minX < 0 ? 0 : Math.floor(this.minX); i < (this.maxX > this.stageWidth ? this.stageWidth : this.maxX); i++) {
      for (let j = this.minY < 0 ? 0 : Math.floor(this.minY); j < (this.maxY > this.stageHeight ? this.stageHeight : this.maxY); j++) {
        if (this.checkTriangle(i, j)) {
          const pixelIndex = (i + j * this.stageWidth) * 4;

          r += this.imgData.data[pixelIndex + 0];
          g += this.imgData.data[pixelIndex + 1];
          b += this.imgData.data[pixelIndex + 2];
          count++;
        }
      }
    }
    this.color = [r / count, g / count, b / count];
  }

  checkTriangle(x, y) {
    return (
      this.calTriangle(this.triangle[0], this.triangle[1], this.triangle[2]) -
        this.calTriangle([x, y], this.triangle[1], this.triangle[2]) -
        this.calTriangle(this.triangle[0], [x, y], this.triangle[2]) -
        this.calTriangle(this.triangle[0], this.triangle[1], [x, y]) <
      0.1
    );
  }

  calTriangle(triangle1, triangle2, triangle3) {
    const base = Math.sqrt((triangle2[0] - triangle1[0]) ** 2 + (triangle2[1] - triangle1[1]) ** 2);
    const height = Math.abs((triangle3[0] - triangle1[0]) * (triangle2[1] - triangle1[1]) - (triangle2[0] - triangle1[0]) * (triangle3[1] - triangle1[1])) / base;
    return (base * height) / 2;
  }
}
