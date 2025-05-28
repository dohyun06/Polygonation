export class Dot {
  constructor(imgData, width, height) {
    this.imgData = imgData;
    this.points = [];
    this.isPoints = Array.from(Array(height), () => new Array(width));

    this.width = width;
    this.height = height;

    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        const color = new Set();
        let nullColor = false;

        for (let k = i - 1; k <= i + 1; k++) {
          for (let l = j - 1; l <= j + 1; l++) {
            if (k < 0 || k > this.width || l < 0 || l > this.height) nullColor = true;
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
        if (color.size + (nullColor ? 1 : 0) >= 3) {
          this.points.push([i, j]);
          this.isPoints[j][i] = true;
        } else this.isPoints[j][i] = false;
      }
    }

    for (let i = 0; i < this.points.length; i++) {
      if (!this.integrateDots(this.points[i])) {
        this.points.splice(i, 1);
        i--;
      }
    }
  }

  integrateDots(point) {
    const [x, y] = point;
    const s = [7, 7, 7, 6, 6, 5, 3];
    // const s = [5, 5, 5, 4, 3]; r=5
    // const s = [6, 6, 6, 5, 4, 3]; r=6
    // const s = [7, 7, 7, 6, 6, 5, 3]; r=7
    for (let i = 0; i < 7 && y - i >= 0; i++) {
      for (let j = 0; j < s[i] && x - j >= 0 && x + j < this.width; j++) {
        if ((i || j) && (this.isPoints[y - i][x - j] || (i && this.isPoints[y - i][x + j]))) {
          this.isPoints[y][x] = false;
          return false;
        }
      }
    }
    return true;
  }
}
