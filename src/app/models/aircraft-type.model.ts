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

  constructor(aircraftTypeId: number, name: string, category: string, type: string, icon: string, image: string, classification: string, description: string, manufactured: string, dimensions: string, performance: string, weight: string, engine: string) {
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
  }
}
