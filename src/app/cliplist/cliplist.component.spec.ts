import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CliplistComponent } from './cliplist.component';

describe('CliplistComponent', () => {
  let component: CliplistComponent;
  let fixture: ComponentFixture<CliplistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CliplistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CliplistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
