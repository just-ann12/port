import { Graphics, Point } from 'pixi.js';
import Ship from './Ship';
import Berth from './Berth';

const YELLOW: number = 0xffff00;
const GATE_WIDTH: number = 6;
const GATE_HEIGHT: number = 190;
const BERTH_HEIGHT: number = 140;
const BERTH_X: number = 0;
const BERTH_GAP: number = 30;
const GATE_X: number = 260;
const FIRST_GATE_Y: number = 0;
const SECOND_GATE_Y: number = 410;

class Port {
  berths: Berth[];
  sprite: Graphics;
  queues: { [key: string]: Ship[] };
  isOpenGate: boolean;

  constructor(berthCount: number) {
    this.berths = [];
    this.queues = {
      red: [],
      green: [],
    };
    this.isOpenGate = true;

    this.initBerths(berthCount);

    this.sprite = new Graphics();
    this.drawGate();
  };

  private initBerths(berthCount: number): void {
    for (let i = 0; i < berthCount; i++) {
      this.berths.push(new Berth(BERTH_X, BERTH_GAP + i * BERTH_HEIGHT));
    }
  };

  private drawGate(): void {
    this.sprite.rect(GATE_X, FIRST_GATE_Y, GATE_WIDTH, GATE_HEIGHT);
    this.sprite.rect(GATE_X, SECOND_GATE_Y, GATE_WIDTH, GATE_HEIGHT);
    this.sprite.stroke({ color: YELLOW });
    this.sprite.fill(YELLOW);
  };

  private YDifferenceToBerth(shipY: number, berthY: number): number {
    return Math.abs(berthY - shipY);
  };

  closeGate(): void {
    this.isOpenGate = false;
  };

  openGate(): void {
    this.isOpenGate = true;
  };

  findFreeBerths(ship: Ship): Berth[] {
    return this.berths.filter(
      (berth) => berth.ship === null && ship.loaded !== berth.good,
    );
  };

  findNearestBerth(berths: Berth[], shipPosition: Point): Berth {
    let nearestBerth: Berth = berths[0];
    let distance = this.YDifferenceToBerth(
      shipPosition.y,
      nearestBerth.y + nearestBerth.sprite.height / 2,
    );

    berths.map((berth) => {
      let shortestDistance = this.YDifferenceToBerth(
        shipPosition.y,
        berth.y + berth.sprite.height / 2,
      );

      if (shortestDistance <= distance) {
        distance = shortestDistance;
        nearestBerth = berth;
      }
    });

    return nearestBerth;
  };

  addToQueue(ship: Ship): void {
    const queue = this.queues[ship.type];
    const existingShipIndex = queue.indexOf(ship);

    if (existingShipIndex === -1) {
      queue.push(ship);
    }
  };

  removeFromQueue(type: 'red' | 'green'): void {
    this.queues[type].shift();
  };

  addShip(berth: Berth, ship: Ship): void {
    berth.addShip(ship);
  };

  handleShipOnBerth(berth: Berth, ship: Ship): void {
    berth.addGood(ship);
    berth.removeShip();
  };
};

export default Port;
