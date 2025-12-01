import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusDropdownComponent } from './bus-dropdown.component';

describe('BusDropdownComponent', () => {
  let component: BusDropdownComponent;
  let fixture: ComponentFixture<BusDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
