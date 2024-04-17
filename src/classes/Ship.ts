import { Graphics } from 'pixi.js';

const GREEN: number = 0x00ff00;
const RED: number = 0xff0000;
const BLUE: number = 0x0000ff;
const RECT_WIDTH: number = 100;
const RECT_HEIGHT: number = 35;

class Ship {
  sprite: Graphics;

  constructor(
    public readonly type: 'red' | 'green',
    public loaded: boolean,
  ) {
    this.sprite = new Graphics();
    this.updateVisual();
  }

  private updateVisual(): void {
    this.sprite.rect(0, 0, RECT_WIDTH, RECT_HEIGHT);
    this.sprite.stroke({
      width: 8,
      color: this.type === 'red' ? RED : GREEN,
    });

    if (this.loaded) {
      this.sprite.fill(this.type === 'red' ? RED : GREEN);
    } else {
      this.sprite.fill(BLUE);
    }
  }

  public toggleLoad(): void {
    this.loaded = !this.loaded;
    this.updateVisual();
  }
}

export default Ship;
