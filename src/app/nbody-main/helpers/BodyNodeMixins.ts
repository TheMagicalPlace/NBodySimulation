/**
 * - yields numbers
 * - returns strings
 * - can be passed in booleans
 */
import Point = paper.Point;
import Size = paper.Size;
import Shape = paper.Shape;
import Path = paper.Path;
import {SOLAR_SCALING_FACTOR} from './Constants';


export abstract class BodyNodeMixins {
    public static _body_scaling_factor = 1  // used to calculate actual position from canvas position
    public static _has_been_set = false  //scaling factor shouldn't be modified after being set
    public center_of_mass;
    public radius : number
    private self: BodyNodeMixins;


    public constructor() {
        this.self = this;
    }

    public static set_scaling_factor(cls, canvas_width: number,
                                     canvas_height: number = 0,
                                     scaling_factor: number = SOLAR_SCALING_FACTOR) {

        if (!cls._has_been_set) {
            let pxscale = Math.max(canvas_width, canvas_height);  //maximum is used for canvas scaling
            this._body_scaling_factor = scaling_factor / pxscale;
            this._has_been_set = true;
        }
    }

    public getR(body){
        return body.center_of_mass - this.self.center_of_mass
    }

    public getForceScalar(vector,otherVector) {
        return vector.map((value,index) => value - otherVector[index]);
    }
}

