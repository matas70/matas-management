import {Injectable, Type} from "@angular/core";
import {Resolver} from "@angular/core/testing/src/resolvers";
import {DataService} from "./data.service";

@Injectable()
export class DataResolver implements Resolver<any> {

  constructor(private data: DataService) {

  }

  resolve(type: Type<any>): any | null {

    //this.data.getData();
    return this.data.loadData();

  }

}
