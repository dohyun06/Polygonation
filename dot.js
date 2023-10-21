export class Dot {
  constructor(imgData, width, height) {
    this.imgData = [];
    this.points = [];

    this.width = width;
    this.height = height;

    // FIXME : Here is Errrrror
    for (let i = 0; i < imgData.data.length / 3; i++) {
      let r = imgData.data[i * 3] - (imgData.data[i * 3] % 255);
      let g = imgData.data[i * 3 + 1] - (imgData.data[i * 3 + 1] % 255);
      let b = imgData.data[i * 3 + 2] - (imgData.data[i * 3 + 2] % 255);

      this.imgData[i] = [r, g, b];

      console.log(this.imgData[i]);
    }

    /*
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        const color = new Set();
        let nullColor = false;

        for (let k = i - 1; k <= i + 1; k++) {
          for (let l = j - 1; l <= j + 1; l++) {
            if (!nullColor && (k < 0 || k > this.width || l < 0 || l > this.height)) nullColor = true;
            else color.add(this.imgData[k + l * this.width]);
          }
        }
        console.log(color);
        if (color.size + (nullColor ? 1 : 0) >= 3) this.points.push([i, j]);
      }
    }
    */
  }
}
