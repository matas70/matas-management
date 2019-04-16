import {Injectable} from '@angular/core';
import {from} from 'rxjs';
import {DataService} from "../data/data.service";
import {Aircraft} from "../models/aircraft.model";
import {Store} from '@ngrx/store';
import {Point} from "../models/point.model";
import {Route} from "../models/route.model";
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

  private routes: IRoute[] = [];
  private aircrafts: Aircraft[];

  private mapPointIdToIndex: Map<number, number> = new Map();

  private mapIndexToPoint: Map<number, Point> = new Map();

  private pointsMap: Map<number, Point> = new Map();

  private routesColor: string[] = [];

  private routesMap: Map<number, Route> = new Map();

  private routeHavePassed: number[] = [];


  constructor(private dataService: DataService, private store: Store<any>) {
    this.graph = [[], []];
    store.select("aircraft").subscribe((aircraft: Map<number, Aircraft>) => {
      this.aircrafts = Array.from(aircraft.values());
    });
    store.select("points").subscribe((points: Map<number, Point>) => {
      this.pointsMap = points;
    });
  }

  // algorithm:
  // 1. convert input data to graph
  // 2. iteration: while there are edges
  //      1. find source and dest
  //      2. find the maximal weight route
  //      3. delete edges, who found at level before
  // 3. write result to file
