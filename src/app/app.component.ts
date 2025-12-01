import { Component, AfterViewInit, inject} from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, RouterLinkActive } from '@angular/router';
import { Dropdown, Collapse } from 'bootstrap';
import { BootstrapLoaderComponent } from './pages/bootstrap-loader/bootstrap-loader.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLinkWithHref, RouterLinkActive, BootstrapLoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  title = 'busTicketBookingApp';


  constructor() {
  }

  ngAfterViewInit(): void {
      const dropdownEl = document.getElementById('navbarDropdown');
      if (dropdownEl) {
        new Dropdown(dropdownEl);
      }

      const bookingDropdownEl = document.getElementById('bookingDropdown');
      if (bookingDropdownEl) {
        new Dropdown(bookingDropdownEl);
      }

      const collapseEl = document.getElementById('navbarNav');
      if (collapseEl) {
        new Collapse(collapseEl, { toggle: false });
      }

  }
}
