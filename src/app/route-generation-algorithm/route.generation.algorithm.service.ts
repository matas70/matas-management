import {Injectable} from '@angular/core';
import {from} from 'rxjs';
import {DataService} from "../data/data.service";

@Injectable({
  providedIn: 'root'
})
export class RouteGenerationAlgorithmService {

  private mapPointToIndex = new Map();

  constructor(private dataService: DataService) {

  }

  public getData() {
  }

  private buildMapPointToIndex() {
    // iterate over all points to build map
    for (let i = 0; i < 5; i++) {
      if (!this.mapPointToIndex.has(point[i])){
        this.mapPointToIndex.set(point[i], i)
      }
    }
  }
}
