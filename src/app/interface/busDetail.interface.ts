// interface of data from front end going to API
export interface BusDetail {
  id?: number,
  busDetailId: string,
  fromBusLocationId: string,
  toBusLocationId: string,
  departureTime: string,
  arrivalTime: string,
  scheduleDate: string
}

// interface of data coming from API
export interface BusDetailApi {
  id: number,
  bus_detail_id: number,

  fromBusLocationId: string,
  toBusLocationId: string,
  departureTime: string,
  arrivalTime: string,
  scheduleDate: string
}

// interface of data coming from API
export interface BusDetailBusApi {
  id: number,
  operator_name?: string,
  bus_name: string,
  bus_full_description?: string,
  seat_capacity?: number,
  price?: number
}
