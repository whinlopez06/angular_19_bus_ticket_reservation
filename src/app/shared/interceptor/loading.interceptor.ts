import { HttpInterceptorFn } from '@angular/common/http';
import { LoadingService } from '../loading.service';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loading = inject(LoadingService);
  loading.start();  // start loader

  return next(req).pipe(
    finalize(() => loading.stop()) // stop loader always
  );
};
