import { TestBed } from '@angular/core/testing';

import { AddOrEditFormResolver } from './add-or-edit-form.resolver';

describe('AddOrEditFormResolver', () => {
  let resolver: AddOrEditFormResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(AddOrEditFormResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
