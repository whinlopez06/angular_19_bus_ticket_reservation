import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BootstrapLoaderComponent } from './bootstrap-loader.component';

describe('BootstrapLoaderComponent', () => {
  let component: BootstrapLoaderComponent;
  let fixture: ComponentFixture<BootstrapLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BootstrapLoaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BootstrapLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
