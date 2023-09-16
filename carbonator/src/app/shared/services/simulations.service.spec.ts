import { TestBed, inject } from '@angular/core/testing';

import { SimulationsService } from './simulations.service';

describe('SimulationsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SimulationsService]
    });
  });

  it('should be created', inject([SimulationsService], (service: SimulationsService) => {
    expect(service).toBeTruthy();
  }));
});
