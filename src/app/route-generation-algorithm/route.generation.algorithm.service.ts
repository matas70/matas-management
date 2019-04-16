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

class AdjListNode {
  constructor(private v: number, private weight: number) {
    this.v = v;
    this.weight = weight;
  }
  v: number;
  weight: number;
}

@Injectable({
  providedIn: 'root'
})
export class RouteGenerationAlgorithmService {
  constructor(private dataService: DataService, private store: Store<any>) {
    this.graph = [[], []];
    store.select('aircraft').subscribe((aircraft: Map<number, Aircraft>) => {
      this.aircrafts = Array.from(aircraft.values());
    });
    store.select('points').subscribe((points: Map<number, Point>) => {
      this.pointsMap = points;
    });
  }

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

  private edges: Array<Array<AdjListNode>>;

  private static generateRandomColor(): string {
    return Math.floor(Math.random() * 16777215).toString(16);
  }

  // algorithm:
  // 1. convert input data to graph
  // 2. iteration: while there are edges
  //      1. find source and dest
  //      2. find the maximal weight route
  //      3. delete edges, who found at level before
  // 3. write result to file
  public generate_routes(): string {
    const routes: IRoute[] = [];
    this.buildMapPointIdToIndex();
    this.buildMapIndexToPointId();
    const numberOfPoint: number = this.mapPointIdToIndex.size;

    this.edges = new Array<Array<AdjListNode>>(6);
    for (let i = 0; i < 6; i++) {
      this.edges[i] = new Array<AdjListNode>();
    }
    this.addEdge(0, 1, 5);
    this.addEdge(0, 2, 3);
    this.addEdge(1, 3, 6);
    this.addEdge(1, 2, 2);
    this.addEdge(2, 4, 4);
    this.addEdge(2, 5, 2);
    this.addEdge(2, 3, 7);
    this.addEdge(3, 5, 1);
    this.addEdge(3, 4, -1);
    this.addEdge(4, 5, -2);

    this.longestPath(1, 6);

    this.graph = new Array(numberOfPoint).fill(0).map(() => new Array(numberOfPoint).fill(0));
    this.buildGraph();
    while (this.haveEdge(this.graph)) {
      // don't ask why i use the temp value but its not work
      // if i send the function, like: this.findSrc(this.findMaxEdge());
      const [x, y, z] = this.findMaxEdge();
      const src = this.findSrc([x, y, z]);
      const dest = this.findDest([x, y, z]);
      if (src == dest) {
        break;
      }
      const maximalRoute = this.findMaximalRoute1(this.graph, src, dest);
      routes.push(maximalRoute);
      this.removeMaximalRoute(this.graph, maximalRoute.routeNodes);
    }
    this.updateRoutes(routes);

    // return a json representation of routes
    return JSON.stringify(Array.from(this.routesMap.values()));
  }

  private buildMapPointIdToIndex() {
    // iterate over all aircrafts
    for (let i = 0; i < this.aircrafts.length; i++) {
      const currentAircraft = this.aircrafts[i];
      const points = currentAircraft.path;
      // iterate over all points to build map
      for (let j = 0; j < points.length; j++) {
        if (!this.mapPointIdToIndex.has(points[j].pointId)) {
          this.mapPointIdToIndex.set(points[j].pointId, j);
        }
      }
    }
  }

  private buildGraph() {
    // iterate over all aircrafts
    for (let i = 0; i < this.aircrafts.length - 1; i++) {
      const currentAircraft = this.aircrafts[i];
      const points = currentAircraft.path;
      for (let j = 0; j < points.length - 1; j++) {
        const sourcePoint = points[j];
        const sourcePointIndex = this.mapPointIdToIndex.get(sourcePoint.pointId);
        const destPoint = points[j + 1];
        const destPointIndex = this.mapPointIdToIndex.get(destPoint.pointId);
        this.graph[sourcePointIndex][destPointIndex]++;
      }
    }
  }

  // The algorithm is go on the column of of the index of
  // srcMaxEdge and check if there is a edge with the same weight
  // if found run again with the new srcMaxEdge
  // currently, 08/04/2019 we assume there is no circle
  // this.findMaxEdge();
  /*
  1   2   3   4   5

  2       10

  3

  4   10

  5
   */
  private findSrc([srcMaxEdge, destMaxEdge, maxWeight], deviationInPercent = 5): number {
    const candidateSrc = srcMaxEdge;
    for (let i = 0; i < this.graph[srcMaxEdge].length; i++) {
      const currentColumn = this.getColumn(this.graph, srcMaxEdge);
      if (i != destMaxEdge && maxWeight == currentColumn[i]) {
        return this.findSrc([i, srcMaxEdge, maxWeight]);
      } else {
        //  check for more edges with deviation of number's plan
        if (i != destMaxEdge && this.isBetween(maxWeight, currentColumn[i])) {
          return this.findSrc([i, srcMaxEdge, maxWeight]);
        }
      }
    }
    return candidateSrc;
  }

  private isBetween(weight: number, value: number, deviationInPercent: number = 6.5): boolean {
    return ((weight < value && Math.ceil(weight + weight * deviationInPercent / 100) > value) ||
      (weight > value && Math.floor(weight - weight * deviationInPercent / 100) < value));
  }

  /*
  1   2   3   4   5

  2       10

  3

  4   10

  5
   */

