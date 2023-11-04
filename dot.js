export class Dot {
  constructor(imgData, width, height) {
    this.imgData = imgData;
    this.points = [];

    this.width = width;
    this.height = height;

    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        const color = new Set();
        let nullColor = false;

        for (let k = i - 1; k <= i + 1; k++) {
          for (let l = j - 1; l <= j + 1; l++) {
            if (!nullColor && (k < 0 || k > this.width || l < 0 || l > this.height)) nullColor = true;
            else
              color.add(
                JSON.stringify([
                  this.imgData[(k + l * this.width) * 4],
                  this.imgData[(k + l * this.width) * 4 + 1],
                  this.imgData[(k + l * this.width) * 4 + 2],
                ])
              );
          }
        }
        if (color.size + (nullColor ? 1 : 0) >= 3) this.points.push([i, j]);
      }
    }
  }
}
