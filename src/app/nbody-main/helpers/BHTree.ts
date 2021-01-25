import {Project,View} from "paper/dist/paper-core";
import {BHTreeNode} from './BHTreeNode';
import {NBody} from './NBody';
import {getBaseLog, MASS_RANGE} from './Constants';
import PaperScope = paper.PaperScope;
import {NBodyBase} from './NBodyBase';


export class BHTree {
    public infoCanvas = null;
    public trackedBodies : Map<number,BHTreeNode | NBody> = new Map<number,BHTreeNode | NBody>();
    public bodies : NBody[];
    public canvasWidth = 1000;
    public canvasHeight = 1000;
    public activeBody : NBody;

    //public project = new Project("NBodyCanvas");
    public canvas;
    public s : number = 1000;
    public ratio : number = 0.5 // s/d min ratio
    public maxDepth = null;   // max node subdivide depth

    public bodyCanvasObjects : Map<number,BHTreeNode | NBody> = new Map<number,BHTreeNode | NBody>();



    public root : BHTreeNode;
    private debug : boolean = true;

    public examineBodies() {
      this.root.childs = [];
      this.subdivide(this.root);
      for(let body of this.root.bodies) {
        if(body.position[0] > 3*this.canvasWidth || body.position[1] > 3* this.canvasHeight) {
          this.bodies = this.bodies.filter((bodyOther) => body.id !== bodyOther.id);
          continue;
        }
        if (body.isStatic) {
          continue;
        }
        body.F = [0,0];
        this.activeBody = body;

        this.runNBodySimulation(this.root);
        body.calculateNewMotionProperties();
        this.updateBodyPositions(body);
        if ( this.trackedBodies.has(body.id)) {
          // do some stuff
          // _, tx, _ = self._body_canvas_objs[body._id]
          // self.canvas.coords(tx, body.x, body.y)
          // self.canvas.itemconfigure(tx, text=f"id : {body._id}")
          // next(body.trail_iter)
        }

      }

    }

    public runNBodySimulation(parent : BHTreeNode) {

      // ## DEBUG CODE ##
      //   if self.debug and individual_debug:  # only used for examining individual bodies, needs to be set manually
      // for body in parent.bodies:
      // bd, _, _ = self._body_canvas_objs[body]
      // last_colors.append(self.canvas.itemcget(bd, 'outline'))
      // self.canvas.itemconfig(bd, fill='#ff69b4', outline='#ff69b4')
      // ## END DEBUG CODE ##

      this.s = parent.s/2
      let s = parent.s/2;
      let d = this.activeBody.get_distance_scalar(parent);

      if (parent.bodies.length === 1) {
        if (parent.bodies[0].id !== this.activeBody.id) {
          this.activeBody.calculate_force(parent.bodies[0]);
        }
      }
      else if (s / d < this.ratio) {
        this.activeBody.calculate_force(parent);
      }
      else if ( parent.bodies.length !== 0 || d !== 0) {
        for (let child of parent.childs) {
          this.runNBodySimulation(child);
        }
      }
      // ## DEBUG CODE ##
      // # returns to normal color
      // if self.debug and individual_debug:
      //   for i, body in enumerate(parent.bodies):
      // bd, _, _ = self._body_canvas_objs[body]
      // self.canvas.itemconfig(bd, outline=last_colors[i])
      // self.canvas.update()
      // ## END DEBUG CODE ##

    }


    private updateBodyPositions(body: NBody) {
      let db = this.bodyCanvasObjects.get(body.id)[0];
      let tx = this.bodyCanvasObjects.get(body.id)[1];
      let momentumRadius = this.bodyCanvasObjects.get(body.id)[2];

      // todo whats the basis for the log denominator
      body.updatePosition([body.position[0] ,body.position[1]]);

    }

    constructor(canvas,bodies : NBody[], mass_range = MASS_RANGE) {
      this.canvas = canvas
      this.bodies = bodies;

      this.bodies.map((body) => this.bodyCanvasObjects.set(body.id,body))

      // self.bodies = bodies
      // for b in self.bodies:
      // self._show_body(b)
      // canvas.update()
      //
      // BHTree.canvas_width = canvas.winfo_width()
      // BHTree.canvas_height = canvas.winfo_height()

      this.s = Math.sqrt(this.canvasWidth ** 2 + this.canvasHeight ** 2 )
      this.root = new BHTreeNode([[0, 0], [1000,1000]],null,0)
      this.root.bodies = bodies;
      this.root.findCOM();

    }

    public subdivide(node : BHTreeNode, depth : number = 0) : void {
      if(this.debug) {
        //this.showDebugInfo
      }
      let midX = node.x0 + Math.floor(node.dx / 2);
      let midY = node.y0 + Math.floor(node.dy / 2);
      if (node.parent !== null
        && node.x0 == node.parent.x0
        && node.y0 == node.parent.y0
        && node.x == node.parent.x
        && node.y == node.parent.y) {
        return;
      }
      let nw = [[node.x0,node.y0],[midX,midY]];
      let ne = [[midX,node.y0],[node.x,midY]];
      let sw = [[node.x0,midY],[midX,node.y]];
      let se = [[midX,midY],[node.x,node.y]];
      let next = [nw, ne, sw, se];

      for (let c of next) {
        let n = new BHTreeNode(c,node,0)
        if (n.checkMembership(node.bodies)) {
          this.subdivide(n,depth + 1);
        }
        if (n.bodies.length !== 0) {
          node.childs.push(n);
        }
      }
      node.findCOM()
    }


}
