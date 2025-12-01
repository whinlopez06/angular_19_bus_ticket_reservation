import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private toastr = inject(ToastrService);

  constructor() { }

  showSuccess(message: string, title: string = '', timeOut: number = 4000) {
    if (!message) {
      message = 'Success';
    }
    this.toastr.success(message, title, {
      timeOut: timeOut,
      progressBar: true,
      positionClass: 'toast-top-right'
    })
  }

  showError(message: string, title: string = '', timeOut: number = 4000) {
    if (!message) {
      message = 'Something went wrong';
    }
    this.toastr.error(message, title, {
      timeOut: timeOut,
      progressBar: true,
      positionClass: 'toast-top-right'
    });
  }

  showInfo(message: string, title: string = '', timeOut: number = 4000) {
    this.toastr.info(message, title, {
      timeOut: timeOut,
      progressBar: true,
      positionClass: 'toast-top-right'
    });
  }

  showWarning(message: string, title: string = '', timeOut: number = 4000) {
    this.toastr.warning(message, title, {
      timeOut: timeOut,
      progressBar: true,
      positionClass: 'toast-top-right'
    });
  }

}
