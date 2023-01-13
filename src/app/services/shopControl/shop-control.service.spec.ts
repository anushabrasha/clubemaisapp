import { TestBed } from '@angular/core/testing';

import { ShopControlService } from './shop-control.service';

describe('ShopControlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShopControlService = TestBed.get(ShopControlService);
    expect(service).toBeTruthy();
  });
});
