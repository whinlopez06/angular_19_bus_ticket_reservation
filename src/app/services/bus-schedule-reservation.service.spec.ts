import { TestBed } from '@angular/core/testing';

import { BusScheduleReservationService } from './bus-schedule-reservation.service';

describe('BusScheduleReservationService', () => {
  let service: BusScheduleReservationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusScheduleReservationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
