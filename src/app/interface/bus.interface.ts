export interface BusLocation {
  id: number;
  name: string;
}


export interface BusSchedule {
  id?: number,
  busOperatorId: string,
  busDetailId: string,
  fromBusLocationId: string,
  toBusLocationId: string,
  departureTime: string,
  arrivalTime: string,
  scheduleDate: string
}

export interface BusScheduleResult {
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

// export interface BusScheduleSummary{
//   bus_name: string,
//   departure_time: string,
//   arrival_time?: string,
//   from_bus_location: String,
//   to_bus_location: string,
//   schedule_date: string,
//   bus_count: number
// }
