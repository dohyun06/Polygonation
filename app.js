import { Color } from './color.js';
import { Dot } from './dot.js';

class App {
  constructor() {
    this.stdColor = [0, 0, 0];

    this.canvas = document.createElement('canvas');
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.glCanvas = document.createElement('canvas');
    // document.body.appendChild(this.glCanvas);
    this.gl = this.glCanvas.getContext('webgl');

    this.points = [];
    this.triangles = [];
    this.color = [];

    this.img = new Image();
    this.img.src = './img.jpg';
    this.img.onload = () => {
      this.width = this.img.width;
      this.height = this.img.height;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.glCanvas.width = this.width;
      this.glCanvas.height = this.height;

      this.ctx.drawImage(this.img, 0, 0, this.width, this.height);
      this.data = this.ctx.getImageData(0, 0, this.width, this.height).data;

      let tr = 0;
      let tg = 0;
      let tb = 0;
      for (let i = 0; i < this.data.length; i += 4) {
        tr += this.data[i];
        tg += this.data[i + 1];
        tb += this.data[i + 2];
      }
      /*
      this.stdColor = [
        (((tr * 4) / this.data.length / 255) * 2) / 3,
        (((tg * 4) / this.data.length / 255) * 2) / 3,
        (((tb * 4) / this.data.length / 255) * 2) / 3,
        (((tr * 4) / this.data.length / 255) * 2 + 1) / 3,
        (((tg * 4) / this.data.length / 255) * 2 + 1) / 3,
        (((tb * 4) / this.data.length / 255) * 2 + 1) / 3,
      ];
      */
      this.stdColor = [
        (tr * 4) / this.data.length / 255,
        (tg * 4) / this.data.length / 255,
        (tb * 4) / this.data.length / 255,
      ];

      this.drawImage();
    };
  }

  drawImage() {
    const texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.img);

    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);

    const vertexShaderSource = `
    attribute vec2 coordinates;
    varying vec2 v_texCoord;
    void main(void) {
        gl_Position = vec4(coordinates * vec2(1, -1), 0.0, 1.0);
        v_texCoord = (coordinates + 1.0) / 2.0;
    }`;

    const fragmentShaderSource = `
    precision mediump float;
    uniform sampler2D u_image;
    varying vec2 v_texCoord;
    void main() {
        vec4 color = texture2D(u_image, v_texCoord);
        color.r = (color.r < ${this.stdColor[0]} ? 0.4 : 0.6);
        color.g = (color.g < ${this.stdColor[1]} ? 0.4 : 0.6);
        color.b = (color.b < ${this.stdColor[2]} ? 0.4 : 0.6);
        gl_FragColor = color;
    }`;
    /*
        color.r = (color.r < ${this.stdColor[0]} ? 0.0 : 1.0);
        color.g = (color.g < ${this.stdColor[1]} ? 0.0 : 1.0);
        color.b = (color.b < ${this.stdColor[2]} ? 0.0 : 1.0);

        color.r = (color.r < ${this.stdColor[0]} ? 0.0 : (color.r < ${this.stdColor[3]} ? 0.5 : 1.0));
        color.g = (color.g < ${this.stdColor[1]} ? 0.0 : (color.g < ${this.stdColor[4]} ? 0.5 : 1.0));
        color.b = (color.b < ${this.stdColor[2]} ? 0.0 : (color.b < ${this.stdColor[5]} ? 0.5 : 1.0));
    */

    const vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
    this.gl.shaderSource(vertexShader, vertexShaderSource);
    this.gl.compileShader(vertexShader);

    const fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    this.gl.shaderSource(fragmentShader, fragmentShaderSource);
    this.gl.compileShader(fragmentShader);

    const program = this.gl.createProgram();
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);
    this.gl.useProgram(program);

    const buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);

    const vertices = new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]);

    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);

    const coordinates = this.gl.getAttribLocation(program, 'coordinates');
    this.gl.enableVertexAttribArray(coordinates);
    this.gl.vertexAttribPointer(coordinates, 2, this.gl.FLOAT, false, 0, 0);

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    const u_image = this.gl.getUniformLocation(program, 'u_image');
    this.gl.uniform1i(u_image, 0);

    this.gl.viewport(0, 0, this.width, this.height);

    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

    const imageDataArray = new Uint8Array(this.width * this.height * 4);
    this.gl.readPixels(0, 0, this.width, this.height, this.gl.RGBA, this.gl.UNSIGNED_BYTE, imageDataArray);

    this.dot = new Dot(imageDataArray, this.width, this.height);
    this.points = this.dot.points;

    // this.triangles = new Triangle(this.points).triangles;
    /*
    this.delaunay = d3.Delaunay.from(this.points);
    for (let i = 0; ; i++) {
      if (this.delaunay.trianglePolygon(i)[0][0] === undefined) break;

      this.triangles[i] = this.delaunay.trianglePolygon(i);
    }

    for (let i = 0; i < this.triangles.length; i++) {
      this.color[i] = new Color(this.width, this.height, this.triangles[i], this.data);
    }
*/
    this.ctx.clearRect(0, 0, this.width, this.height);

    // console.log(this.points.length);
    this.draw(); // init
    this.draw(); // correction
  }

  draw() {
    for (let i = 0; i < this.points.length; i++) {
      this.ctx.beginPath();
      this.ctx.arc(this.points[i][0], this.points[i][1], 1, 0, Math.PI * 2);
      this.ctx.fillStyle = '#F00';
      this.ctx.fill();
    }

    /*
    this.ctx.strokeStyle = '#FFF';
    this.ctx.lineWidth = 1;
    */
    /*
    for (let i = 0; i < this.triangles.length; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.triangles[i][0][0], this.triangles[i][0][1]);
      this.ctx.lineTo(this.triangles[i][1][0], this.triangles[i][1][1]);
      this.ctx.lineTo(this.triangles[i][2][0], this.triangles[i][2][1]);

      // this.ctx.stroke();

      this.ctx.fillStyle = `rgb(${this.color[i].color[0]}, ${this.color[i].color[1]}, ${this.color[i].color[2]})`;
      this.ctx.fill();
    }
      */
  }
}

window.onload = () => {
  new App();
};
