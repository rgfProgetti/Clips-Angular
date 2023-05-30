import { TestBed } from '@angular/core/testing';

import { ClipResolver } from './clip-resolver';

describe('ClipResolver', () => {
  let resolver: ClipResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ClipResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
