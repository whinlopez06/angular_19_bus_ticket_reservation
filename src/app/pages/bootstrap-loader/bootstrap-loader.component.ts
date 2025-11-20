import { Component, inject } from '@angular/core';
import { LoadingService } from '../../shared/loading.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-bootstrap-loader',
  imports: [NgIf],
  // templateUrl: './bootstrap-loader.component.html',
  // styleUrl: './bootstrap-loader.component.css'
  template: `
    <div *ngIf="loading.isLoading()"
         class="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center"
         style="background: rgba(0,0,0,0.3); z-index: 1050;">

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

    </div>
  `
})
export class BootstrapLoaderComponent {
  loading = inject(LoadingService);
}
