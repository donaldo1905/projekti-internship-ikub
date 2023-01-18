import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrEditFormComponent } from './add-or-edit-form.component';

describe('AddOrEditFormComponent', () => {
  let component: AddOrEditFormComponent;
  let fixture: ComponentFixture<AddOrEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOrEditFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOrEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
