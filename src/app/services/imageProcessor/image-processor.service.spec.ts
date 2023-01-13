import { TestBed } from '@angular/core/testing';

import { ImageProcessorService } from './image-processor.service';

describe('ImageProcessorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImageProcessorService = TestBed.get(ImageProcessorService);
    expect(service).toBeTruthy();
  });
});
