export interface Coaster {
  id: string
  name: string
  park: string
  country: string
  manufacturer: string
  type: string
  created_at: string
}

export interface RideWithCoaster {
  id: string
  coaster_id: string
  ride_date: string
  note: string | null
  created_at: string
  coasters: {
    id: string
    name: string
    park: string
    country: string
    type: string
    manufacturer: string
  }
}