public main1() {
    let routes: IRoute[] = [];
    this.routeHavePassed =[];
    this.buildMapPointIdToIndex();
    this.buildMapIndexToPointId();
    let numberOfPoint: number = this.mapPointIdToIndex.size;
    this.graph = new Array(numberOfPoint).fill(0).map(() => new Array(numberOfPoint).fill(0));
    this.buildGraph();
    while (this.haveEdge(this.graph)) {
      // don't ask why i use the temp value but its not work
      // if i send the function, like: this.findSrc(this.findMaxEdge());
      let [startSource, startDest, z] = this.findMaxEdge();
      //let dest = this.findDest([startDest ,startSource, z]);
      //reflect graph
      //let src = this.findSrc([startSource, startDest, z]);
      if (startSource == startDest) {
        break;
      }
      //let maximalRoute = this.findMaximalRoute(this.graph, src, dest);
      this.expandFromSource(startSource);
      this.expandToSource(startSource);
      let maximalRoute: IRoute;
      if (!maximalRoute) {
        maximalRoute = {weight: 0, routeNodes: []};
      }
      maximalRoute.routeNodes = this.routeHavePassed;
      maximalRoute.weight = 5;
      routes.push(maximalRoute);
      this.routeHavePassed =[];
      this.removeMaximalRoute(this.graph, maximalRoute.routeNodes);
    }
    this.updateRoutes(routes)
  }

  private buildMapPointIdToIndex() {
    // iterate over all aircrafts
    for (let i = 0; i < this.aircrafts.length; i++) {
      let currentAircraft = this.aircrafts[i];
      let points = currentAircraft.path;
      // iterate over all points to build map
      for (let j = 0; j < points.length; j++) {
        if (!this.mapPointIdToIndex.has(points[j].pointId)) {
          this.mapPointIdToIndex.set(points[j].pointId, j)
        }
      }
    }
  }

  private buildGraph() {
    // iterate over all aircrafts
    for (let i = 0; i < this.aircrafts.length - 1; i++) {
      let currentAircraft = this.aircrafts[i];
      let points = currentAircraft.path;
      for (let j = 0; j < points.length - 1; j++) {
        let sourcePoint = points[j];
        let sourcePointIndex = this.mapPointIdToIndex.get(sourcePoint.pointId);
        let destPoint = points[j + 1];
        let destPointIndex = this.mapPointIdToIndex.get(destPoint.pointId);
        this.graph[sourcePointIndex][destPointIndex]++;
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
  private findSrc([srcMaxEdge, destMaxEdge, maxWeight],deviationInPercent = 5 ): number {
    let candidateSrc = srcMaxEdge;
    for (let i = 0; i < this.graph[srcMaxEdge].length; i++) {
      let currentColumn = this.getColumn(this.graph, srcMaxEdge);
      if (i != destMaxEdge && maxWeight == currentColumn[i]) {
        return this.findSrc([i, srcMaxEdge, maxWeight]);
      }
      else{
        //  check for more edges with deviation of number's plan
        if(i != destMaxEdge && this.isBetween(maxWeight, currentColumn[i])){
          return this.findSrc([i, srcMaxEdge, maxWeight]);
        }
      }
    }
    return candidateSrc;
  }

  private isBetween(weight: number, value:number, deviationInPercent: number = 6.5):boolean{
    return ((weight < value && Math.ceil(weight + weight * deviationInPercent /100) > value)  ||
      (weight > value && Math.floor( weight - weight * deviationInPercent /100) <value))
  }

  /*
  1   2   3   4   5

  2       10

  3           7

  4   8

  5
   */
  // the opposite of the findSrc
  private findDest([srcMaxEdge, destMaxEdge, maxWeight], routeHavePassed1:number[] =[] ): number {
    let candidateDest = destMaxEdge;
    if(routeHavePassed1.includes(srcMaxEdge) || srcMaxEdge ==  destMaxEdge){
      return candidateDest;
    }
    routeHavePassed1.push(destMaxEdge);
    //assume this.graph[srcMaxEdge] bring the column
    let currentRow = this.graph[destMaxEdge];
    let maxIndex = this.findMaxIndex(currentRow);
    if (maxIndex == -1){
      return candidateDest;
    }
    candidateDest =  this.findDest([destMaxEdge, maxIndex, maxWeight],routeHavePassed1);
    return candidateDest
    /* else{
       if(i != destMaxEdge && this.isBetween(maxWeight, currentRow[i])){
         return this.findDest([i, srcMaxEdge, maxWeight]);
       }
     }*/
    //return candidateDest;
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
                           src: number, dest: number, routeHavePassed: number[] = []): IRoute {
    let maxWeightCurrent = 0;       // The current maximal route's total
    let maxWeightCurrentNodes = []; // The nodes for maxWeightCurrent
    let maxRoute: IRoute;           // The maximal route to return
    let first = true;

    if (src == dest) {
      return {weight: 0, routeNodes: [src]};
    }

    /* Iterate backwards, starting at the dest node, to find the
       maximum route. If both i and dest have already been visited, then
       we found a circle, and therefore going to i again is pointless */
    for (let i = 0; i < graph.length; i++) {
      if (graph[i][dest] == 0 || 
        (routeHavePassed.includes(dest) && routeHavePassed.includes(i)) ) {
        continue;
      }

      /* In both cases maxRoute.weight contains the weight from src to
         i, dest NOT included.                                        */
      maxRoute = this.findMaximalRoute(graph, src, i);


      /* Add the weight of i-dest to the weight up to i, and see
         whether the total weight is bigger than the current max value */
      let maxWeightCompare = maxRoute.weight + graph[i][dest];
      if (maxWeightCompare > maxWeightCurrent) {
        maxWeightCurrent = maxWeightCompare;    // Save the new max
        // Save the route with the maximum value (from src up to dest)
        for (let j = 0; j < maxRoute.routeNodes.length; j++)
          maxWeightCurrentNodes[j] = maxRoute.routeNodes[j];
        maxWeightCurrentNodes[maxRoute.routeNodes.length] = dest;
        if (!first)
          routeHavePassed.pop();
        routeHavePassed.push(dest);
        first = false;
      }
    }

    maxRoute = {weight: maxWeightCurrent, routeNodes: maxWeightCurrentNodes};

    return maxRoute;
  }

  private findMaximalRoute1(graph: number[][],
                            src: number, dest: number): IRoute {
    let maxWeightCurrent = 0;       // The current maximal route's total
    let maxWeightCurrentNodes = []; // The nodes for maxWeightCurrent
    let maxRoute: IRoute;           // The maximal route to return
    if (!maxRoute) {
      maxRoute = {weight: 0, routeNodes: [src]};
    }

    while (src != dest) {
      let currentRow = graph[src];
      let maxRowWeight = 0;
      let maxIndex = 0;

      for (let i = 0; i < currentRow.length; i++) {
        if (currentRow[i] > maxRowWeight) {
          maxIndex = i;
          maxRowWeight = currentRow[i];
        }
      }
      maxRoute.weight = maxRoute.weight + maxRowWeight;
      maxRoute.routeNodes.push(maxIndex);
      src = maxIndex;
    }
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

  private writeRouteToJson(route: IRoute) {

  }

  private writeRoutesToJson(routes: IRoute[]) {

  }

  private static generateRandomColor(): string {
    return Math.floor(Math.random() * 16777215).toString(16);
  }


  private updateRoutes(routes: IRoute[]) {
    for (let i = 0; i < routes.length; i++) {
      let route = this.buildRoute(routes[i], i);
      this.routesMap.set(i, route);
    }
    let s = 5;
  }

  private buildRoute(route: IRoute, routeId: number,
                     primaryTextColor: string = "ffffff", secondaryTextColor: string = "187aab", visible: boolean = true): Route {
    let currentRoute: Route = new Route();
    currentRoute.routeId = routeId;
    currentRoute.color = RouteGenerationAlgorithmService.generateRandomColor();
    currentRoute.primaryTextColor = primaryTextColor;
    currentRoute.secondaryTextColor = secondaryTextColor;
    currentRoute.visible = visible;
    currentRoute.points = this.convertPointsIdToPoints(route.routeNodes);
    return currentRoute;
  }

  private convertPointsIdToPoints(pointsIdsAsIndex: number[]): Point[] {
    let result: Point[] = [];
    pointsIdsAsIndex.forEach(pointIdAsIndex => {
      result.push(this.mapIndexToPoint.get(pointIdAsIndex))
    });
    return result;
  }

  private buildMapIndexToPointId() {
    this.mapPointIdToIndex.forEach((value: number, key: number) => {
      this.mapIndexToPoint.set(value, this.pointsMap.get(key));
    });
  }

  private findMaxIndex(numbers:number[]): number
  {
    let maxIndex = -1;
    let max = 0;
    for(let i = 0; i< numbers.length; i++)
    {
      if (numbers[i] > max){
        maxIndex = i;
        max = numbers[i];
      }
    }
    return maxIndex;
  }
  /*
  1   2   3   4   5

  2       10

  3           7

  4   8

  5
   */
  private expandFromSource (source: number){
    this.routeHavePassed.push(source);
    if (!this.haveNextEdgeRow(source)) {
      return source;
    }
    let maxIndex = this.getMaxIndexFromEdgesRow(source);
    if (maxIndex == -1){
      return source;
    }
    return this.expandFromSource(maxIndex);
  }

  private expandToSource (source: number){
    if (!this.haveNextEdgeColumn(source)) {
      return source;
    }
    let maxIndex = this.getMaxIndexFromEdgesColumn(source);
    if (maxIndex == -1){
      return source;
    }
    this.routeHavePassed.unshift(maxIndex);

    return this.expandFromSource(maxIndex);
  }

  private haveNextEdgeRow(point:number):boolean{
    let result: boolean = false;
    let currentRowEdges = this.graph[point];
    for (let i = 0; i< currentRowEdges.length; i++){
      if (currentRowEdges[i] >0 && !this.routeHavePassed.includes(i)){
        result = true;
      }
    }
    return result
  }

  private haveNextEdgeColumn(point:number):boolean{
    let result: boolean = false;
    let currentColumnEdges = this.getColumn(this.graph,point);
    for (let i = 0; i< currentColumnEdges.length; i++){
      if (currentColumnEdges[i] > 0 &&!this.routeHavePassed.includes(i)){
        result = true;
      }
    }
    return result
  }

  private getMaxIndexFromEdgesRow(source: number){
    let maxIndex = -1;
    let max = 0;
    let currentRowEdges = this.graph[source];
    for(let i = 0; i< currentRowEdges.length; i++)
    {
      if ((!this.routeHavePassed.includes(i)) && currentRowEdges[i] > max){
        maxIndex = i;
        max = currentRowEdges[i];
      }
    }
    return maxIndex;
  }

  private getMaxIndexFromEdgesColumn(source: number){
    let maxIndex = -1;
    let max = 0;
    let currentColumnEdges = this.getColumn(this.graph,source);
    for(let i = 0; i< currentColumnEdges.length; i++)
    {
      if ((!this.routeHavePassed.includes(i)) && currentColumnEdges[i] > max){
        maxIndex = i;
        max = currentColumnEdges[i];
      }
    }
    return maxIndex;
  }
}
