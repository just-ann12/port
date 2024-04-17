import { Application, ObservablePoint } from 'pixi.js';
import Port from './Port';
import Ship from './Ship';
import Berth from './Berth';
import Animation from './Animation';

const HOME_X: number = 1100;
const APPEAR_RED_SHIP_Y: number = 350;
const APPEAR_GREEN_SHIP_Y: number = 200;
const SHIP_CREATION_INTERVAL: number = 8000;
const QUEUE_MOVE_DURATION: number = 4000;
const QUEUE_SHIP_GAP: number = 15;
const SHIP_MOVE_TO_PORT_DURATION: number = 5000;
const SHIP_MOVE_TO_PORT_SHORT_DURATION: number = 1000;
const SHIP_MOVE_TO_BERTH_DURATION: number = 1000;
const WAIT_DURATION: number = 5000;
const GATE_MOVE_DURATION: number = 2000;
const SHIP_MOVE_HOME_DURATION: number = 8000;
const SHIP_MOVE_TO_GATE_X: number = 120;
const SHIP_MOVE_TO_PORT_RED_Y: number = 340;
const SHIP_MOVE_TO_PORT_GREEN_Y: number = 230;
const HOME_Y: number = 280;
const QUEUE_START_X: number = 290;

class Sea {
  activeShips: Ship[];
  animation: Animation;

  constructor(public port: Port, public pixiApp: Application) {
    this.activeShips = [];
    this.animation = new Animation();
    this.init();
  }

  private init(): void {
    this.addPortToStage();
    this.createNewShip();
    this.animation.runAnimationLoop();
  }

  private addPortToStage = (): void => {
    this.port.berths.forEach((berth) => {
      this.pixiApp.stage.addChild(berth.sprite);
    });
    this.pixiApp.stage.addChild(this.port.sprite);
  };

  private createNewShip = (): void => {
    const type = Math.random() < 0.5 ? 'red' : 'green';
    const ship = new Ship(type, type === 'red');
    const ship_Y =
      ship.type === 'red' ? APPEAR_RED_SHIP_Y : APPEAR_GREEN_SHIP_Y;

    this.activeShips.push(ship);

    ship.sprite.position.set(HOME_X, ship_Y);
    this.pixiApp.stage.addChild(ship.sprite);
    this.moveShip(ship);
    setTimeout(this.createNewShip, SHIP_CREATION_INTERVAL);
  };

  private moveShip = (ship: Ship): void => {
    const freeBerths = this.port.findFreeBerths(ship);

    if (freeBerths.length && this.port.isOpenGate) {
      const queue = this.port.queues[ship.type];
      const indexInQueue = queue.indexOf(ship);

      if (indexInQueue === 0 || (!queue.length && indexInQueue < 0)) { // the first in the queue or not in the queue yet

        this.handleShip(indexInQueue, freeBerths, ship);
      } else {
        this.port.addToQueue(ship);
        setTimeout(() => this.moveShip(ship), 500);
      }
    } else {
      this.port.addToQueue(ship);
      this.enqueueShip(ship);
    }
  };

  handleShip(indexInQueue: number, freeBerths: Berth[], ship: Ship): void {
    const nearestBerth = this.port.findNearestBerth(
      freeBerths,
      ship.sprite.position,
    );

    this.port.closeGate();
    this.port.addShip(nearestBerth, ship);
    this.animateShipMovement(ship, nearestBerth);
    indexInQueue === 0 && this.port.removeFromQueue(ship.type);
  }

  private enqueueShip = (ship: Ship): void => {
    const queue = this.port.queues[ship.type];
    const index = queue.indexOf(ship);
    const queueY = ship.type === 'red' ? 370 : 190;
    const queueX = QUEUE_START_X + index * (QUEUE_SHIP_GAP + ship.sprite.width);

    this.animation
      .createTween(
        ship.sprite.position,
        { x: queueX, y: queueY },
        QUEUE_MOVE_DURATION,
      )
      .onComplete(() => this.moveShip(ship))
      .start();
  };

  private animateShipMovement = (ship: Ship, berth: Berth): void => {
    const targetY = berth.y + berth.sprite.width;
    const portY =
      ship.type === 'red' ? SHIP_MOVE_TO_PORT_RED_Y : SHIP_MOVE_TO_PORT_GREEN_Y;
    const gateShipXDifference = ship.sprite.x - this.port.sprite.x;
    const duration =
      gateShipXDifference < 1000
        ? SHIP_MOVE_TO_PORT_SHORT_DURATION
        : SHIP_MOVE_TO_PORT_DURATION;

    const moveToPort = this.animation.createTween(
      ship.sprite.position,
      { x: SHIP_MOVE_TO_GATE_X, y: portY },
      duration,
    );

    const moveToBerth = this.animation
      .createTween(
        ship.sprite.position,
        { x: berth.sprite.width, y: targetY },
        SHIP_MOVE_TO_BERTH_DURATION,
      )
      .onComplete(() => {
        this.port.openGate();
      });

    const wait = this.animation
      .createTween(ship.sprite.position, {}, WAIT_DURATION)
      .onComplete(() => {
        this.port.handleShipOnBerth(berth, ship);
        this.port.closeGate();
      });

    const moveToGate = this.animation
      .createTween(
        ship.sprite.position,
        { x: SHIP_MOVE_TO_GATE_X, y: HOME_Y },
        GATE_MOVE_DURATION,
      )
      .onComplete(() => {
        this.port.openGate();
      });

    const moveHome = this.animation
      .createTween(
        ship.sprite.position,
        { x: HOME_X, y: HOME_Y },
        SHIP_MOVE_HOME_DURATION,
      )
      .onComplete(() => {
        this.pixiApp.stage.removeChild(ship.sprite);
      });

    moveToPort.chain(moveToBerth).start();
    moveToBerth.chain(wait);
    wait.chain(moveToGate);
    moveToGate.chain(moveHome);
  };
}

export default Sea;
