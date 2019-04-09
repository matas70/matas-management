import {Injectable} from '@angular/core';
import {from} from 'rxjs';
import {DataService} from "../data/data.service";
import {Aircraft} from "../models/aircraft.model";
import {Store} from '@ngrx/store';
import {main} from "@angular/compiler-cli/src/main";
import {el} from "@angular/platform-browser/testing/src/browser_util";

interface IRoute {
  weight: number;
  routeNodes: number[];
}

@Injectable({
  providedIn: 'root'
})
export class RouteGenerationAlgorithmService {

  private mapPointToIndex = new Map();

  private things: number[][];
  private graph: number[][];

  private aircrafts: Aircraft[];

  constructor(private dataService: DataService, private store: Store<any>) {
    this.graph = [[], []];
    store.select("aircraft").subscribe((aircraft: Map<number, Aircraft>) => {
      this.aircrafts = Array.from(aircraft.values());
      if (this.aircrafts.length > 2) {
        this.main1()
      }
    });
  }

  // algorithm:
  // 1. convert input data to graph
  // 2. iteration: while there are edges
  //      1. find source and dest
  //      2. find the maximal weight route
  //      3. delete edges, who found at level before
  // 3. write result to file
  private main1() {
    this.buildMapPointToIndex();
    let numberOfPoint: number = this.mapPointToIndex.size;
    this.graph = new Array(numberOfPoint).fill(0).map(() => new Array(numberOfPoint).fill(0));
    this.buildGraph();
    while (this.haveEdge(this.graph)) {
      // don't ask why i use the temp value but its not work
      // if i send the function, like: this.findSrc(this.findMaxEdge());
      let [x, y, z] = this.findMaxEdge();
      let src = this.findSrc([x, y, z]);
      let dest = this.findDest([x, y, z]);
      let maximalRoute = this.findMaximalRoute(this.graph, src, dest);
      this.removeMaximalRoute(this.graph, maximalRoute.routeNodes);
      //this.buildGraph();
    }
  }

  private buildMapPointToIndex() {
    // iterate over all aircrafts
    for (let i = 0; i < this.aircrafts.length; i++) {
      let currentAircraft = this.aircrafts[i];
      let points = currentAircraft.path;
      // iterate over all points to build map
      for (let j = 0; j < points.length; j++) {
        if (!this.mapPointToIndex.has(points[j].pointId)) {
          this.mapPointToIndex.set(points[j].pointId, j)
        }
      }
    }
  }

  private buildGraph() {
    // iterate over all aircrafts
    for (let i = 0; i < this.aircrafts.length; i++) {
      let currentAircraft = this.aircrafts[i];
      let points = currentAircraft.path;
      for (let j = 0; j < points.length - 1; j++) {
        let sourcePoint = points[j];
        let sourcePointIndex = this.mapPointToIndex.get(sourcePoint.pointId);
        let destPoint = points[j + 1];
        let destPointIndex = this.mapPointToIndex.get(destPoint.pointId);
        this.graph[sourcePointIndex][destPointIndex]++;
        //let x = new Array(points.length);
        /*if (this.graph){
          if (this.graph[sourcePointIndex]){

          }
          else{
            this.graph.push()
          }
        }
        else{
          this.graph=[]
          
        }
        if (this.graph[sourcePointIndex][destPointIndex]) {
          let temp = this.graph[sourcePointIndex][destPointIndex];
          temp = temp++;
          this.graph[sourcePointIndex].push(temp)
        } else {
          this.graph[sourcePointIndex].push(1)
        }*/
      }
    }
  }

  // The algorithm is go on the column of of the index of
  // srcMaxEdge and check if there is a edge with the same weight
  // if found run again with the new srcMaxEdge
  // currently, 08/04/2019 we assume there is no circle
  //this.findMaxEdge();
  /*
  1   2   3   4   5

  2       10

  3

  4   10

  5
   */
  private findSrc([srcMaxEdge, destMaxEdge, maxWeight]): number {
    let candidateSrc = srcMaxEdge;
    //assume this.graph[srcMaxEdge] bring the column
    for (let i = 0; i < this.graph[srcMaxEdge].length; i++) {
      let currentColumn = this.getColumn(this.graph, srcMaxEdge);
      if (i != destMaxEdge && maxWeight == currentColumn[i]) {
        return this.findSrc([i, srcMaxEdge, maxWeight]);
      }
    }
    return candidateSrc;
  }

  // the opposite of the findSrc
  private findDest([srcMaxEdge, destMaxEdge, maxWeight]): number {
    let candidateDest = destMaxEdge;
    //assume this.graph[srcMaxEdge] bring the column
    for (let i = 0; i < this.graph[destMaxEdge].length; i++) {
      let currentRow = this.graph[destMaxEdge];
      if (i != destMaxEdge && maxWeight == currentRow[i]) {
        return this.findDest([destMaxEdge, i, maxWeight]);
      }
    }
    return candidateDest;
  }

  private getColumn(matrix, col: number) {
    var column = [];
    for (var i = 0; i < matrix.length; i++) {
      column.push(matrix[i][col]);
    }
    return column;
  }

  // return the source, dest and the maxWeight of the max edge
  private findMaxEdge(): any[] {
    let maxWeight = 0;
    let maxI = 0;
    let maxJ = 0;
    let i = 0;
    let j = 0;
    for (; i < this.graph.length; i++) {
      for (j = 0; j < this.graph[i].length; j++) {
        if (this.graph[i][j] > maxWeight) {
          maxWeight = this.graph[i][j];
          maxI = i;
          maxJ = j
        }
      }
    }
    return [maxI, maxJ, maxWeight];
  }

  // src its the row index and the dest is the column index
  private findMaximalRoute(graph: number[][],
                           src: number, dest: number): IRoute {

    let maxWeightCurrent = 0;       // The current maximal route's total
    let maxWeightCurrentNodes = []; // The nodes for maxWeightCurrent
    let maxRoute: IRoute;           // The maximal route to return

    /* Iterate backwards, starting at the dest node, to find the
       maximum route                                              */
    for (let i = 0; i < graph[0].length; i++) {
      if (graph[i][dest] == 0) {
        continue;
      }

      /* In both cases maxRoute.weight contains the weight from src to
         i, dest NOT included.                                        */
      if (i == src) {
        maxRoute = {weight: 0, routeNodes: [src]};
      } else {
        maxRoute = this.findMaximalRoute(graph, src, i);
      }

      /* Add the weight of i-dest to the weight up to i, and see
         whether the total weight is bigger than the current max value */
      let maxWeightCompare = maxRoute.weight + graph[i][dest];
      if (maxWeightCompare > maxWeightCurrent) {
        maxWeightCurrent = maxWeightCompare;    // Save the new max
        // Save the route with the maximum value (from src up to dest)
        maxWeightCurrentNodes = maxRoute.routeNodes;
        maxWeightCurrentNodes.push(dest);
      }
    }

    maxRoute = {weight: maxWeightCurrent, routeNodes: maxWeightCurrentNodes};

    return maxRoute;
  }

  private removeMaximalRoute(graph: number[][], maxRoute: number[]) {
    for (let i = 1; i < maxRoute.length; i++) {
      graph[maxRoute[i - 1]][maxRoute[i]] = 0;
    }
  }

  private haveEdge(graph: number[][]): boolean {
    let haveEdge: boolean;
    haveEdge = false;
    for (let i = 0; i < graph.length; i++) {
      for (let j = 0; j < graph[i].length; j++) {
        if (graph[i][j] && graph[i][j] > 0) {
          return true;
        }
      }
    }
    return haveEdge;
  }
}
