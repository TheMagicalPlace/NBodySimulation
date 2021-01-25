import {BodyNodeMixins} from './BodyNodeMixins';
import Size = paper.Size;
import {getDeltaRVector, getRandomInt, randInt, SOLAR_SCALING_FACTOR} from './Constants';
import Path = paper.Path;
import Shape = paper.Shape;
import Point = paper.Point;
import {NBodyBase} from './NBodyBase';
import {BHTreeNode} from './BHTreeNode';

export class NBody extends NBodyBase {
  public static idCounter: number = 0;
  public readonly G: number = 6.674 * (1 / (10 ** (11)));
  public trailObjects = {};
  public mass: number;
  public isStatic: boolean = false;
  public xActual: number;
  public yActual: number;
  public velocity: number[] = new Array<number>();
  public acceleration: number[] = new Array<number>();
  public body: Path.Circle;
  // canvas properties
  public coordinates;
  public size = new Size(1, 1);
  public position : number[] = null;

  public constructor(mass: number, radius: number, x: number, y: number, isStatic = false, parent : BHTreeNode = null) {
    super(mass,parent);
    this.coordinates = [x,y];
    this.body = new Path.Circle(this.coordinates, radius);
    this.body.view.autoUpdate = true;
    this.isStatic = isStatic;
    this.radius = radius;
    this.position = [x , y ]
    this.acceleration = new Array<number>(0, 0);
    this.centerOfMass = this.position.map((v) => v*NBodyBase._body_scaling_factor)
    this.velocity = new Array<number>(randInt(-10000,10000), randInt(-10000,10000));
    this.setSize(radius);
    this.updatePosition([x, y]);
  }

  private _F: number[] = new Array<number>(0,0);

  public get F() {
    return this._F;
  }

  public set F(F) {
    this._F = F;
  }

  public updatePosition(pos : number[]) {
    this.body.position.x = pos[0];
    this.body.position.y = pos[1];
    this.body.fillColor = new paper.Color('black');
  }

  public resetF() {
    this.F = new Array<number>(0, 0);
  }

  public getMagnitude(r1 : Array<number>, r2 : Array<number>) {
    return Math.sqrt(r2.reduce((sum,current,i) =>  sum + (current - r1[i])**2,0));
  }

  public getUnitVector(r1 : Array<number>, r2 : Array<number>) {
    return r2.map((a,i) => (a - r1[i])/this.getMagnitude(r1,r2));
  }

  public get_distance_scalar(body) {
    return Math.sqrt(getDeltaRVector(this, body));
  }

  public calculate_force(body): void {

    let rhat = this.getUnitVector(this.centerOfMass,body.centerOfMass);
    let dr = this.getMagnitude(this.centerOfMass,body.centerOfMass);

    let F = this.centerOfMass.map((value, index) => this.G * this.mass * body.mass * rhat[index] / (dr **2 + 0.001))
    this.F = F.map((value, i) => this.F[i] + value);
    if(isNaN(this.F[0]) || isNaN(this.F[1])) {
      console.log('s')
    }
  }

  public calculateNewMotionProperties(timestep: number = 36000) {
    this.acceleration = this.F.map((value, i) => value / this.mass);
    let y0 = this.velocity;
    this.velocity = this.velocity.map((value, i) => this.acceleration[i] * timestep + value);
    this.centerOfMass = this.centerOfMass.map((value, i) => value + this.velocity[i] * timestep - 0.5 * this.acceleration[i] * timestep ** 2);
    this.position = this.centerOfMass.map((v) => v/NBodyBase._body_scaling_factor)
    //if(this.id === 1 )
    //console.log(`x : ${this.position[0]} y : ${this.position[1]} vx ${this.velocity[0]} vy : ${this.velocity[1]} ax : ${this.acceleration[0]} ay : ${this.acceleration[1]}`);
  }

  private setSize(r: number): void {
    this.size.set({width: r, height: r});
  }

}


