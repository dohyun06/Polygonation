import { Triangle } from './triangle.js';

class App {
  constructor() {
    this.canvas = document.createElement('canvas');
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    this.tmpCanvas = document.createElement('canvas');
    this.tmpCtx = this.tmpCanvas.getContext('2d');

    this.triangle = new Triangle(this.ctx, this.tmpCtx);

    window.addEventListener('resize', this.resize.bind(this), false);
    this.resize();

    window.requestAnimationFrame(this.animate.bind(this));
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth * 2;
    this.canvas.height = this.stageHeight * 2;
    this.ctx.scale(2, 2);

    this.tmpCanvas.width = this.stageWidth;
    this.tmpCanvas.height = this.stageHeight;

    this.triangle.resize(this.stageWidth, this.stageHeight);
  }

  animate() {
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    this.triangle.animate();

    window.requestAnimationFrame(this.animate.bind(this));
  }
}

window.onload = () => {
  new App();
};
