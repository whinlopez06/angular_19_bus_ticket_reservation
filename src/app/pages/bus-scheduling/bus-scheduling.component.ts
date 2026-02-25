import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LocationDropdownComponent } from '../../reusable/location-dropdown/location-dropdown.component';
import { BusScheduleService } from '../../services/bus-schedule.service';
import { BusDetailService } from '../../services/bus-detail.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BusDetailBusApi } from '../../interface/busDetail.interface';
import { BusSchedule, BusScheduleApi, BusScheduleList2Api, BusScheduleListApi } from '../../interface/busSchedule.interface'
import { ToastService } from '../../shared/toast.service';
import { formatDate } from '../../shared/date-format-handler';
import { TimeFormatDirective } from '../../directive/time-format.directive';
import * as bootstrap from 'bootstrap';
import { BusDropdownComponent } from '../../reusable/bus-dropdown/bus-dropdown.component';

@Component({
  selector: 'app-bus-scheduling',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule,
    LocationDropdownComponent, TimeFormatDirective, BusDropdownComponent],
  templateUrl: './bus-scheduling.component.html',
  styleUrl: './bus-scheduling.component.css'
})
export class BusSchedulingComponent implements OnInit {


  busScheduleService = inject(BusScheduleService);
  busDetailService = inject(BusDetailService);
  toast = inject(ToastService);
  private destroyRef = inject(DestroyRef);
  formatDate = formatDate;

  dropDownFromLocationValue = signal<number>(0);
  dropDownToLocationValue = signal<number>(0);
  singleDate = signal<string>('');
  dropDownBusValue = signal<number>(0);
  seatCapacity = signal<number>(0);
  price = signal<number>(0);
  buses = signal<any[]>([]);
  busIndexValue = signal<number>(0);

  busDetails = signal<BusDetailBusApi[]>([]);
  busScheduleList = signal<BusScheduleList2Api[]>([]);

  busScheduleParams = signal<BusSchedule>({
    id: 0,
    busDetailId: 0,
    fromLocationId: 0,
    toLocationId: 0,
    boardingTime: "",
    travelDate: ""
  });

  busScheduleParamsApi = signal<BusScheduleApi>({
    id: 0,
    bus_detail_id: 0,
    from_location_id: 0,
    to_location_id: 0,
    boarding_time: '',
    travel_date: ''
  });

  //busScheduleData!: BusScheduleListApi;
  busScheduleData = signal<BusScheduleListApi>({
    id: 0,
    bus_detail_id: 0,
    bus_name: '',
    description: '',
    from_location: '',
    to_location: '',
    from_location_id: 0,
    to_location_id: 0,
    boarding_time: '',
    travel_date: '',
    seat_capacity: 0,
    price: 0
  });

  selectedOption: string = 'option1';
  //busIndexValue: number = 0;
  operatorName: string | null = "";
  dateType: 'single' | 'multiple' = 'single';
  startDate: string = '';
  endDate: string = '';
  modalReady: boolean = false;
  modalMode: string = 'create';

  constructor() {
  }

  ngOnInit(): void {
    this.closeModal();
    this.loadBusScheduleLists();
    this.loadBusesName();
    this.busIndexValue.set(0);
  }

  openModal(mode: string = 'create') {
    if (mode == 'create') {
      this.dateType = 'single';
      this.clearFields();
    }
    if (mode == 'update') {

    }
    this.modalMode = mode;

    const modal = bootstrap.Modal.getOrCreateInstance('#scheduleModal');
    modal.show();
    setTimeout(() => {
      this.modalReady = true;
    });
  }

  closeModal() {
    const modal = bootstrap.Modal.getOrCreateInstance('#scheduleModal');
    modal.hide();
    this.modalReady = false;
  }

  handleOnChildFromLocation(value: any): void {
    this.busScheduleParams().fromLocationId = Number(value);
  }

  handleOnChildToLocation(value: any): void {
    this.busScheduleParams().toLocationId = Number(value);
  }

  handleOnChildBusDetail(value: any) {
    this.busScheduleParams().busDetailId = Number(value);
  }

  handleOnChildBusOptions(options: any) {
    this.busScheduleParams().seatCapacity = options.seat_capacity;
    this.busScheduleParams().price = options.price;
  }

  dateRadioChange(optionName: string): void {
    this.selectedOption = optionName;
  }

