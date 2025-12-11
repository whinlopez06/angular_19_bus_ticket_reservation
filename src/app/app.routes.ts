import { Routes } from '@angular/router';
import { SearchComponent } from './pages/search/search.component';
import { BookingComponent } from './pages/booking/booking.component';
import { SearchResultComponent } from './pages/search-result/search-result.component';
import { BookTicketComponent } from './pages/book-ticket/book-ticket.component';
import { MyBookingsComponent } from './my-bookings/my-bookings.component';
import { BusSchedulingComponent } from './pages/bus-scheduling/bus-scheduling.component';
import { TicketReservationComponent } from './pages/ticket-reservation/ticket-reservation.component';

export const routes: Routes = [
  {
    // default route
    path: '',
    redirectTo: 'search',
    pathMatch: 'full'
  },
  {
    path: 'search',
    component: SearchComponent
  },
  // {
  //   path: 'search-result/:fromId/:toId/:date',
  //   component: SearchResultComponent
  // },
  {
    path: 'search-result',
    component: SearchResultComponent
  },
  {
    path: 'search-result/:fromId/:toId/:date',
    component: SearchResultComponent
  },
  {
    path: 'book-ticket/:scheduleId',
    component: BookTicketComponent
  },
  {
    path: 'ticket-reservation/:scheduleId',
    component: TicketReservationComponent
  },
  {
    path: 'my-booking',
    component: MyBookingsComponent
  },
  {
    path: 'bus-scheduling',
    component: BusSchedulingComponent
  }
];
