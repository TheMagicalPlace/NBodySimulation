export let SOLAR_SCALING_FACTOR = 9.09*10**12  // meters, appx. diameter of the solar system (out to neptune) in meters

export let SCALE = 1 / 10  // scaling factor
export let UPSCALE = 10e7  // scaling factor for distances
export let MASS_RANGE = [20,25];
export let NBODY_SCALING_FACTOR = null;

export function getRandomInt(max) {
  let sign = Math.random() <0.5 ? -1 : 1;
  return Math.floor((Math.random() * sign * Math.floor(max)));
}


export function getDeltaRVector(body,otherBody) {
  let result : Array<number> = body.centerOfMass.map((k, i) => {(k**2-otherBody.centerOfMass[i]**2)});
  return Math.abs(result.reduce((sum,current) => sum + current,0))

}


export function randomSample(range : Array<any>,numberOfSamples) : number[] {
  let i = 0;
  let seen : any[] = [];
  let samples = [];



  while (i < numberOfSamples) {

    if(Array.isArray(range[0])) {
      let next = Math.floor(Math.random()*Math.floor(range.length));
      if(seen.map((seenarrs) =>
      {
        return seenarrs.map((val,i) => {
          return val === range[next][i]
        }).every((val) => val === true)
      }).every((value) => value === false)) {
        samples.push(range[next]);
        seen.push(range[next]);
        i += 1;
      }
    }
    else {
      let next = Math.floor(Math.random()*Math.floor(range[1]-range[0]))+range[0];
      if (!seen.includes(next)) {
        samples.push(next);
        seen.push(next);
        i += 1;
      }
    }
  }
  return samples;


}

export function pythonZip(array1,array2) : Array<Array<any>> {
  return array1.map((val,i) => [val,array2[i]])
}

export function getBaseLog(x, y) {
  return Math.log(y) / Math.log(x);
}

export function pythonForInRange (start,end,step = 1) : number[]{
  let i = start
  let range = [];

  while (i < end) {
    range.push(i);
    i += step;
  }
  return range;
}

export function pythonChain(iterable) :Array<any> {
  let flattenedArray = [];
  iterable.map((innerIter : Array<any>) => innerIter.map(value => flattenedArray.push(value)));
  return flattenedArray;
}

export function randInt(end,start = 0) : number {

  if(start !== 0 ) {
    let hold = end;
    end = start;
    start = hold;
  }
  let sign = 1
  if(start < 0) {
    sign = Math.random() <0.5 || end < 0 ? -1 : 1;
  }

  let determinant = Math.random()*(end - start) + start;
  return Math.floor(determinant)
}

