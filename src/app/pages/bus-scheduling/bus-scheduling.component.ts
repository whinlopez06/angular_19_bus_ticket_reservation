import { Component, DestroyRef, inject, OnInit, signal, computed } from '@angular/core';
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
  dropDownBusValue = signal<number>(0);
  seatCapacity = signal<number>(0);
  price = signal<number>(0);
  buses = signal<any[]>([]);

  busDetails = signal<BusDetailBusApi[]>([]);
  busScheduleList = signal<BusScheduleList2Api[]>([]);

  busScheduleParams = signal<BusSchedule>({
    id: 0,
    busDetailId: 0,
    fromLocationId: 0,
    toLocationId: 0,
    boardingTime: "",
    travelDate: "",
    seatCapacity: 0,
    price: 0
  });

  busScheduleParamsApi = signal<BusScheduleApi>({
    id: 0,
    bus_detail_id: 0,
    from_location_id: 0,
    to_location_id: 0,
    boarding_time: '',
    travel_date: ''
  });

  busScheduleParamsApiArray = signal<BusScheduleApi[]>([]);

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
  operatorName: string | null = "";
  dateType: 'single' | 'multiple' = 'single';
  startDate: string = '';
  endDate: string = '';
  modalReady: boolean = false;
  modalMode: string = 'create';

  searchText = signal('');
  filteredSchedules = computed(() => {
    const search = this.searchText().toLowerCase();

    if (!search) return this.busScheduleList();

    return this.busScheduleList().filter(schedule => {
      const searchable = `
        ${schedule.from_location}
        ${schedule.to_location}
        ${schedule.bus_full_description}
        ${schedule.travel_date}
        ${schedule.boarding_time}
        ${schedule.seat_capacity}
        ${schedule.price}
      `.toLowerCase();

      return searchable.includes(search);
    });
  });


  constructor() {
  }

  ngOnInit(): void {
    this.closeModal();
    this.loadBusScheduleLists();
    this.loadBusesName();
  }

  openModal(mode: string = 'create') {
    this.dateType = 'single';
    this.modalMode = mode;
    if (mode == 'create') {
      this.clearFields();
      this.dropDownBusValue.set(0);
    }

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

  // create new schedule
  createBusSchedule() {
    this.setScheduleApiParams();
    let params = signal<BusScheduleApi[]>([]);
    // check first if single date or ranged
    if (this.dateType  == 'multiple') {
      // compute date range and create multiple array or insert
      params.set(this.busScheduleParamsApiArray());
    } else {
      params.set([this.busScheduleParamsApi()]);
      this.closeModal();
    }

    this.busScheduleService.createBusSchedule(params())
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
    this.busScheduleParams().id = busSchedule.id;
    this.setScheduleParams(busSchedule);
    this.openModal('update');
  }

  updateBusSchedule() {
    //this.setScheduleApiParams(true);

    let updateParams: BusScheduleApi = {
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
        this.closeModal();
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
        this.dropDownFromLocationValue.set(busScheduleData.from_location_id ?? 0);
        this.dropDownToLocationValue.set(busScheduleData.to_location_id ?? 0);
        this.dropDownBusValue.set(busScheduleData.bus_detail_id);

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

  setScheduleParams(scheduleData: BusScheduleApi) {
    this.busScheduleParams.set({
      id: scheduleData.id,
      busDetailId: scheduleData.bus_detail_id,
      fromLocationId: scheduleData.from_location_id,
      toLocationId: scheduleData.to_location_id,
      boardingTime: scheduleData.boarding_time,
      travelDate: scheduleData.travel_date,
      seatCapacity: scheduleData.seat_capacity,
      price: scheduleData.price
    });

    this.dropDownFromLocationValue.set(scheduleData.from_location_id);
    this.dropDownToLocationValue.set(scheduleData.to_location_id);
    this.dropDownBusValue.set(scheduleData.bus_detail_id);
  }

  setScheduleApiParams(isForUpdate: boolean = false) {
    if (isForUpdate) {
        this.busScheduleParamsApi.set({
          id: this.busScheduleParams().id,
          bus_detail_id: this.busScheduleParams().busDetailId,
          from_location_id: this.busScheduleParams().fromLocationId,
          to_location_id: this.busScheduleParams().toLocationId,
          travel_date: this.busScheduleParams().travelDate,
          boarding_time: this.busScheduleParams().boardingTime
      });
    } else {
      // multiple insert
      if (this.dateType == 'multiple') {
        this.setScheduleParamsApiArray();
      } else {
        // single insert
        this.busScheduleParamsApi.set({
          bus_detail_id: this.busScheduleParams().busDetailId,
          from_location_id: this.busScheduleParams().fromLocationId,
          to_location_id: this.busScheduleParams().toLocationId,
          travel_date: this.busScheduleParams().travelDate,
          boarding_time: this.busScheduleParams().boardingTime
        });
      }
    }
  }

  setScheduleParamsApiArray() {
    const dates = [];
    let startDate = new Date(this.startDate);
    let endDate = new Date(this.endDate);
    // loop through the dates
    while(startDate <= endDate) {
      dates.push({
        bus_detail_id: this.busScheduleParams().busDetailId,
        from_location_id: this.busScheduleParams().fromLocationId,
        to_location_id: this.busScheduleParams().toLocationId,
        travel_date: startDate.toISOString().split('T')[0],
        boarding_time: this.busScheduleParams().boardingTime
      });
      startDate.setDate(startDate.getDate() + 1);
    }
    this.busScheduleParamsApiArray.set(dates);
  }

  clearFields() {
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
    this.operatorName = "";
    this.seatCapacity.set(0);
    this.price.set(0);
    this.searchText.set('');
  }

}
