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

