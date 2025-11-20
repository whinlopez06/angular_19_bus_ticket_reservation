import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private activeRequests = signal(0);
  private totalRequests = signal(0);  // total ongoing requests for progress calculation

  readonly isLoading = computed(() => this.activeRequests() > 0);
  // Calculate progress (0-100%)
  readonly progress = computed(() => {
    const total = this.totalRequests();
    const active = this.activeRequests();
    return total > 0 ? ((total - active) / total) * 100 : 0;
  });

  constructor() { }

  start() {
    this.activeRequests.update(v => v + 1);
    this.totalRequests.update(v => v + 1);
  }

  stop() {
    this.activeRequests.update(v => Math.max(0, v -1));
    // Reset totalRequests when all requests finish
    if (this.activeRequests() === 0) {
      this.totalRequests.set(0);
    }
  }

}
