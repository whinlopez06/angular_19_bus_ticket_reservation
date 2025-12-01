import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleDatePickerComponent } from './schedule-date-picker.component';

describe('ScheduleDatePickerComponent', () => {
  let component: ScheduleDatePickerComponent;
  let fixture: ComponentFixture<ScheduleDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleDatePickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
