// interface of data from front end going to API (using)
export interface BusScheduleSearch {
  fromLocationId?: number;
  toLocationId?: number;
  travelDate?: string | null;

}// (using)
export interface BusSchedule {
  id?: number,
  busDetailId: number,
  fromLocationId: number,
  toLocationId: number,
  boardingTime?: string,
  travelDate: string,
  seatCapacity?: number,
  price?: number
}

// interface of data coming from API (using)
export interface BusScheduleApi {
  id?: number,
  bus_detail_id: number,
  from_location_id: number,
  to_location_id: number,
  boarding_time?: string,
  //arrival_time?: string,
  travel_date: string
}


export interface BusScheduleList {
  id?: number,
  busName: string,
  description: string,
  fromBusLocation: string,
  toBusLocation: string,
  departureTime: string,
  arrivalTime: string,
  scheduleDate: string,
  seatCapacity?: number,
  price? : number
}


// interface of data coming from API (using)
export interface BusScheduleListApi {
  id: number,
  bus_detail_id: number,
  operator_name?: string,
  bus_name: string,
  description: string,
  from_location: string,
  to_location: string,
  from_location_id?: number,
  to_location_id?: number,
  boarding_time?: string,
  travel_date: string,
  seat_capacity: number,
  price: number
}
// (using)
export interface BusScheduleList2Api {
  id: number,
  bus_detail_id?: number,
  bus_full_description?: string,
  operator?: string,
  from_location: string,
  to_location: string,
  boarding_time: string,
  travel_date: string,
  seat_capacity: number,
  price: number
}

// Summary of bus schedules with group by buses with same route and date (using)
export interface BusScheduleSummaryApi {
  from_location_id: number,
  to_location_id: number,
  from_location: string,
  to_location: string,
  boarding_time?: string,
  travel_date: string,
  bus_count: number
}
