import { Graphics } from 'pixi.js';
import Ship from './Ship';

const RECT_WIDTH: number = 40;
const RECT_HEIGHT: number = 120;
const BORDER_WIDTH: number = 10;
const YELLOW: number = 0xffff00;
const BLUE: number = 0x0000ff;

class Berth {
  ship: Ship | null;
  good: boolean;
  sprite: Graphics;
  readonly x: number;
  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.ship = null;
    this.good = false;
    this.sprite = new Graphics();
    this.updateVisual();
  };

  private updateVisual(): void {
    this.sprite.rect(this.x, this.y, RECT_WIDTH, RECT_HEIGHT);
    this.sprite.stroke({ width: BORDER_WIDTH, color: YELLOW });

    if (this.good) {
      this.sprite.fill(YELLOW);
    } else {
      this.sprite.fill(BLUE);
    }
  };

  public addShip(ship: Ship): void {
    this.ship = ship;
  };

  public addGood(ship: Ship): void {
    ship.toggleLoad();
    this.good = !this.good;
    this.updateVisual();
  };

  public removeShip(): void {
    this.ship = null;
    this.updateVisual();
  };
};

export default Berth;
