export class Dot {
  constructor(imgData, width, height) {
    this.imgData = imgData;
    this.points = [];
    this.isPoints = Array.from(Array(height), () => new Array(width));

    this.width = width;
    this.height = height;

    let index = 0;

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
        if (color.size + (nullColor ? 1 : 0) >= 3) {
          this.points.push([i, j]);
          this.isPoints[j][i] = true;
        } else this.isPoints[j][i] = false;
      }
    }

    for (let i = 0; i < this.points.length; i++) {
      if (!this.nonMaximalSuppression(this.points[i])) {
        this.points.splice(i, 1);
        i--;
      }
    }
  }

  nonMaximalSuppression(point) {
    const [x, y] = point;
    const s = [5, 4, 4, 3, 1];
    for (let i = 0; i < 5 && y - i >= 0; i++) {
      for (let j = 0; j < s[i] && x - j >= 0; j++) {
        if (!(i == 0 && j == 0) && this.isPoints[y - i][x - j]) return false;
      }
    }
    return true;
  }
}
