import { ObservablePoint } from 'pixi.js';
import { Tween, Easing, update } from '@tweenjs/tween.js';

class Animation {
  constructor() {};

  createTween(
    position: ObservablePoint,
    to: { x: number; y: number } | {},
    duration: number,
    onComplete?: () => void,
  ) {
    return new Tween(position)
      .to(to, duration)
      .easing(Easing.Quadratic.Out)
      .onComplete(onComplete);
  };

  runAnimationLoop = (): void => {
    requestAnimationFrame(this.runAnimationLoop);
    update();
  };
};

export default Animation;
