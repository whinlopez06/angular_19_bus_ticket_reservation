import { Component, DestroyRef, EventEmitter, inject, Input, input, OnInit, output, Output, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { BusDetailService } from '../../services/bus-detail.service';
import { ToastService } from '../../shared/toast.service';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BusDetailBusApi } from '../../interface/busDetail.interface';

@Component({
  selector: 'app-bus-dropdown',
  imports: [CommonModule, FormsModule],
  templateUrl: './bus-dropdown.component.html',
  styleUrl: './bus-dropdown.component.css'
})
export class BusDropdownComponent implements OnInit {

  busDetailService = inject(BusDetailService)
  toast = inject(ToastService);
  private destroyRef = inject(DestroyRef);

  @Input() label: string = 'Bus name';
  @Input() icon: string = 'fa-bus';
  @Input() defaultOption: string = 'Select bus';
  //--@Input() options: { id:number, name: string}[] = [];
  @Input() options: BusDetailBusApi[] = [];
  @Input({required: true}) selectedValue!: ReturnType<typeof signal<number>>;

  @Output() selectedValueChange = new EventEmitter<number | string | null>();
  @Output() selectedObject = new EventEmitter<any>();

  ngOnInit(): void {
    if (this.options.length == 0) {
      this.loadBuses();
    }
  }

  onValueChange(value: number) {
    this.selectedValue.set(value);
    this.selectedValueChange.emit(this.selectedValue());
    if (value > 0) {
      const selectedObject = this.options.find(obj => obj.id == value);
      //console.log('ValueChange selectedObject: ', selectedObject);
      this.selectedObject.emit(selectedObject);
    }
  }

  loadBuses() {
    this.busDetailService.getBusesDetail()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: busDetails => {
        this.options = busDetails;
      },
      error: err => {
         this.toast.showError(err.message);
      }
    });
  }

}
