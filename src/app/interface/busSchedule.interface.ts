// interface of data from front end going to API

export interface BusScheduleSearch {
  fromLocationId?: number;
  toLocationId?: number;
  travelDate?: string | null;
}
export interface BusSchedule {
  id?: number,
  busDetailId: number,
  fromBusLocationId: number,
  toBusLocationId: number,
  departureTime?: string,
  arrivalTime?: string,
  scheduleDate: string,
  seatCapacity?: number,
  price?: number
}

// interface of data coming from API
export interface BusScheduleApi {
  bus_detail_id: number,
  from_location_id: number,
  to_bus_location_id: number,
  departure_time?: string,
  arrival_time?: string,
  schedule_date: string
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


// interface of data coming from API
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

export interface BusScheduleList2Api {
  id: number,
  bus_detail_id?: number,
  bus_full_description: string,
  operator: string,
  from_location: string,
  to_bus_location: string,
  departure_time: string,
  arrival_time: string,
  schedule_date: string,
  seat_capacity: number,
  price: number
}

export interface BusScheduleSummaryApi {
  from_location_id: number,
  to_location_id: number,
  from_location: string,
  to_location: string,
  departure_time?: string,
  travel_date: string,
  bus_count: number
}
