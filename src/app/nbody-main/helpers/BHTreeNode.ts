import {BodyNodeMixins} from './BodyNodeMixins';
import {NBody} from './NBody';
import {NBodyBase} from './NBodyBase';

export class BHTreeNode extends NBodyBase {
    public x: number = null;
    public y: number = null;
    public x0: number = null;
    public y0: number = null;
    public dx: number = null;
    public dy: number = null;
    public s: number = null;

    public constructor(cords: Array<Array<number>>, parent :BHTreeNode = null, mass : number, bodies : NBody[] = []) {
        super(mass,parent);
        this.x0 = cords[0][0];
        this.x = cords[1][0];
        this.y0 = cords[0][1];
        this.y = cords[1][1];
        this.dx = this.x - this.x0;
        this.dy = this.y - this.y0;
        this.parent = parent;
        this.bodies = bodies;

        this.centerOfMass = [this.x0 + this.dx/2, this.y0 + this.dy/2].map(value => value * BHTreeNode._body_scaling_factor);

    }

    public checkMembership(bodies: NBody[]): void | boolean{
        for (const body of bodies) {
            this.parent.mass += body.mass;
            if (this.x0 < body.position[0] && body.position[0] < this.x) {
                if (this.y0 <= body.position[1] && body.position[1] < this.y) {
                    this.bodies.push(body);
                }
            }
        }
        if (this.bodies.length > 1) {
            this.findCOM();
            return true;
        }
        else if (this.bodies.length === 1) {
            this.mass = this.bodies[0].mass;
            this.findCOM();
            return false;
        }
        else {
            this.findCOM();
        }
    }

    public findCOM(depth = null): void{
        if (this.bodies.length === 1) {
            this.centerOfMass = this.bodies[0].centerOfMass;
        } else if (this.childs.length === 0) {
            this.centerOfMass = [this.x0 + this.dx, this.y0 + this.dy].map(value => value * BHTreeNode._body_scaling_factor);
        } else {
            let mSum = 0;
            let cmX = 0;
            let cmY = 0;
            for (const c of this.childs) {
                cmX += c.centerOfMass[0] * c.mass;
                cmY += c.centerOfMass[1] * c.mass;
                mSum += c.mass;
            }
            this.centerOfMass = [cmX / mSum, cmY / mSum];
        }


    }

}
