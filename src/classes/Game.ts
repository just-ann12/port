import Port from './Port';
import Sea from './Sea';
import * as PIXI from 'pixi.js';

class Game {
  port: Port;
  sea: Sea;
  pixiApp: PIXI.Application;

  constructor() {
    this.port = new Port(4);
    this.pixiApp = new PIXI.Application();
    this.initializePixiAppAsync();

    this.sea = new Sea(this.port, this.pixiApp);
  }

  private async initializePixiAppAsync(): Promise<void> {
    await this.pixiApp.init({
      width: 1000,
      height: 600,
      backgroundColor: 0x0000ff,
    }); 
    
    const canvas = this.pixiApp.canvas;
    canvas.style.position = 'absolute';
    canvas.style.left = '50%';
    canvas.style.top = '50%';
    canvas.style.transform = 'translate(-50%, -50%)';

    document.body.appendChild(canvas);
    document.body.appendChild(this.pixiApp.canvas);
  }
}

export default Game;
