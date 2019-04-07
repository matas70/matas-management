import { Injectable } from '@angular/core';
import {from} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() {

  }

  public getData() {
    return from(["i am data"]);
  }
}