  // the opposite of the findSrc
  private findDest([srcMaxEdge, destMaxEdge, maxWeight]): number {
    const candidateDest = destMaxEdge;
    // assume this.graph[srcMaxEdge] bring the column
    for (let i = 0; i < this.graph[destMaxEdge].length; i++) {
      const currentRow = this.graph[destMaxEdge];
      if (i != destMaxEdge && maxWeight == currentRow[i]) {
        return this.findDest([destMaxEdge, i, maxWeight]);
      } else {
        if (i != destMaxEdge && this.isBetween(maxWeight, currentRow[i])) {
          return this.findDest([i, srcMaxEdge, maxWeight]);
        }
      }
    }
    return candidateDest;
  }

  private getColumn(matrix, col: number) {
    const column = [];
    for (let i = 0; i < matrix.length; i++) {
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
          maxJ = j;
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

    /* Iterate backwards, starting at the dest node, to find the
       maximum route                                              */
    for (let i = 0; i < graph[0].length; i++) {
      if (graph[i][dest] == 0) {
        continue;
      }

      /* In both cases maxRoute.weight contains the weight from src to
         i, dest NOT included.                                        */
      if (routeHavePassed.includes(i)) {
        maxRoute = {weight: 0, routeNodes: [src]};
      } else {
        routeHavePassed.push(i);
        if (i == src) {
          maxRoute = {weight: 0, routeNodes: [src]};
        } else {
          maxRoute = this.findMaximalRoute(graph, src, i, routeHavePassed);
        }
      }


      /* Add the weight of i-dest to the weight up to i, and see
         whether the total weight is bigger than the current max value */
      const maxWeightCompare = maxRoute.weight + graph[i][dest];
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

  private findMaximalRoute1(graph: number[][],
                            src: number, dest: number): IRoute {
    const maxWeightCurrent = 0;       // The current maximal route's total
    const maxWeightCurrentNodes = []; // The nodes for maxWeightCurrent
    let maxRoute: IRoute;           // The maximal route to return
    if (!maxRoute) {
      maxRoute = {weight: 0, routeNodes: [src]};
    }

    while (src != dest) {
      const currentRow = graph[src];
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


  private updateRoutes(routes: IRoute[]) {
    for (let i = 0; i < routes.length; i++) {
      const route = this.buildRoute(routes[i], i);
      this.routesMap.set(i, route);
    }
    const s = 5;
  }

  private buildRoute(route: IRoute, routeId: number,
                     primaryTextColor: string = 'ffffff', secondaryTextColor: string = '187aab', visible: boolean = true): Route {
    const currentRoute: Route = new Route();
    currentRoute.routeId = routeId;
    currentRoute.color = RouteGenerationAlgorithmService.generateRandomColor();
    currentRoute.primaryTextColor = primaryTextColor;
    currentRoute.secondaryTextColor = secondaryTextColor;
    currentRoute.visible = visible;
    currentRoute.points = this.convertPointsIdToPoints(route.routeNodes);
    return currentRoute;
  }

  private convertPointsIdToPoints(pointsIdsAsIndex: number[]): Point[] {
    const result: Point[] = [];
    pointsIdsAsIndex.forEach(pointIdAsIndex => {
      result.push(this.mapIndexToPoint.get(pointIdAsIndex));
    });
    return result;
  }

  private buildMapIndexToPointId() {
    this.mapPointIdToIndex.forEach((value: number, key: number) => {
      this.mapIndexToPoint.set(value, this.pointsMap.get(key));
    });
  }

  private addEdge(u: number, v: number, weight: number) {
    const node: AdjListNode = new AdjListNode(v, weight);
    this.edges[u].push(node);
  }

  private topologicalSortUtil(v: number, visited: boolean[], stack: number[]) {
    // Mark the current node as visited
    visited[v] = true;

    // Recur for all the vertices adjacent to this vertex
    for (const node of this.edges[v]) {
      if (!visited[node.v]) {
        this.topologicalSortUtil(node.v, visited, stack);
      }
    }

    // Push current vertex to stack which stores topological
    // sort
    stack.push(v);
  }

  private longestPath(startPoint: number, numOfPoints: number) {
    const NINF = -9999999;
    const stack: number[] = [];
    const dist: number[] = [];
    const visited: boolean[] = [];

    //  Mark all the vertices as not visited
    for (let i = 0; i < numOfPoints; i++) {
      visited[i] = false;
    }

    // Call the recursive helper function to store Topological
    // Sort starting from all vertices one by one
    for (let i = 0; i < numOfPoints; i++) {
      if (visited[i] === false) {
        this.topologicalSortUtil(i, visited, stack);
      }
    }

    // Initialize distances to all vertices as infinite and
    // distance to source as 0
    for (let i = 0; i < numOfPoints; i++) {
      dist[i] = NINF;
    }
    dist[startPoint] = 0;

    // Process vertices in topological order
    while (stack.length > 0) {
      /* Get the next vertex from topological order*/
      const u: number = stack.pop();

      // Update distances of all adjacent vertices
      if (dist[u] !== NINF) {
        for (const node of this.edges[u]) {
          if (dist[node.v] < dist[u] + node.weight) {
            dist[node.v] = dist[u] + node.weight;
          }
        }
      }
    }

    // Print the calculated longest distances
    let longestDistance = NINF;
    let targetNode = startPoint;

    for (let i = 0; i < numOfPoints; i++) {
      if (dist[i] > longestDistance) {
        targetNode = i;
        longestDistance = dist[i];
      }
    }


  }
}
