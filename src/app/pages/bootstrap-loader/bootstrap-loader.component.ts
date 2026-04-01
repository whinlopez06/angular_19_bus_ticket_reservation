import { Component, inject } from '@angular/core';
import { LoadingService } from '../../shared/loading.service';
import { NgIf } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-bootstrap-loader',
  imports: [NgIf],
  // templateUrl: './bootstrap-loader.component.html',
  // styleUrl: './bootstrap-loader.component.css'
  template: `
    <div *ngIf="loading.isLoading()"
         class="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center"
         style="background: rgba(0,0,0,0.3); z-index: 1500;">

      <!-- Bootstrap Spinner -->
      <div class="spinner-border text-primary mb-3" role="status" style="width: 3rem; height: 3rem;">
        <span class="visually-hidden">Loading...</span>
      </div>

      <!-- Bootstrap Progress Bar -->
      <div class="progress w-50" style="height: 8px;">
        <div class="progress-bar progress-bar-striped progress-bar-animated bg-primary"
             role="progressbar"
             [style.width.%]="loading.progress()"
             aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
        </div>
      </div>

      <!-- Status Text -->
      <div class="text-white fs-6">
        {{ statusText }}
      </div>

    </div>
  `,
  styles: [
    `
    .text-white {
      text-shadow: 1px 1px 2px #000;
    }
    `
  ]
})
export class BootstrapLoaderComponent {
  loading = inject(LoadingService);
  statusText: string = 'Please wait... Waiting for the Render API to respond.';
  constructor() {
    if (!environment.production) {
      this.statusText = 'Please wait… connecting to the API.';
    }
  }

}
