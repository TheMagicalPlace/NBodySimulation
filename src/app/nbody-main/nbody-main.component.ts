import {AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import PaperScope = paper.PaperScope;
import Project = paper.Project;
import {MASS_RANGE, pythonChain, pythonForInRange, randInt, randomSample} from './helpers/Constants';
import {NBody} from './helpers/NBody';
import {BHTree} from './helpers/BHTree';
import Layer = paper.Layer;
import {NBodyBase} from './helpers/NBodyBase';


@Component({
  selector: 'app-nbody-main',
  templateUrl: './nbody-main.component.html',
  styleUrls: ['./nbody-main.component.css']
})
export class NBodyMainComponent implements OnInit,AfterViewInit {

  constructor() { }
  @ViewChild('NBodyCanvas') NBodyCanvas: ElementRef;
  public static paperScope : PaperScope;
  public static NbodyProject : Project;
  public static BHTree : BHTree;
  public width = 1000;
  public height = 1000;


  public ngOnInit() {

  }

  ngAfterViewInit(): void {

    NBodyMainComponent.paperScope = new PaperScope();
    NBodyMainComponent.paperScope.setup(this.NBodyCanvas.nativeElement);

    NBodyMainComponent.NbodyProject = new Project(this.NBodyCanvas.nativeElement);
    NBodyMainComponent.paperScope.project = NBodyMainComponent.NbodyProject;

    NBodyMainComponent.paperScope.activate();
    NBodyMainComponent.NbodyProject.activate();

    NBodyBase.set_scaling_factor(1000,1000)
    let bodies = this.createBodies(500,0.3);
    NBodyMainComponent.BHTree = new BHTree(NBodyMainComponent.NbodyProject,bodies,MASS_RANGE)

    NBodyMainComponent.NbodyProject.activeLayer.addChildren(bodies.map((b) => b.body));
    NBodyMainComponent.NbodyProject.activeLayer.view.update();
    //this.NbodyProject = this.paperScope.project;
    //this.NbodyProject.activate()
    window.setTimeout(this.test,10);
    // for(let i = 0;i < 100000000;++i) {
    //   this.BHTree.examineBodies();
    //   bodies.map((b) => b.body.view.update());

    //}
    //this.NbodyProject.a


  }

  public test() {

}


  public createBodies (numberOfBodies : number, proportion: number, mass_range=MASS_RANGE, star=true) {
    let bodies : NBody[] = new Array<NBody>();
    let ranges = randomSample([250,750],8);
    ranges.sort((i,j) => i - j);

    let range_gens = pythonForInRange(0,ranges.length - 1,2).map((i) => pythonForInRange(ranges[i],ranges[i+1]))
    let sets = pythonChain(range_gens).map((range) => [range,Math.floor(Math.random()*360)]);
    let res = sets.map((coords) => [Math.floor(coords[0]*Math.cos(coords[1]) + 501),Math.floor(coords[0]*Math.sin(coords[1]) + 501)])   //todo why 501?

    for(let i =0;i < Math.floor(numberOfBodies*(1-proportion));i++) {
      let coords : number[] = randomSample([250,750],1).map((a) => [a, randomSample([0,360],1)[0]],1)[0];
      let mass = 10**randInt(mass_range[0],mass_range[1]) + randInt(1,10**mass_range[0]);
      let aa = coords[0]*Math.cos(coords[1]*90*Math.PI/180) +501
      let bb = coords[0]*Math.sin(coords[1]*90*Math.PI/180) +501
      bodies.push(new NBody(mass,randInt(1,3),Math.floor(aa),Math.floor(bb)));
    }
    for (let range of randomSample(res,Math.floor(numberOfBodies*proportion))) {
      let mass = 10**randInt(mass_range[0],mass_range[1]) + randInt(1,10**mass_range[0]);
      //let aa = range[0]*Math.cos(range[1]) + 501
      //let bb = range[0]*Math.cos(range[1]) + 501
      bodies.push(new NBody(mass,randInt(1,3),range[0],range[1]))
    }

    if (star === true) {
      bodies.push(new NBody(2*10 ** 30, 20, 1000 / 2 + 1, 1000 / 2 + 1, true))
      bodies[bodies.length-1].velocity = [0, 0];
    }
    window.setInterval(() => {
      NBodyMainComponent.BHTree.examineBodies();
      NBodyMainComponent.paperScope.view.update();
    },10)

    return bodies;

  }

}
