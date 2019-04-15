interface IRoute {
    weight: number;
    routeNodes: number[];
}

function removeMaximalRoute(graph: number[][], maxRoute: number[]) {
    for (let i = 1; i < maxRoute.length; i++) {
        graph[maxRoute[i - 1]][maxRoute[i]] = 0;
    }
}

function findMaximalRoute(graph: number[][], 
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
        }
        else {
            maxRoute = findMaximalRoute(graph, src, i);
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