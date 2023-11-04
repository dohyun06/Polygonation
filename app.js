import { Color } from './color.js';
import { Dot } from './dot.js';

class App {
  constructor() {
    this.colorRange = 125;

    this.canvas = document.createElement('canvas');
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.glCanvas = document.createElement('canvas');
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
      this.drawImage();
    };
  }

  drawImage() {
    const texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.img); // 여기서 yourImageData는 이미지 데이터를 나타내는 Uint8Array 또는 이미지 텍스처입니다.

    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);

    const vertexShaderSource = `
    attribute vec2 coordinates;
    varying vec2 v_texCoord;
    void main(void) {
        gl_Position = vec4(coordinates, 0.0, 1.0);
        v_texCoord = (coordinates + 1.0) / 2.0;
    }`;

    const fragmentShaderSource = `
    precision mediump float;
    uniform sampler2D u_image;
    varying vec2 v_texCoord;
    void main() {
        vec4 color = texture2D(u_image, v_texCoord);
        color.r = floor(color.r * 255.0 / ${this.colorRange}.0) * ${this.colorRange}.0 / 255.0;
        color.g = floor(color.g * 255.0 / ${this.colorRange}.0) * ${this.colorRange}.0 / 255.0;
        color.b = floor(color.b * 255.0 / ${this.colorRange}.0) * ${this.colorRange}.0 / 255.0;
        gl_FragColor = color;
    }`;

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

    const vertices = new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0]);

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

    const imageDataArray = new Uint8Array(this.width * this.height * 4); // RGBA 데이터를 저장하기 위한 배열
    this.gl.readPixels(0, 0, this.width, this.height, this.gl.RGBA, this.gl.UNSIGNED_BYTE, imageDataArray);

    this.dot = new Dot(imageDataArray, this.width, this.height);
    this.points = this.dot.points;

    this.tmpCanvas = document.createElement('canvas');
    this.tmpCanvas.width = this.width;
    this.tmpCanvas.height = this.height;
    this.tmpCtx = this.tmpCanvas.getContext('2d');

    this.tmpCtx.drawImage(this.img, 0, 0, this.width, this.height);
    this.data = this.tmpCtx.getImageData(0, 0, this.width, this.height).data;

    this.delaunay = d3.Delaunay.from(this.points);
    for (let i = 0; ; i++) {
      if (this.delaunay.trianglePolygon(i)[0][0] === undefined) break;

      this.triangles[i] = this.delaunay.trianglePolygon(i);
    }

    for (let i = 0; i < this.triangles.length; i++) {
      this.color[i] = new Color(this.width, this.height, this.triangles[i], this.data);
    }

    this.animate(); // init
    this.animate(); // correction
  }

  animate() {
    /*
    for (let i = 0; i < this.points.length; i++) {
      this.ctx.beginPath();
      this.ctx.arc(this.points[i][0], this.points[i][1], 1, 0, Math.PI * 2);
      this.ctx.fillStyle = '#0F0';
      this.ctx.fill();
    }
    */
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

      this.ctx.fillStyle = `rgb(${this.color[i].color[0]}, ${this.color[i].color[1]}, ${this.color[i].color[2]})`;
      this.ctx.fill();
    }
  }
}

window.onload = () => {
  new App();
};
