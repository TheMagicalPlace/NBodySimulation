import Size = paper.Size;
import Point = paper.Point;
import {BHTreeNode} from './BHTreeNode';
import {NBody} from './NBody';
import {SOLAR_SCALING_FACTOR} from './Constants';

export class NBodyBase {
  public readonly G: number = 6.674 * (1 / 10 ** (11));
  public mass : number = null;

  public parent : BHTreeNode = null;
  public id: number = null;
  public static idCounter: number = 0;
  public centerOfMass: number[] = new Array<number>();
  public static _body_scaling_factor = 1  // used to calculate actual position from canvas position
  public static _has_been_set = false  //scaling factor shouldn't be modified after being set
  public radius : number = null;
  private self: NBodyBase | BHTreeNode | NBody;
  public bodies : NBody[] = [];
  public childs = [];


  public constructor(mass : number, parent : BHTreeNode) {
    this.mass = mass;
    this.id = NBodyBase.idCounter;
    NBodyBase.idCounter += 1;
    this.self = this;
    this.parent = parent;


  }

  public static set_scaling_factor(canvas_width: number,
                                   canvas_height: number = 0,
                                   scaling_factor: number = SOLAR_SCALING_FACTOR) {

    if (!NBodyBase._has_been_set) {
      let pxscale = Math.max(canvas_width, canvas_height);  //maximum is used for canvas scaling
      this._body_scaling_factor = scaling_factor / pxscale;
      this._has_been_set = true;
    }
  }

  public getR(body) {
    return this.centerOfMass.map((val,i) => body.centerOfMass[i]-val);
  }

  public getRScalar(body){
    return body.centerOfMass
      .map((val,i) => (val - this.self.centerOfMass[i])**2)
      .reduce((accumulator, currentValue) => { accumulator + currentValue})**(1/2);
  }

  public getForceScalar(vector,otherVector) {
    return vector.map((value,index) => value - otherVector[index]);
  }



}
