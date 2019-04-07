export class AircraftType {
  aircraftTypeId: number;
  name: string;
  category: string;
  type: string;
  icon: string;
  image: string;
  classification: string;
  description: string;
  manufactured: string;
  dimensions: string;
  performance: string;
  weight: string;
  engine: string;

  constructor(json: string)
  {
    let obj = JSON.parse(json)
    this.aircraftTypeId = obj.aircraftTypeId;
    this.name = obj.name;
    this.category = obj.category;
    this.type = obj.type;
    this.icon = obj.icon;
    this.image = obj.image;
    this.classification = obj.classification;
    this.description = obj.description;
    this.manufactured = obj.manufactured;
    this.dimensions = obj.dimensions;
    this.performance = obj.performance;
    this.weight = obj.weight;
    this.engine = obj.engine;
  }

  /*constructor(aircraftTypeId: number, name: string, category: string, type: string, icon: string, image: string, classification: string, description: string, manufactured: string, dimensions: string, performance: string, weight: string, engine: string) {
    this.aircraftTypeId = aircraftTypeId;
    this.name = name;
    this.category = category;
    this.type = type;
    this.icon = icon;
    this.image = image;
    this.classification = classification;
    this.description = description;
    this.manufactured = manufactured;
    this.dimensions = dimensions;
    this.performance = performance;
    this.weight = weight;
    this.engine = engine;
  }*/

}