  loadBusesName(): void {
    this.busDetailService.getBusesDetail()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: busDetails => {
        this.busDetails.set(busDetails);
      },
      error: err => {
         this.toast.showError(err.message);
      }
    });
  }

  // onBusChange(event: any) {
  //   const select = event.target as HTMLSelectElement;
  //   const selectedIndex = select.selectedIndex; // subtract 1 for the please select bus
  //   console.log('selectedIndex:...', selectedIndex);
  //   if (selectedIndex > 0) {
  //     this.operatorName = this.busDetails()[selectedIndex - 1].operator_name;
  //     this.seatCapacity = this.busDetails()[selectedIndex - 1].seat_capacity;
  //     this.busScheduleParams().busDetailId = this.busDetails()[selectedIndex -1].id;  // bus_detail_id
  //   } else {
  //     this.operatorName = "";
  //   }
  // }

  loadBusScheduleLists(): void {
    this.busScheduleService.getBusSchedules()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: busSchedule => {
        this.busScheduleList.set(busSchedule);
      },
      error: err => {
        this.toast.showError(err.message);
      }
    });
  }

  createBusSchedule() {

    // ongoing
    // this.busScheduleParamsApi = {
    //   bus_detail_id: this.busScheduleParams.busDetailId,
    //   from_bus_location_id: this.busScheduleParams.fromBusLocationId,
    //   to_bus_location_id: this.busScheduleParams.toBusLocationId,
    //   departure_time: this.busScheduleParams.departureTime,
    //   arrival_time: this.busScheduleParams.arrivalTime,
    //   schedule_date: this.busScheduleParams.scheduleDate
    // }

    this.setParams();

    //this.closeModal();
    //this.toast.showInfo('This feature is currently under development. Please check back soon.');

    // this.busScheduleParamsApi().bus_detail_id = this.busScheduleParams().busDetailId;
    // this.busScheduleParamsApi().from_location_id = this.busScheduleParams().fromLocationId;
    // this.busScheduleParamsApi().to_location_id = this.busScheduleParams().toLocationId;

    this.busScheduleService.createBusSchedule(this.busScheduleParamsApi())
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: response => {
        this.toast.showSuccess(response.message);
        this.clearFields();
        this.loadBusScheduleLists();
        this.closeModal();
      }, error: err => {
        this.toast.showError(err.message);
      }
    });
  }

  editBusSchedule(busSchedule: any) {
    console.log('edit busSchedule:...', busSchedule);
    this.busScheduleParams().id = busSchedule.id;
    console.log('busScheduleParams.id: ..', this.busScheduleParams().id);
    this.getBusScheduleById(busSchedule.id);
    this.openModal('update');
  }

  setParams() {
    this.busScheduleParamsApi.set({
      bus_detail_id: this.busScheduleParams().busDetailId,
      from_location_id: this.busScheduleParams().fromLocationId,
      to_location_id: this.busScheduleParams().toLocationId,
      travel_date: this.busScheduleParams().travelDate,
      boarding_time: this.busScheduleParams().boardingTime
    });
  }

  updateBusSchedule() {
    this.setParams();

    let updateParams = {
      id: this.busScheduleParams().id,
      bus_detail_id: this.busScheduleParams().busDetailId,
      from_location_id: this.busScheduleParams().fromLocationId,
      to_location_id: this.busScheduleParams().toLocationId,
      boarding_time: this.busScheduleParams().boardingTime,
      travel_date: this.busScheduleParams().travelDate,
    }
    this.busScheduleService.updateBusSchedule(updateParams)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: response => {
        console.log('update message: ', response);
        this.toast.showSuccess(response.message);
        this.loadBusScheduleLists();
      }, error: err => {
        this.toast.showError(err.message);
      }
    });
  }

  deleteBusSchedule(id: number) {
    const confirmation = confirm('Are you sure you want to delete this schedule?');
    if (!confirmation) {
      return;
    }

    this.busScheduleService.deleteBusSchedule(id)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: response => {
        console.log('delete message: ', response);
        this.toast.showSuccess(response.message);
        this.loadBusScheduleLists();
      }, error: err => {
        this.toast.showError(err.message);
      }
    });
  }

  getBusScheduleById(scheduleId: number) {
    this.busScheduleService.getBusScheduleById(scheduleId)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: busScheduleData => {
        this.busScheduleData.set(busScheduleData);
        //this.dropDownFromLocationValue.set(2);
        console.log('busScheduleData:...', this.busScheduleData());
        this.dropDownFromLocationValue.set(busScheduleData.from_location_id ?? 0);
        this.dropDownToLocationValue.set(busScheduleData.to_location_id ?? 0);
        this.dropDownBusValue.set(busScheduleData.bus_detail_id);

        // this.seatCapacity.set(busScheduleData.seat_capacity);
        // this.price.set(busScheduleData.price);


        //console.log('dropDownFromLocationValue: ', this.dropDownFromLocationValue());
        //console.log('dropDownToLocationValue: ', this.dropDownToLocationValue());
        //console.log('busScheduleData: ', busScheduleData);

        // ongoing
      this.busScheduleParams.set({
        id: scheduleId,
        busDetailId: this.busScheduleData().bus_detail_id,
        fromLocationId: this.busScheduleData().from_location_id ?? 0,
        toLocationId: this.busScheduleData().to_location_id ?? 0,
        travelDate: this.busScheduleData().travel_date,
        boardingTime: this.busScheduleData().boarding_time,
        seatCapacity: this.busScheduleData().seat_capacity,
        price: this.busScheduleData().price
      });

      },
      error: err => {
        this.toast.showError(err.message);
      }
    });
  }

  clearFields() {
    // ongoing
    this.busScheduleParams.set({
      busDetailId: 0,
      fromLocationId: 0,
      toLocationId: 0,
      boardingTime: '',
      travelDate: '',
      seatCapacity: 0,
      price: 0
    });

    this.dropDownFromLocationValue.set(0);
    this.dropDownToLocationValue.set(0);
    this.busIndexValue.set(0);
    this.operatorName = "";
    this.seatCapacity.set(0);
    this.price.set(0);
  }

}
