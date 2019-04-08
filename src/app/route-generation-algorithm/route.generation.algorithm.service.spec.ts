import { TestBed } from '@angular/core/testing';

import { RouteGenerationAlgorithmService } from './route.generation.algorithm.service';

describe('DataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RouteGenerationAlgorithmService = TestBed.get(RouteGenerationAlgorithmService);
    expect(service).toBeTruthy();
  });
});
